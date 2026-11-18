import { extras, quadruped } from '../lib/anim.mjs';
import { sloth } from '../lib/bodies.mjs';
import { all, bone, face, LEGS } from '../lib/parts.mjs';
import { fur, gradient, mottle, region, underside } from '../lib/texture.mjs';

// As heavy as an elephant: 2 m at the shoulder on all fours, 4.6 m from nose to rump plus a
// thick tail. It walks on its knuckles because of its huge claws, and rears up on its hind
// legs and tail - over 4 m tall - to pull down branches.
const model = sloth({ bodyW: 12, bodyH: 10, bodyL: 26, legH: 7, legW: 5, headW: 6, headH: 6, headD: 7, muzzleW: 4, muzzleH: 4, muzzleD: 3, hump: 0, tailL: 10, tailW: 5 });

export default {
  id: 'megatherium',
  name: 'Giant Ground Sloth',
  role: 'megafauna',
  family: ['sloth'],
  size: [1.3, 1.1],
  scale: 2.0,
  health: 70,
  speed: 0.14,
  xp: 7,
  knockbackResistance: 0.9,
  attack: { damage: 10, speed: 1.1, cooldown: 2 },
  breed: ['apple', 'sweet_berries'],
  tempt: ['apple', 'sweet_berries', 'oak_leaves', 'iceage:dwarf_willow'],
  heal: [['apple', 4], ['sweet_berries', 2]],
  sleeps: 'night',
  strollRange: 8,
  spawn: [
    { biomes: ['savanna'], weight: 1, group: [1, 2], blocks: ['grass_block'] },
    { biomes: ['forest'], weight: 1, group: [1, 1] },
  ],
  loot: [{ item: 'leather', min: 2, max: 4 }, { item: 'iceage:raw_game_meat', min: 4, max: 7, smelts: true }],
  sounds: { ambient: 'mob.sniffer.idle', hurt: 'mob.sniffer.hurt', death: 'mob.sniffer.death', pitch: [0.35, 0.45], interval: 24 },
  egg: ['#6e5a42', '#d8cbb0'],

  model: { bones: model.bones },

  materials: SLOTH_COLOURS('#6e5a42', '#8e7a5e'),

  anims: {
    ...quadruped({ tail: ['tail'], ears: ['ear_l', 'ear_r'], swing: 18, sleepDrop: 5, legFold: 70, walkLength: 1.8, runLength: 0.9 }),
    browse: extras.rear({ ...model.rear, angle: 70, length: 4 }),
  },
};

/** Shared ground-sloth colours: a long, shaggy coat, dark claws. */
export function SLOTH_COLOURS(base, light) {
  return {
    fur: { base, layers: [gradient(light, { axis: 1, from: 8, to: 16, where: bone('body') }), underside('#4a3c2c', { y: 7, soft: 2, where: bone('body') }), region('#4a3c2c', all(bone(...LEGS), ({ p }) => p[1] < 4)), mottle(0.12, { scale: 3 }), fur(0.14)] },
    shag: { base, layers: [region('#4a3c2c', ({ i }) => i % 3 === 0), fur(0.18)] },
    muzzle: { base: '#3a3028', layers: [fur(0.05)] },
    ear: '#4a3c2c',
    paw: '#3a3028',
    claw: { base: '#e2d6bc', layers: [region('#b0a488', face('bottom'))] },
    jaw: { base: '#4a3c2c', layers: [region('#8a3a36', face('top'))] },
    fang: '#d8cfb8',
    tail: { base, layers: [fur(0.12)] },
  };
}
