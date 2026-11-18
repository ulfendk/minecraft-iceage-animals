import { extras, quadruped } from '../lib/anim.mjs';
import { felid } from '../lib/bodies.mjs';
import { all, bone, face, LEGS } from '../lib/parts.mjs';
import { fur, gradient, mottle, region, underside } from '../lib/texture.mjs';
import { sabres } from './smilodon.mjs';

// The scimitar-toothed cat: 1.1 m at the shoulder, long front legs and a back that slopes
// down to the hips like a hyena's, shorter, flatter sabres and a short tail.
const base = felid({
  bodyW: 8, bodyH: 8, bodyL: 18, legH: 8, legW: 3, headW: 7, headH: 6, headD: 6, muzzleW: 4, muzzleH: 3, muzzleD: 3,
  tailL: 6, jaw: true, jawOpen: 20, eyeColor: '#d0a83a', slope: 2,
});
const model = sabres({
  bones: base.bones.map((b) => {
    // Longer front legs: the back legs are 2 px shorter, so the back slopes down.
    if (b.name === 'leg_bl' || b.name === 'leg_br') return { ...b, pivot: [b.pivot[0], b.pivot[1] - 2, b.pivot[2]], cubes: b.cubes.map((c) => ({ ...c, size: [c.size[0], Math.max(1, c.size[1] - (c.mat === 'fur' ? 2 : 0)), c.size[2]] })) };
    return b;
  }),
}, { length: 3 });

export default {
  id: 'homotherium',
  name: 'Homotherium',
  role: 'predator',
  family: ['big_cat', 'feline', 'sabre_tooth'],
  size: [0.9, 1.0],
  scale: 1.25,
  health: 30,
  speed: 0.3,
  xp: 5,
  attack: { damage: 7, speed: 1.6, leap: true },
  alertsPack: true,
  hunts: ['equine', 'deer', 'bovine'],
  huntInterval: 25,
  huntRange: 22,
  hostile: { range: 6, filters: [{ test: 'is_baby', subject: 'self', value: false }] },
  sleeps: 'night',
  breed: ['beef', 'iceage:raw_game_meat'],
  tempt: ['beef', 'iceage:raw_game_meat'],
  heal: [['beef', 4], ['iceage:raw_game_meat', 4]],
  spawn: [
    { biomes: ['steppe'], weight: 1, group: [2, 3] },
    { biomes: ['tundra'], weight: 1, group: [2, 3] },
  ],
  loot: [{ item: 'leather', min: 0, max: 2 }, { item: 'bone', min: 0, max: 2 }],
  sounds: { ambient: 'mob.polarbear.warning', hurt: 'mob.polarbear.hurt', death: 'mob.polarbear.death', pitch: [0.85, 0.95], interval: 28 },
  egg: ['#c8a878', '#5a4430'],

  model,

  materials: {
    fur: {
      base: '#c8a878',
      layers: [
        underside('#e8d8b8', { y: 10, soft: 2, where: bone('body') }),
        gradient('#a4845a', { axis: 1, from: 12, to: 16, where: all(bone('body'), face('top', 'left', 'right')) }),
        region('#a4845a', all(bone(...LEGS), ({ p }) => p[1] < 3)),
        mottle(0.08), fur(0.07),
      ],
    },
    muzzle: { base: '#e2d0ac', layers: [fur(0.05)] },
    ear: { base: '#c8a878', layers: [region('#4a3828', face('back'))] },
    tail: { base: '#c8a878', layers: [region('#5a4430', ({ p }) => p[1] < 10)] },
    jaw: { base: '#d8bc90', layers: [region('#a8443c', face('top'))] },
    sabre: '#f4ecd6',
    paw: '#a4845a',
  },

  anims: {
    ...quadruped({ tail: ['tail', 'tail2'], ears: ['ear_l', 'ear_r'], swing: 30, sleepDrop: 6, legFold: 80, walkLength: 1.0, runLength: 0.42 }),
    roar: extras.roar({ head: 'head', jaw: 'jaw' }),
  },
};
