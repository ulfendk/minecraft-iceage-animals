// The odd herd: now and then a naturally spawned woolly mammoth is joined by a ground
// sloth (Megalonyx) and a sabre-toothed cat (Smilodon). The three keep the peace among
// themselves and plod south together, following an invisible waypoint that keeps moving
// ahead of the mammoth. They are ordinary animals otherwise.
import { system, world } from '@minecraft/server';
import { isCarcass } from './util.js';

const CHANCE = 1 / 40; // per naturally spawned mammoth group
const LEG = 32; // blocks per waypoint
const SOUTH = { x: 0, z: 1 }; // +z is south in Minecraft
const MEMBERS = ['iceage:megalonyx', 'iceage:smilodon'];
const herds = new Map(); // leader id -> { marker id, members: [ids] }

function placeAhead(dimension, from) {
  const x = from.x + SOUTH.x * LEG, z = from.z + SOUTH.z * LEG;
  // Only into loaded chunks: the herd waits at the edge until a player comes closer.
  try {
    if (!dimension.isChunkLoaded({ x, y: from.y, z })) return undefined;
    const top = dimension.getTopmostBlock({ x, z });
    if (!top || top.typeId.includes('water')) return undefined;
    return { x, y: top.location.y + 1, z };
  } catch {
    return undefined;
  }
}

/** Spawns the sloth and the cat next to a mammoth and sends the three south. */
export function formOddHerd(leader, { announce = true } = {}) {
  const dim = leader.dimension;
  const at = leader.location;
  const members = [];
  MEMBERS.forEach((type, i) => {
    const side = i ? 2.5 : -2.5;
    try {
      const m = dim.spawnEntity(type, { x: at.x + side, y: at.y + 0.5, z: at.z - 2 }, { spawnEvent: 'iceage:spawn_adult' });
      members.push(m);
    } catch {
      // No room; the herd forms without it.
    }
  });
  for (const e of [leader, ...members]) {
    try { e.triggerEvent('iceage:join_odd_herd'); } catch { /* unloaded */ }
  }
  herds.set(leader.id, { marker: undefined, members: members.map((m) => m.id) });
  if (announce) {
    for (const p of dim.getPlayers({ location: at, maxDistance: 48 })) p.onScreenDisplay.setActionBar({ translate: 'iceage.odd_herd.spotted' });
  }
  return [leader, ...members];
}

/** Moves each herd's waypoint on once the mammoth gets close to it. */
function step() {
  for (const [leaderId, herd] of [...herds]) {
    const leader = world.getEntity(leaderId);
    if (!leader?.isValid || isCarcass(leader)) {
      herds.delete(leaderId);
      if (herd.marker) world.getEntity(herd.marker)?.remove();
      for (const id of herd.members) {
        try { world.getEntity(id)?.triggerEvent('iceage:leave_odd_herd'); } catch { /* gone */ }
      }
      continue;
    }
    let marker = herd.marker ? world.getEntity(herd.marker) : undefined;
    const far = marker?.isValid ? Math.hypot(marker.location.x - leader.location.x, marker.location.z - leader.location.z) : 0;
    if (!marker?.isValid || far < 6) {
      const next = placeAhead(leader.dimension, leader.location);
      if (!next) continue;
      if (marker?.isValid) marker.teleport(next);
      else {
        marker = leader.dimension.spawnEntity('iceage:waypoint', next);
        herd.marker = marker.id;
      }
    }
  }
}

export function setupOddHerd() {
  system.runInterval(step, 60);
  world.afterEvents.entitySpawn.subscribe(({ entity, cause }) => {
    if (cause !== 'Spawned' || entity.typeId !== 'iceage:woolly_mammoth') return;
    if (Math.random() > CHANCE) return;
    system.runTimeout(() => {
      if (!entity.isValid || herds.size >= 2) return;
      // Only one odd herd at a time anywhere near.
      const others = entity.dimension.getEntities({ type: 'iceage:megalonyx', location: entity.location, maxDistance: 256 })
        .filter((e) => { try { return e.getProperty('iceage:odd_herd') === true; } catch { return false; } });
      if (others.length) return;
      formOddHerd(entity);
    }, 20);
  });
  // Waypoints and herds from a previous session: the herd members carry on as a normal
  // peaceful trio, and leftover waypoints are cleaned up when found.
  world.afterEvents.entityLoad.subscribe(({ entity }) => {
    if (entity.typeId === 'iceage:waypoint' && ![...herds.values()].some((h) => h.marker === entity.id)) entity.remove();
  });
  system.afterEvents.scriptEventReceive.subscribe((event) => {
    // /scriptevent iceage:odd_herd: forms an odd herd at the nearest mammoth (or a new one).
    if (event.id !== 'iceage:odd_herd') return;
    const player = event.sourceEntity;
    if (!player) return;
    const near = player.dimension.getEntities({ type: 'iceage:woolly_mammoth', location: player.location, maxDistance: 32, closest: 1 })[0];
    const leader = near ?? player.dimension.spawnEntity('iceage:woolly_mammoth', { x: player.location.x + 4, y: player.location.y, z: player.location.z }, { spawnEvent: 'iceage:spawn_adult' });
    formOddHerd(leader);
  });
}
