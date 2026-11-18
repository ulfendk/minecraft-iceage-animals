// Frozen remains, dug out of permafrost, thaw over a lit campfire: after a while a young
// Ice Age animal climbs out of the meltwater. Which one is down to luck.
import { GameMode, system, world } from '@minecraft/server';

const THAW_TICKS = 20 * 20;
/** [species, weight]: the big ones are rarer. */
const REVIVED = [
  ['woolly_mammoth', 2], ['mastodon', 1], ['woolly_rhino', 2], ['elasmotherium', 1], ['steppe_bison', 3], ['irish_elk', 2],
  ['wild_horse', 3], ['macrauchenia', 2], ['diprotodon', 1], ['glyptodon', 2], ['doedicurus', 1], ['megatherium', 1],
  ['megalonyx', 2], ['castoroides', 3], ['smilodon', 1], ['homotherium', 1], ['cave_lion', 1], ['cave_bear', 1],
  ['short_faced_bear', 1], ['dire_wolf', 2],
];

function pick() {
  let n = Math.random() * REVIVED.reduce((s, [, w]) => s + w, 0);
  for (const [id, w] of REVIVED) if ((n -= w) < 0) return id;
  return REVIVED[0][0];
}

export function setupThawing() {
  world.beforeEvents.playerInteractWithBlock.subscribe((event) => {
    const { player, block, isFirstEvent } = event;
    if (!isFirstEvent || event.itemStack?.typeId !== 'iceage:frozen_remains') return;
    const lit = /campfire/.test(block.typeId) && block.permutation.getState('extinguished') === false;
    event.cancel = true;
    system.run(() => {
      if (!lit) {
        player.onScreenDisplay.setActionBar({ translate: 'iceage.thaw.need_fire' });
        return;
      }
      if (player.getGameMode() !== GameMode.Creative) {
        const inv = player.getComponent('minecraft:inventory')?.container;
        const held = inv?.getItem(player.selectedSlotIndex);
        if (!held || held.typeId !== 'iceage:frozen_remains') return;
        if (held.amount > 1) {
          held.amount -= 1;
          inv.setItem(player.selectedSlotIndex, held);
        } else {
          inv.setItem(player.selectedSlotIndex, undefined);
        }
      }
      const dimension = block.dimension;
      const at = { x: block.location.x + 0.5, y: block.location.y + 1, z: block.location.z + 0.5 };
      dimension.playSound('random.fizz', at, { pitch: 0.6 });
      player.onScreenDisplay.setActionBar({ translate: 'iceage.thaw.start' });
      for (const t of [THAW_TICKS / 3, (2 * THAW_TICKS) / 3]) {
        system.runTimeout(() => {
          try {
            dimension.playSound('random.fizz', at, { pitch: 0.8 });
            dimension.spawnParticle('minecraft:water_splash_particle', at);
          } catch { /* unloaded */ }
        }, t);
      }
      system.runTimeout(() => {
        try {
          const spot = { x: at.x + 1.5, y: block.location.y, z: at.z };
          dimension.spawnEntity(`iceage:${pick()}<iceage:entity_born>`, spot);
          dimension.playSound('random.splash', spot);
          for (const p of dimension.getPlayers({ location: at, maxDistance: 16 })) p.onScreenDisplay.setActionBar({ translate: 'iceage.thaw.done' });
        } catch {
          // Chunk unloaded before it thawed.
        }
      }, THAW_TICKS);
    });
  });
}
