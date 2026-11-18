import { quadruped } from '../lib/anim.mjs';
import { legs4 } from '../lib/parts.mjs';
import { fur, mottle, region } from '../lib/texture.mjs';

// A beaver as long as a person (1.5 m without its tail), low on short legs, with a broad flat
// tail and orange incisors 15 cm long.
export default {
  id: 'castoroides',
  name: 'Giant Beaver',
  role: 'prey',
  family: ['beaver', 'rodent'],
  movement: 'amphibious',
  swimSpeed: 0.12,
  size: [0.9, 0.7],
  scale: 0.8,
  health: 20,
  speed: 0.17,
  xp: 3,
  breed: ['birch_log', 'apple'],
  tempt: ['apple', 'stick', 'birch_log'],
  heal: [['apple', 3]],
  sleeps: 'day',
  strollRange: 8,
  spawn: [
    { biomes: ['river'], weight: 2, group: [1, 3] },
    { biomes: ['swamp'], weight: 1, group: [1, 2] },
  ],
  loot: [{ item: 'leather', min: 0, max: 2 }, { item: 'iceage:raw_game_meat', min: 1, max: 2, smelts: true }],
  sounds: { ambient: 'mob.armadillo.ambient', hurt: 'mob.armadillo.hurt', death: 'mob.armadillo.death', pitch: [0.7, 0.8], interval: 24 },
  egg: ['#6a4428', '#e88a2a'],

  model: {
    bones: [
      { name: 'root', pivot: [0, 0, 0] },
      { name: 'body', parent: 'root', pivot: [0, 6, 0], cubes: [{ origin: [-6, 2, -10], size: [12, 10, 20], mat: 'fur' }] },
      {
        name: 'head', parent: 'body', pivot: [0, 8, -10],
        cubes: [
          { origin: [-4.5, 4, -17], size: [9, 7, 8], mat: 'fur', marks: [{ face: 'right', x: 4, y: 1, color: '#100c08' }, { face: 'left', x: 3, y: 1, color: '#100c08' }] },
          { origin: [-3, 4, -19], size: [6, 4, 2], mat: 'muzzle', marks: [{ face: 'front', x: 1, y: 0, color: '#1a120c' }, { face: 'front', x: 4, y: 0, color: '#1a120c' }] },
          // The big orange front teeth.
          { origin: [-1.5, 2, -19], size: [3, 2, 1], mat: 'tooth' },
        ],
      },
      { name: 'ear_l', parent: 'head', pivot: [3.5, 11, -11.5], cubes: [{ origin: [3, 11, -12], size: [1, 1, 1], mat: 'fur' }] },
      { name: 'ear_r', parent: 'head', pivot: [-3.5, 11, -11.5], cubes: [{ origin: [-4, 11, -12], size: [1, 1, 1], mat: 'fur' }] },
      { name: 'tail', parent: 'body', pivot: [0, 4, 10], rotation: [-10, 0, 0], cubes: [{ origin: [-4, 3, 10], size: [8, 1, 14], mat: 'tail' }] },
      ...legs4({ x: 6, front: -8, back: 5, w: 3, d: 3, h: 4, foot: 1, mat: 'fur', footMat: 'foot' }),
    ],
  },

  materials: {
    fur: { base: '#6a4428', layers: [region('#8a5c38', ({ face: f }) => f === 'top'), mottle(0.1, { scale: 3 }), fur(0.1)] },
    muzzle: { base: '#4a3020', layers: [fur(0.05)] },
    tooth: { base: '#e88a2a', layers: [region('#c86a18', ({ face: f }) => f === 'bottom')] },
    tail: { base: '#2e2620', layers: [region('#3e342c', ({ i, j }) => (i + j) % 2 === 0)] },
    foot: '#2e2620',
  },

  anims: {
    ...quadruped({ tail: ['tail'], ears: ['ear_l', 'ear_r'], swing: 30, sleepDrop: 2, legFold: 60, walkLength: 0.8, runLength: 0.45 }),
    swim: {
      loop: true, animation_length: 1,
      bones: { tail: { rotation: { '0.0': [-20, 0, 0], '0.5': [10, 0, 0], '1.0': [-20, 0, 0] } }, leg_bl: { rotation: { '0.0': [40, 0, 0], '0.5': [-30, 0, 0], '1.0': [40, 0, 0] } }, leg_br: { rotation: { '0.0': [-30, 0, 0], '0.5': [40, 0, 0], '1.0': [-30, 0, 0] } } },
    },
  },
};
