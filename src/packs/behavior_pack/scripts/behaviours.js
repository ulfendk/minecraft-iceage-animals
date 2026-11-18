// Behaviours that entity JSON alone can't express: calls and threat displays, ground
// sloths rearing up to browse, and Doedicurus swinging its tail club.
import { system, world } from '@minecraft/server';
import { chance, isBaby, nearPlayers, ready } from './util.js';

const TICK = 40; // run every 2 seconds

function play(entity, anim, sound, pitch = 1, volume = 1.5) {
  try {
    entity.playAnimation(`animation.iceage.${entity.typeId.split(':')[1]}.${anim}`, { blendOutTime: 0.3 });
    if (sound) entity.dimension.playSound(sound, entity.location, { pitch, volume });
  } catch {
    // Entity unloaded between query and use.
  }
}

const closePlayers = (e, range) => e.dimension.getPlayers({ location: e.location, maxDistance: range }).length > 0;

/** Trumpets and roars, now and then and as a warning when a player comes close. */
function calls(now) {
  for (const type of ['iceage:woolly_mammoth', 'iceage:mastodon']) {
    for (const m of nearPlayers(type, 64)) {
      if (chance(0.015) && ready(m, 'trumpet', 600, now)) play(m, 'trumpet', 'mob.ravager.roar', type === 'iceage:mastodon' ? 1.2 : 1.35, 3);
    }
  }
  for (const [type, warn, pitch] of [['iceage:cave_lion', 10, 0.5], ['iceage:smilodon', 7, 0.6], ['iceage:homotherium', 7, 0.7]]) {
    for (const cat of nearPlayers(type, 48)) {
      if (isBaby(cat)) continue;
      if (closePlayers(cat, warn) && ready(cat, 'warn', 300, now)) play(cat, 'roar', 'mob.ravager.roar', pitch, 2.5);
      else if (chance(0.01) && ready(cat, 'roar', 800, now)) play(cat, 'roar', 'mob.ravager.roar', pitch + 0.05, 2.5);
    }
  }
  for (const wolf of nearPlayers('iceage:dire_wolf', 48)) {
    const night = world.getTimeOfDay() > 13000 && world.getTimeOfDay() < 23000;
    if (night && chance(0.02) && ready(wolf, 'howl', 600, now)) play(wolf, 'howl', 'mob.wolf.growl', 0.6, 3);
  }
}

const BEARS = [['iceage:cave_bear', 6, 0.6], ['iceage:short_faced_bear', 9, 0.5]];

/** Bears rear up and roar at players who come close. */
function displays(now) {
  for (const [type, range, pitch] of BEARS) {
    for (const b of nearPlayers(type, 16)) {
      if (isBaby(b)) continue;
      if (closePlayers(b, range) && ready(b, 'rear', 200, now)) play(b, 'rear', 'mob.polarbear.warning', pitch, 2.5);
    }
  }
  for (const r of nearPlayers('iceage:woolly_rhino', 16)) {
    if (!isBaby(r) && closePlayers(r, 6) && ready(r, 'snort', 160, now)) r.dimension.playSound('mob.hoglin.angry', r.location, { pitch: 0.5, volume: 2 });
  }
}

/** Ground sloths rear up on their hind legs and tail to pull down branches. */
function browse(now) {
  for (const type of ['iceage:megatherium', 'iceage:megalonyx']) {
    for (const s of nearPlayers(type, 32)) {
      if (isBaby(s) || !chance(0.04) || !ready(s, 'browse', 400, now)) continue;
      let leaves = false;
      try {
        const l = s.location;
        for (let dy = 3; dy <= 6 && !leaves; dy++) {
          leaves = /leaves/.test(s.dimension.getBlock({ x: Math.floor(l.x), y: Math.floor(l.y) + dy, z: Math.floor(l.z) - 1 })?.typeId ?? '');
        }
      } catch { continue; }
      if (leaves || chance(0.3)) play(s, 'browse', 'block.sweet_berry_bush.pick', 0.6, 1);
    }
  }
}

/** Doedicurus swings its spiked tail club at whatever hurts it. */
function onHurt({ hurtEntity, damageSource }) {
  let type;
  try { type = hurtEntity.typeId; } catch { return; }
  if (type !== 'iceage:doedicurus') return;
  const attacker = damageSource?.damagingEntity;
  if (!attacker || attacker === hurtEntity || damageSource.cause !== 'entityAttack') return;
  play(hurtEntity, 'tail_swing', 'mob.irongolem.throw', 0.6, 1.5);
  system.runTimeout(() => {
    try {
      const d = Math.hypot(attacker.location.x - hurtEntity.location.x, attacker.location.z - hurtEntity.location.z);
      if (d < 4.5) attacker.applyDamage(6, { cause: 'entityAttack', damagingEntity: hurtEntity });
    } catch {
      // Gone.
    }
  }, 8);
}

export function setupBehaviours() {
  system.runInterval(() => {
    const now = system.currentTick;
    for (const step of [calls, displays, browse]) {
      try {
        step(now);
      } catch (e) {
        console.warn(`[Ice Age Animals] ${step.name}: ${e}`);
      }
    }
  }, TICK);
  world.afterEvents.entityHurt.subscribe(onHurt);
}
