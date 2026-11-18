import { extras, quadruped } from '../lib/anim.mjs';
import { ursid } from '../lib/bodies.mjs';
import { all, bone, face } from '../lib/parts.mjs';
import { fur, gradient, mottle, region, underside } from '../lib/texture.mjs';

// Bigger than a grizzly (1.35 m at the shoulder on all fours, 2.9 m long), with a steep,
// domed forehead. It mostly ate plants and slept through the winter in caves.
const base = ursid({ bodyW: 12, bodyH: 9, bodyL: 20, legH: 6, legW: 5, headW: 8, headH: 7, headD: 7, muzzleW: 4, muzzleH: 4, muzzleD: 3, hump: 1 });
const model = {
  ...base,
  bones: base.bones.map((b) => (b.name === 'head'
    // The steep, domed forehead.
    ? { ...b, cubes: [...b.cubes, { origin: [-3, b.cubes[0].origin[1] + 7, b.cubes[0].origin[2] + 1], size: [6, 1, 5], mat: 'fur' }] }
    : b)),
};

export default {
  id: 'cave_bear',
  name: 'Cave Bear',
  role: 'megafauna',
  family: ['bear'],
  size: [1.1, 1.0],
  scale: 1.5,
  health: 50,
  speed: 0.24,
  xp: 6,
  knockbackResistance: 0.7,
  attack: { damage: 9, speed: 1.4 },
  hostile: { range: 4 },
  sleeps: 'night',
  breed: ['sweet_berries', 'honeycomb'],
  tempt: ['sweet_berries', 'honeycomb', 'honey_bottle', 'apple'],
  heal: [['sweet_berries', 2], ['honeycomb', 4], ['honey_bottle', 6], ['apple', 3]],
  spawn: [
    { biomes: ['taiga'], weight: 2, group: [1, 2] },
    { biomes: ['mountain'], weight: 1, group: [1, 1] },
  ],
  loot: [{ item: 'leather', min: 1, max: 3 }, { item: 'iceage:raw_game_meat', min: 2, max: 4, smelts: true }],
  sounds: { ambient: 'mob.polarbear.idle', hurt: 'mob.polarbear.hurt', death: 'mob.polarbear.death', pitch: [0.5, 0.6], interval: 22 },
  egg: ['#5a3e28', '#9a7a58'],

  model,

  materials: {
    fur: {
      base: '#5a3e28',
      layers: [gradient('#7a5a3c', { axis: 1, from: 10, to: 16, where: all(bone('body'), face('top', 'left', 'right')) }), region('#3e2a1a', bone('leg_fl', 'leg_fr', 'leg_bl', 'leg_br')), underside('#46301e', { y: 7, soft: 2, where: bone('body') }), mottle(0.1, { scale: 3 }), fur(0.1)],
    },
    muzzle: { base: '#7a5a3c', layers: [fur(0.06)] },
    ear: '#3e2a1a',
    paw: '#2a1c12',
    claw: '#cfc2a6',
    jaw: { base: '#7a5a3c', layers: [region('#8a3a36', face('top'))] },
    fang: '#efe8d8',
  },

  anims: {
    ...quadruped({ tail: ['tail'], ears: ['ear_l', 'ear_r'], swing: 24, sleepDrop: 4, legFold: 75, walkLength: 1.3, runLength: 0.55 }),
    rear: extras.rear(model.rear),
  },
};
