import { quadruped } from '../lib/anim.mjs';
import { ursid } from '../lib/bodies.mjs';
import { all, bone, face, LEGS } from '../lib/parts.mjs';
import { fur, gradient, mottle, region, underside } from '../lib/texture.mjs';

// A wombat the size of a rhino: 1.8 m at the shoulder and 3.8 m long, a barrel body on
// short, pigeon-toed legs, a big deep head with a broad, naked nose.
const model = ursid({ bodyW: 14, bodyH: 11, bodyL: 28, legH: 9, legW: 5, headW: 9, headH: 8, headD: 8, muzzleW: 6, muzzleH: 5, muzzleD: 3, earSize: 2 });

export default {
  id: 'diprotodon',
  name: 'Diprotodon',
  role: 'megafauna',
  family: ['marsupial', 'grazer'],
  size: [1.4, 1.3],
  scale: 1.5,
  health: 50,
  speed: 0.18,
  xp: 6,
  knockbackResistance: 0.85,
  attack: { damage: 8, speed: 1.3, cooldown: 2 },
  breed: ['wheat', 'iceage:dwarf_willow'],
  tempt: ['wheat', 'iceage:dwarf_willow', 'sweet_berries'],
  heal: [['wheat', 2], ['sweet_berries', 2]],
  grazes: true,
  sleeps: 'day',
  spawn: [
    { biomes: ['savanna'], weight: 2, group: [2, 4], blocks: ['grass_block', 'coarse_dirt'] },
    { biomes: ['mesa'], weight: 1, group: [1, 3] },
  ],
  loot: [{ item: 'leather', min: 1, max: 3 }, { item: 'iceage:raw_game_meat', min: 3, max: 6, smelts: true }],
  sounds: { ambient: 'mob.sniffer.idle', hurt: 'mob.sniffer.hurt', death: 'mob.sniffer.death', pitch: [0.5, 0.6], interval: 22 },
  egg: ['#7a6a58', '#3a3028'],

  model,

  materials: {
    fur: {
      base: '#7a6a58',
      layers: [gradient('#9a8a74', { axis: 1, from: 12, to: 20, where: bone('body') }), underside('#5e5044', { y: 10, soft: 2, where: bone('body') }), region('#4e4238', all(bone(...LEGS), ({ p }) => p[1] < 5)), mottle(0.1, { scale: 3 }), fur(0.1)],
    },
    muzzle: { base: '#3a3028', layers: [region('#2a221c', face('front')), fur(0.04)] },
    ear: '#5e5044',
    paw: '#3a3028',
    claw: '#c8bca6',
    jaw: { base: '#5e5044', layers: [region('#8a3a36', face('top'))] },
    fang: '#e8e0cc',
  },

  anims: quadruped({ tail: ['tail'], ears: ['ear_l', 'ear_r'], swing: 22, sleepDrop: 6, legFold: 75, walkLength: 1.4, runLength: 0.7 }),
};
