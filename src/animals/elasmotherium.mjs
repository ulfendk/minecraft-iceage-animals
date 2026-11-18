import { quadruped } from '../lib/anim.mjs';
import { hornLine, pillarBody } from '../lib/bodies.mjs';
import { all, bone, eyes, LEGS } from '../lib/parts.mjs';
import { fur, gradient, mottle, region } from '../lib/texture.mjs';

// A giant rhino of the steppe, 2.1 m at the shoulder and 4.5 m long, on long legs built for
// galloping, with one enormous horn growing from a dome on its forehead.
const body = pillarBody({ bodyW: 14, bodyH: 9, bodyL: 32, legH: 12, legW: 5 });
const top = body.top; // 20

export default {
  id: 'elasmotherium',
  name: 'Elasmotherium',
  role: 'megafauna',
  family: ['rhino', 'grazer'],
  size: [1.4, 1.4],
  scale: 1.6,
  health: 60,
  speed: 0.25,
  xp: 7,
  knockbackResistance: 0.9,
  attack: { damage: 11, speed: 1.6, cooldown: 2 },
  breed: ['wheat'],
  tempt: ['wheat', 'hay_block', 'iceage:steppe_grass'],
  heal: [['wheat', 3], ['hay_block', 20]],
  grazes: true,
  sleeps: 'night',
  strollRange: 16,
  ride: { seat: [0, (top + 3) / 16, 0.2], tameItems: ['wheat', 'hay_block'], temper: 120, jumpStrength: 0.6 },
  spawn: [
    { biomes: ['steppe'], weight: 2, group: [1, 2] },
    { biomes: ['plains'], weight: 1, group: [1, 2] },
  ],
  loot: [
    { item: 'leather', min: 2, max: 4 },
    { item: 'iceage:raw_game_meat', min: 3, max: 6, smelts: true },
  ],
  sounds: { ambient: 'mob.hoglin.ambient', hurt: 'mob.hoglin.hurt', death: 'mob.hoglin.death', pitch: [0.4, 0.5], interval: 22 },
  egg: ['#7a6448', '#2e2822'],
  client: { runSpeed: 4 },

  model: {
    bones: [
      ...body.bones.map((b) => (b.name === 'body'
        ? { ...b, cubes: [...b.cubes, { origin: [-5, top, -15], size: [10, 1, 12], mat: 'hide' }, { origin: [-7.5, 8, -15], size: [15, 4, 30], mat: 'skirt', hair: true }] }
        : b)),
      { name: 'tail', parent: 'body', pivot: [0, top - 2, 16], rotation: [10, 0, 0], cubes: [{ origin: [-1, top - 9, 16], size: [1, 7, 1], mat: 'hide' }] },
      {
        name: 'saddle', parent: 'body', pivot: [0, top, 2],
        cubes: [{ origin: [-6, top - 0.5, -3], size: [12, 1, 10], mat: 'blanket', inflate: 0.4 }, { origin: [-7.5, top - 6, -3], size: [1, 6, 10], mat: 'blanket' }, { origin: [6.5, top - 6, -3], size: [1, 6, 10], mat: 'blanket' }],
      },
      {
        name: 'head', parent: 'body', pivot: [0, top - 3, -16], rotation: [18, 0, 0],
        cubes: [
          { origin: [-4, 10, -28], size: [8, 8, 13], mat: 'hide', marks: eyes(13, { back: 5, down: 3, color: '#120e0a' }) },
          // The domed boss on the forehead the horn grows from.
          { origin: [-3.5, 18, -24], size: [7, 2, 6], mat: 'hide' },
          { origin: [-3, 9, -30], size: [6, 6, 2], mat: 'lip' },
        ],
      },
      { name: 'horn', parent: 'head', pivot: [0, 20, -21], cubes: hornLine([[21, -21], [23, -22], [25, -23], [27, -24], [29, -25.5], [31, -27], [32.5, -28.5]], { size: [4, 4, 3, 3, 2, 2, 1], width: [4, 4, 3, 3, 2, 2, 1] }) },
      { name: 'ear_l', parent: 'head', pivot: [3, 18, -16.5], cubes: [{ origin: [2.5, 18, -17], size: [2, 3, 1], mat: 'hide' }] },
      { name: 'ear_r', parent: 'head', pivot: [-3, 18, -16.5], cubes: [{ origin: [-4.5, 18, -17], size: [2, 3, 1], mat: 'hide' }] },
    ],
  },

  materials: {
    hide: { base: '#7a6448', layers: [gradient('#9a8462', { axis: 1, from: 14, to: 21, where: bone('body') }), region('#5a4834', all(bone(...LEGS), ({ p }) => p[1] < 5)), mottle(0.1, { scale: 3 }), fur(0.1)] },
    skirt: { base: '#6a5640', layers: [region('#5a4834', ({ i }) => i % 3 === 0), fur(0.12)] },
    lip: { base: '#5a4a3a', layers: [fur(0.05)] },
    horn: { base: '#2e2822', layers: [region('#5a5044', ({ p }) => p[1] > 28), mottle(0.1)] },
    toe: { base: '#5a4834', layers: [region('#bfb39c', ({ face: f, i }) => f === 'front' && i % 2 === 0)] },
    blanket: { base: '#7a2f2a', layers: [region('#d9c27a', ({ p }) => Math.floor(p[2]) % 4 === 0), fur(0.04)] },
  },

  anims: quadruped({ tail: ['tail'], ears: ['ear_l', 'ear_r'], swing: 26, sleepDrop: 9, legFold: 80, walkLength: 1.2, runLength: 0.5 }),
};
