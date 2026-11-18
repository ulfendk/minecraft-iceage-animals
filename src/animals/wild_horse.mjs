import { quadruped } from '../lib/anim.mjs';
import { all, bone, face, LEGS } from '../lib/parts.mjs';
import { fur, mottle, region, underside } from '../lib/texture.mjs';

// A stocky, dun Ice Age horse, 1.4 m at the shoulder: a dark stripe down the back, faint
// stripes on the legs, a short upright mane and a pale muzzle - the horses of the cave paintings.
export default {
  id: 'wild_horse',
  name: 'Wild Horse',
  role: 'prey',
  family: ['equine', 'grazer'],
  size: [1.0, 1.4],
  scale: 1.0,
  health: 24,
  speed: 0.27,
  xp: 3,
  fleeSpeed: 1.7,
  alertsPack: true,
  breed: ['golden_carrot', 'wheat'],
  tempt: ['apple', 'wheat', 'golden_carrot', 'hay_block', 'carrot'],
  heal: [['wheat', 2], ['apple', 3], ['hay_block', 20]],
  grazes: true,
  sleeps: 'night',
  strollRange: 16,
  ride: { seat: [0, 1.5, -0.05], tameItems: ['apple', 'wheat', 'carrot', 'golden_carrot'], temper: 70, jumpStrength: 0.7 },
  spawn: [
    { biomes: ['steppe'], weight: 4, group: [3, 6] },
    { biomes: ['plains'], weight: 2, group: [3, 5], blocks: ['grass_block'] },
    { biomes: ['tundra'], weight: 1, group: [2, 4] },
  ],
  loot: [{ item: 'leather', min: 0, max: 2 }, { item: 'iceage:raw_game_meat', min: 1, max: 3, smelts: true }],
  sounds: { ambient: 'mob.horse.idle', hurt: 'mob.horse.hit', death: 'mob.horse.death', pitch: [0.85, 1.0], interval: 16 },
  egg: ['#b8915a', '#2a2018'],
  client: { runSpeed: 5 },

  model: {
    bones: [
      { name: 'root', pivot: [0, 0, 0] },
      { name: 'body', parent: 'root', pivot: [0, 17, 0], cubes: [{ origin: [-5, 12, -10], size: [10, 10, 21], mat: 'hide' }] },
      {
        name: 'saddle', parent: 'body', pivot: [0, 22, 0],
        cubes: [
          { origin: [-5, 22, -4], size: [10, 1, 8], mat: 'saddle', inflate: 0.2 },
          { origin: [-1, 22, -5], size: [2, 2, 1], mat: 'saddle' },
        ],
      },
      {
        name: 'tail', parent: 'body', pivot: [0, 21, 11], rotation: [20, 0, 0],
        cubes: [{ origin: [-1, 13, 11], size: [2, 8, 2], mat: 'tail' }, { origin: [-1.5, 8, 11], size: [3, 5, 2], mat: 'tail' }],
      },
      {
        name: 'neck', parent: 'body', pivot: [0, 20, -8], rotation: [30, 0, 0],
        cubes: [
          { origin: [-2.5, 18, -12], size: [5, 12, 7], mat: 'hide' },
          // A short, upright, dark mane.
          { origin: [-1, 21, -5.5], size: [2, 11, 2], mat: 'mane' },
        ],
      },
      {
        name: 'head', parent: 'neck', pivot: [0, 30, -9],
        cubes: [
          { origin: [-3, 27, -14], size: [6, 6, 7], mat: 'hide', marks: [{ face: 'right', x: 4, y: 1, color: '#101010' }, { face: 'left', x: 2, y: 1, color: '#101010' }] },
          { origin: [-2.5, 26, -19], size: [5, 5, 5], mat: 'muzzle', marks: [{ face: 'front', x: 0, y: 1, color: '#0d0d0d' }, { face: 'front', x: 4, y: 1, color: '#0d0d0d' }] },
        ],
      },
      { name: 'ear_r', parent: 'head', pivot: [-2, 33, -8.5], cubes: [{ origin: [-3, 33, -9], size: [2, 3, 1], mat: 'hide' }] },
      { name: 'ear_l', parent: 'head', pivot: [2, 33, -8.5], cubes: [{ origin: [1, 33, -9], size: [2, 3, 1], mat: 'hide' }] },
      ...[
        ['leg_fl', 1.5, -9],
        ['leg_fr', -4.5, -9],
        ['leg_bl', 1.5, 6],
        ['leg_br', -4.5, 6],
      ].map(([name, x, z]) => ({
        name, parent: 'root', pivot: [x + 1.5, 13, z + 1.5],
        cubes: [
          { origin: [x, 2, z], size: [3, 11, 3], mat: 'leg' },
          { origin: [x, 0, z], size: [3, 2, 3], mat: 'hoof' },
        ],
      })),
    ],
  },

  materials: {
    hide: {
      base: '#b8915a',
      layers: [
        // The dark dorsal stripe and a darker face and shoulders.
        region('#3a2a1c', all(bone('body'), face('top'), ({ p }) => Math.abs(p[0]) < 1)),
        underside('#d8c098', { y: 14, soft: 2, where: bone('body') }),
        mottle(0.06), fur(0.06),
      ],
    },
    leg: { base: '#8a6a40', layers: [region('#2a2018', ({ p }) => p[1] < 7), region('#5a4430', ({ p }) => p[1] >= 7 && Math.floor(p[1]) % 3 === 0), fur(0.05)] },
    muzzle: { base: '#d8c8a4', layers: [region('#2a2018', face('front', 'bottom')), fur(0.04)] },
    mane: { base: '#2a2018', layers: [fur(0.12)] },
    tail: { base: '#2a2018', layers: [fur(0.12)] },
    hoof: '#1a1612',
    saddle: { base: '#6a4426', layers: [fur(0.04)] },
  },

  anims: quadruped({ neck: 'neck', tail: ['tail'], ears: ['ear_l', 'ear_r'], swing: 32, sleepDrop: 8, legFold: 85, walkLength: 0.9, runLength: 0.4 }),
};
