import { ItemStack, system, world } from '@minecraft/server';
import { ITEMS } from './data.js';
import { formOddHerd } from './oddherd.js';

/**
 * Used by tools/bds-test.sh: reports how many of each Ice Age animal exist and which
 * expected ones are missing. Message = space-separated expected ids.
 */
export function selfTest(message) {
  const expected = message.split(/\s+/).filter(Boolean);
  const counts = {};
  for (const e of world.getDimension('overworld').getEntities()) {
    if (e.typeId.startsWith('iceage:')) counts[e.typeId] = (counts[e.typeId] ?? 0) + 1;
  }
  const missing = expected.filter((id) => !counts[`iceage:${id}`]);
  // Every custom item and block must exist as an item.
  for (const id of ITEMS) {
    try {
      new ItemStack(id, 1);
    } catch {
      missing.push(id);
    }
  }
  console.log(`[Ice Age Animals] selftest found ${JSON.stringify(counts)}`);

  const dim = world.getDimension('overworld');
  // Predators that charge actually land their hits: each one is hurt by a villager and goes for it.
  ['smilodon', 'woolly_rhino', 'dire_wolf'].forEach((id, i) => {
    const z = 10.5 + i * 8;
    const animal = dim.spawnEntity(`iceage:${id}`, { x: 44.5, y: -60, z }, { spawnEvent: 'iceage:spawn_adult' });
    const victim = dim.spawnEntity('minecraft:villager_v2', { x: 48.5, y: -60, z });
    const before = victim.getComponent('minecraft:health').currentValue;
    animal.applyDamage(1, { cause: 'entityAttack', damagingEntity: victim });
    system.runTimeout(() => {
      const after = victim.isValid ? victim.getComponent('minecraft:health').currentValue : 0;
      console.log(`[Ice Age Animals] selftest charge ${id}: villager health ${before} -> ${after}`);
      if (after >= before) missing.push(`${id} attack damage`);
    }, 200);
  });

  // The odd herd forms: a mammoth gets a sloth and a sabre-toothed cat for company.
  const mammoth = dim.spawnEntity('iceage:woolly_mammoth', { x: 60.5, y: -60, z: 60.5 }, { spawnEvent: 'iceage:spawn_adult' });
  const herd = formOddHerd(mammoth, { announce: false });
  system.runTimeout(() => {
    const joined = herd.filter((e) => {
      try { return e.isValid && e.getProperty('iceage:odd_herd') === true; } catch { return false; }
    });
    console.log(`[Ice Age Animals] selftest odd herd: ${joined.map((e) => e.typeId).join(', ')}`);
    if (joined.length !== 3) missing.push('odd herd');
  }, 20);

  system.runTimeout(() => {
    console.log(missing.length ? `[Ice Age Animals] selftest FAIL missing: ${missing.join(' ')}` : '[Ice Age Animals] selftest PASS');
  }, 210);
}
