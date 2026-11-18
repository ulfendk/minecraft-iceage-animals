import { extras, quadruped } from '../lib/anim.mjs';
import { felid } from '../lib/bodies.mjs';
import { all, bone, face, LEGS } from '../lib/parts.mjs';
import { fur, gradient, mottle, region, spots, underside } from '../lib/texture.mjs';

/**
 * Adds a pair of sabre teeth to a felid() head: two long cubes hanging from the front of
 * the upper jaw (the lower jaw sits behind them).
 */
export function sabres(model, { length = 4, mat = 'sabre' } = {}) {
  return {
    ...model,
    bones: model.bones.map((b) => {
      if (b.name !== 'head') return b;
      const muzzle = b.cubes.find((c) => c.mat === 'muzzle');
      const [x0, y0, z0] = muzzle.origin;
      const w = muzzle.size[0];
      return {
        ...b,
        cubes: [
          ...b.cubes.filter((c) => c.mat !== 'fang'),
          { origin: [x0, y0 - length + 1, z0 + 0.5], size: [1, length, 1], mat },
          { origin: [x0 + w - 1, y0 - length + 1, z0 + 0.5], size: [1, length, 1], mat },
        ],
      };
    }),
  };
}

// Stockier than a lion and about as tall (1.15 m at the shoulder, 2 m long): powerful front
// legs, a short bobbed tail and canines as long as a hand.
const model = sabres(felid({
  bodyW: 10, bodyH: 8, bodyL: 18, legH: 7, legW: 4, headW: 8, headH: 7, headD: 6, muzzleW: 4, muzzleH: 4, muzzleD: 3,
  tailL: 4, jaw: true, jawOpen: 28, eyeColor: '#c8a040',
}), { length: 4 });

export default {
  id: 'smilodon',
  name: 'Smilodon',
  role: 'predator',
  family: ['big_cat', 'feline', 'sabre_tooth'],
  size: [1.0, 1.0],
  scale: 1.3,
  health: 36,
  speed: 0.27,
  xp: 6,
  knockbackResistance: 0.4,
  attack: { damage: 8, speed: 1.6, leap: true },
  hunts: ['bovine', 'equine', 'deer', 'macrauchenia'],
  huntInterval: 30,
  huntRange: 18,
  // Only near-misses: it goes for anyone who walks right up to it, and never in the odd herd.
  hostile: { range: 5, filters: [{ test: 'is_baby', subject: 'self', value: false }, { test: 'bool_property', subject: 'self', domain: 'iceage:odd_herd', value: false }] },
  sleeps: 'day',
  breed: ['beef', 'iceage:raw_game_meat'],
  tempt: ['beef', 'iceage:raw_game_meat'],
  heal: [['beef', 4], ['iceage:raw_game_meat', 4]],
  spawn: [
    { biomes: ['steppe'], weight: 1, group: [1, 2] },
    { biomes: ['plains'], weight: 1, group: [1, 2], blocks: ['grass_block'] },
    { biomes: ['savanna'], weight: 1, group: [1, 2], blocks: ['grass_block'] },
  ],
  loot: [{ item: 'leather', min: 0, max: 2 }, { item: 'bone', min: 0, max: 2 }],
  sounds: { ambient: 'mob.polarbear.warning', hurt: 'mob.polarbear.hurt', death: 'mob.polarbear.death', pitch: [0.7, 0.8], interval: 28 },
  egg: ['#b88a50', '#efe6d0'],

  model,

  materials: {
    fur: {
      base: '#b88a50',
      layers: [
        // Faint spots on the flanks and a pale belly.
        spots('#9a7040', { size: 2.5, radius: 0.25, where: all(bone('body', ...LEGS), face('left', 'right')) }),
        underside('#e4cfa4', { y: 10, soft: 2, where: bone('body') }),
        gradient('#d8bc8a', { axis: 1, from: 6, to: 1, where: bone(...LEGS) }),
        mottle(0.06), fur(0.06),
      ],
    },
    muzzle: { base: '#dcc49a', layers: [region('#eee0c0', face('bottom', 'left', 'right')), fur(0.05)] },
    ear: { base: '#b88a50', layers: [region('#3a2516', face('back'))] },
    tail: { base: '#b88a50', layers: [region('#3a2516', ({ p }) => p[1] < 7)] },
    jaw: { base: '#c89a60', layers: [region('#a8443c', face('top'))] },
    sabre: { base: '#f4ecd6', layers: [region('#d8cba8', ({ p }) => p[1] < 5)] },
    paw: '#a87a44',
  },

  anims: {
    ...quadruped({ tail: ['tail', 'tail2'], ears: ['ear_l', 'ear_r'], swing: 26, sleepDrop: 6, legFold: 80, walkLength: 1.1, runLength: 0.45 }),
    roar: extras.roar({ head: 'head', jaw: 'jaw' }),
  },
};
