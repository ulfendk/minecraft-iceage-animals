import { extras, quadruped } from '../lib/anim.mjs';
import { felid } from '../lib/bodies.mjs';
import { all, bone, face, LEGS } from '../lib/parts.mjs';
import { fur, gradient, mottle, region, stripes, underside } from '../lib/texture.mjs';

// A tenth bigger than a modern lion (1.2 m at the shoulder, 2.3 m long), pale, maneless, with
// a thick winter coat and faint stripes on the flanks, as the cave paintings show it.
export default {
  id: 'cave_lion',
  name: 'Cave Lion',
  role: 'predator',
  family: ['big_cat', 'feline'],
  size: [1.0, 1.0],
  scale: 1.4,
  health: 38,
  speed: 0.28,
  xp: 6,
  knockbackResistance: 0.4,
  attack: { damage: 8, speed: 1.6, leap: true },
  alertsPack: true,
  hunts: ['equine', 'deer', 'bovine'],
  huntInterval: 25,
  huntRange: 20,
  hostile: { range: 7, filters: [{ test: 'is_daytime', subject: 'self', value: false }, { test: 'is_baby', subject: 'self', value: false }] },
  sleeps: 'day',
  breed: ['beef', 'iceage:raw_game_meat'],
  tempt: ['beef', 'iceage:raw_game_meat'],
  heal: [['beef', 4], ['iceage:raw_game_meat', 4]],
  spawn: [
    { biomes: ['steppe'], weight: 1, group: [2, 3] },
    { biomes: ['tundra'], weight: 1, group: [1, 3] },
    { biomes: ['taiga'], weight: 1, group: [1, 2] },
  ],
  loot: [{ item: 'leather', min: 0, max: 2 }, { item: 'bone', min: 0, max: 2 }],
  sounds: { ambient: 'mob.polarbear.warning', hurt: 'mob.polarbear.hurt', death: 'mob.polarbear.death', pitch: [0.55, 0.65], interval: 25 },
  egg: ['#d2b88e', '#7a5c3a'],

  model: felid({
    bodyW: 10, bodyH: 8, bodyL: 18, legH: 7, legW: 4, headW: 8, headH: 7, headD: 6, muzzleW: 4, muzzleH: 4, muzzleD: 3,
    tailL: 13, tuft: true, jaw: true, jawOpen: 15, eyeColor: '#d8a428',
  }),

  materials: {
    fur: {
      base: '#d2b88e',
      layers: [
        stripes('#b89a6e', { axis: 2, period: 4, width: 0.3, where: all(bone('body'), face('left', 'right')) }),
        underside('#ece0c6', { y: 10, soft: 2, where: bone('body') }),
        gradient('#e4d4b4', { axis: 1, from: 6, to: 1, where: bone(...LEGS) }),
        mottle(0.06), fur(0.08),
      ],
    },
    muzzle: { base: '#e8dac0', layers: [fur(0.05)] },
    ear: { base: '#d2b88e', layers: [region('#3a2a1c', face('back'))] },
    tail: { base: '#d2b88e', layers: [fur(0.05)] },
    tuft: { base: '#4a3424', layers: [fur(0.1)] },
    jaw: { base: '#d2b88e', layers: [region('#a8443c', face('top'))] },
    fang: '#f4efe2',
    paw: '#bca076',
  },

  anims: {
    ...quadruped({ tail: ['tail', 'tail2'], ears: ['ear_l', 'ear_r'], swing: 28, sleepDrop: 6, legFold: 80, walkLength: 1.1, runLength: 0.45 }),
    roar: extras.roar({ head: 'head', jaw: 'jaw' }),
  },
};
