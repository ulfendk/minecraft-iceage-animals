import { extras, quadruped } from '../lib/anim.mjs';
import { ursid } from '../lib/bodies.mjs';
import { all, bone, face } from '../lib/parts.mjs';
import { fur, gradient, mottle, region, underside } from '../lib/texture.mjs';

// Long-legged and short-faced: 1.6 m at the shoulder on all fours and over 3 m standing up.
// It bullied other predators off their kills.
const model = ursid({ bodyW: 11, bodyH: 9, bodyL: 20, legH: 9, legW: 4, headW: 8, headH: 7, headD: 6, muzzleW: 5, muzzleH: 4, muzzleD: 2, hump: 0 });

export default {
  id: 'short_faced_bear',
  name: 'Short-faced Bear',
  role: 'predator',
  family: ['bear'],
  size: [1.1, 1.2],
  scale: 1.5,
  health: 50,
  speed: 0.28,
  xp: 7,
  knockbackResistance: 0.7,
  attack: { damage: 10, speed: 1.5 },
  hunts: ['deer', 'equine'],
  huntInterval: 60,
  hostile: { range: 8, filters: [{ test: 'is_baby', subject: 'self', value: false }] },
  sleeps: 'night',
  breed: ['beef', 'iceage:raw_game_meat'],
  tempt: ['beef', 'iceage:raw_game_meat', 'salmon'],
  heal: [['beef', 4], ['iceage:raw_game_meat', 4], ['salmon', 3]],
  spawn: [
    { biomes: ['steppe'], weight: 1, group: [1, 1] },
    { biomes: ['plains'], weight: 1, group: [1, 1], blocks: ['grass_block'] },
    { biomes: ['taiga'], weight: 1, group: [1, 1] },
  ],
  loot: [{ item: 'leather', min: 1, max: 3 }, { item: 'iceage:raw_game_meat', min: 2, max: 4, smelts: true }],
  sounds: { ambient: 'mob.polarbear.idle', hurt: 'mob.polarbear.hurt', death: 'mob.polarbear.death', pitch: [0.45, 0.55], interval: 22 },
  egg: ['#7a5a38', '#d8c4a0'],

  model,

  materials: {
    fur: {
      base: '#7a5a38',
      layers: [gradient('#a07e58', { axis: 1, from: 13, to: 19, where: all(bone('body'), face('top', 'left', 'right', 'front')) }), region('#4e3822', bone('leg_fl', 'leg_fr', 'leg_bl', 'leg_br')), underside('#5a422a', { y: 10, soft: 2, where: bone('body') }), mottle(0.1, { scale: 3 }), fur(0.1)],
    },
    muzzle: { base: '#c8ae86', layers: [fur(0.06)] },
    ear: '#4e3822',
    paw: '#2e2016',
    claw: '#d8cbb0',
    jaw: { base: '#c8ae86', layers: [region('#8a3a36', face('top'))] },
    fang: '#efe8d8',
  },

  anims: {
    ...quadruped({ tail: ['tail'], ears: ['ear_l', 'ear_r'], swing: 28, sleepDrop: 7, legFold: 80, walkLength: 1.1, runLength: 0.5 }),
    rear: extras.rear(model.rear),
  },
};
