import { quadruped } from '../lib/anim.mjs';
import { felid } from '../lib/bodies.mjs';
import { all, bone, face, LEGS } from '../lib/parts.mjs';
import { fur, gradient, mottle, region, underside } from '../lib/texture.mjs';

// A little bigger and heavier than the biggest grey wolves (0.85 m at the shoulder, 1.6 m
// long), with a broad head and massive jaws. Packs hunt on the plains at night.
export default {
  id: 'dire_wolf',
  name: 'Dire Wolf',
  role: 'predator',
  family: ['canine', 'wolf'],
  size: [0.7, 0.9],
  scale: 1.0,
  health: 22,
  speed: 0.32,
  xp: 4,
  attack: { damage: 5, speed: 1.5, leap: true },
  alertsPack: true,
  hunts: ['equine', 'deer', 'rabbit', 'sheep'],
  huntInterval: 25,
  huntRange: 20,
  hostile: { range: 10, filters: [{ test: 'is_daytime', subject: 'self', value: false }, { test: 'is_baby', subject: 'self', value: false }] },
  sleeps: 'day',
  breed: ['iceage:raw_game_meat', 'mutton'],
  tempt: ['iceage:raw_game_meat', 'mutton', 'bone'],
  heal: [['iceage:raw_game_meat', 4], ['mutton', 3]],
  spawn: [
    { biomes: ['plains'], weight: 2, group: [3, 6], blocks: ['grass_block'] },
    { biomes: ['steppe'], weight: 2, group: [3, 6] },
    { biomes: ['tundra'], weight: 1, group: [3, 5] },
  ],
  loot: [{ item: 'bone', min: 0, max: 2 }, { item: 'leather', min: 0, max: 1 }],
  sounds: { ambient: 'mob.wolf.growl', hurt: 'mob.wolf.hurt', death: 'mob.wolf.death', pitch: [0.6, 0.7], interval: 14 },
  egg: ['#7a7064', '#e0d8c8'],
  client: { runSpeed: 5 },

  model: felid({ bodyW: 7, bodyH: 7, bodyL: 16, legH: 8, legW: 3, headW: 6, headH: 5, headD: 5, muzzleW: 3, muzzleH: 3, muzzleD: 4, tailL: 9, earH: 3, earW: 2, eyeColor: '#c89a3a' }),

  materials: {
    fur: {
      base: '#7a7064',
      layers: [
        gradient('#4e463c', { axis: 1, from: 11, to: 14, where: all(bone('body'), face('top', 'left', 'right')) }),
        underside('#d8cfbe', { y: 9, soft: 2, where: bone('body') }),
        gradient('#b8ae9e', { axis: 1, from: 6, to: 1, where: bone(...LEGS) }),
        region('#d8cfbe', all(bone('head'), face('bottom'))),
        mottle(0.1, { scale: 2 }), fur(0.1),
      ],
    },
    muzzle: { base: '#b8ae9e', layers: [region('#1e1a16', face('front')), fur(0.05)] },
    ear: { base: '#5a5248', layers: [region('#2e2a24', face('back'))] },
    tail: { base: '#6a6054', layers: [region('#2e2a24', ({ p }) => p[1] < 6), fur(0.1)] },
    paw: '#5a5248',
  },

  anims: {
    ...quadruped({ tail: ['tail', 'tail2'], ears: ['ear_l', 'ear_r'], swing: 34, sleepDrop: 6, legFold: 85, walkLength: 0.8, runLength: 0.35 }),
    howl: { animation_length: 2.5, bones: { head: { rotation: { '0.0': [0, 0, 0], '0.4': [-50, 0, 0], '2.1': [-50, 0, 0], '2.5': [0, 0, 0] } } } },
  },
};
