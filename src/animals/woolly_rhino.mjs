import { extras, quadruped } from '../lib/anim.mjs';
import { hornLine, pillarBody } from '../lib/bodies.mjs';
import { all, bone, eyes, face, LEGS } from '../lib/parts.mjs';
import { fur, gradient, mottle, region } from '../lib/texture.mjs';

// 1.75 m at the shoulder and 3.6 m long: a big shoulder hump, a long head carried low for
// grazing, and two horns, the front one about a metre long, flattened from side to side and
// sweeping forward. Long hair hangs from the flanks.
const body = pillarBody({ bodyW: 14, bodyH: 10, bodyL: 28, legH: 9, legW: 5 });
const top = body.top; // 18
const hump = { origin: [-5, top, -13], size: [10, 2, 10], mat: 'hide' };

export default {
  id: 'woolly_rhino',
  name: 'Woolly Rhinoceros',
  role: 'megafauna',
  family: ['rhino', 'grazer'],
  size: [1.4, 1.35],
  scale: 1.45,
  health: 50,
  speed: 0.22,
  xp: 6,
  knockbackResistance: 0.85,
  attack: { damage: 10, speed: 1.8, cooldown: 1.5 },
  // Charges anyone who walks right up to it.
  hostile: { range: 4, filters: [{ test: 'is_baby', subject: 'self', value: false }] },
  breed: ['wheat', 'hay_block'],
  tempt: ['hay_block', 'iceage:steppe_grass'],
  heal: [['wheat', 2], ['hay_block', 15]],
  grazes: true,
  sleeps: 'night',
  ride: { seat: [0, (top + 3) / 16, 0.15], tameItems: ['hay_block', 'wheat'], temper: 110, jump: false },
  spawn: [
    { biomes: ['steppe'], weight: 3, group: [1, 3] },
    { biomes: ['tundra'], weight: 2, group: [1, 2] },
  ],
  loot: [
    { item: 'iceage:mammoth_wool', min: 1, max: 3 },
    { item: 'leather', min: 1, max: 3 },
    { item: 'iceage:raw_game_meat', min: 2, max: 5, smelts: true },
  ],
  sounds: { ambient: 'mob.hoglin.ambient', hurt: 'mob.hoglin.hurt', death: 'mob.hoglin.death', pitch: [0.5, 0.6], interval: 20 },
  egg: ['#6e5236', '#d6cbb4'],
  client: { runSpeed: 4 },

  model: {
    bones: [
      ...body.bones.map((b) => (b.name === 'body'
        ? { ...b, cubes: [...b.cubes, hump, { origin: [-7.5, 4, -13], size: [15, 7, 26], mat: 'skirt', hair: true }, { origin: [-5.5, top, -13.5], size: [11, 3, 11], mat: 'mane', hair: true }] }
        : b)),
      { name: 'tail', parent: 'body', pivot: [0, top - 2, 14], rotation: [10, 0, 0], cubes: [{ origin: [-1, top - 8, 14], size: [1, 6, 1], mat: 'hide' }] },
      {
        name: 'saddle', parent: 'body', pivot: [0, top, 2],
        cubes: [{ origin: [-6, top - 0.5, -3], size: [12, 1, 10], mat: 'blanket', inflate: 0.4 }, { origin: [-7.5, top - 6, -3], size: [1, 6, 10], mat: 'blanket' }, { origin: [6.5, top - 6, -3], size: [1, 6, 10], mat: 'blanket' }],
      },
      {
        // The head hangs low, nose nearly on the ground.
        name: 'head', parent: 'body', pivot: [0, top - 3, -14], rotation: [28, 0, 0],
        cubes: [
          { origin: [-4, 7, -27], size: [8, 8, 13], mat: 'hide', marks: eyes(13, { back: 6, down: 3, color: '#120e0a' }) },
          { origin: [-3, 6, -29], size: [6, 6, 2], mat: 'lip' },
        ],
      },
      // The long front horn, flat and sweeping forward and up; the short one behind it.
      { name: 'horn_front', parent: 'head', pivot: [0, 15, -26], cubes: hornLine([[15.5, -26], [17, -27], [18.5, -28.5], [20, -30], [21.5, -31.5], [23, -32.5], [24.5, -33]], { size: [3, 3, 3, 2, 2, 2, 1], width: [2, 2, 2, 1, 1, 1, 1] }) },
      { name: 'horn_back', parent: 'head', pivot: [0, 15, -20], cubes: hornLine([[15.5, -20], [17, -20.5], [18.5, -21]], { size: [3, 2, 1], width: [2, 2, 1] }) },
      { name: 'ear_l', parent: 'head', pivot: [3, 15, -15.5], cubes: [{ origin: [2.5, 15, -16], size: [2, 3, 1], mat: 'hide' }] },
      { name: 'ear_r', parent: 'head', pivot: [-3, 15, -15.5], cubes: [{ origin: [-4.5, 15, -16], size: [2, 3, 1], mat: 'hide' }] },
    ],
  },

  materials: {
    hide: { base: '#6e5236', layers: [gradient('#8c6c48', { axis: 1, from: 12, to: 20, where: bone('body') }), region('#4e3a26', all(bone(...LEGS), ({ p }) => p[1] < 4)), mottle(0.12, { scale: 3 }), fur(0.12)] },
    skirt: { base: '#5a4029', layers: [region('#6e5236', ({ i, j }) => (i * 5 + Math.floor(j / 3)) % 4 === 0), region('#46321f', ({ i }) => i % 3 === 0), fur(0.14)] },
    mane: { base: '#7a5a3a', layers: [fur(0.18)] },
    lip: { base: '#4e3c2c', layers: [fur(0.05)] },
    horn: { base: '#3a332b', layers: [region('#6a5e4c', face('left', 'right')), mottle(0.1)] },
    toe: { base: '#4e3a26', layers: [region('#bfb39c', ({ face: f, i }) => f === 'front' && i % 2 === 0)] },
    blanket: { base: '#2f5d7a', layers: [region('#d9c27a', ({ p }) => Math.floor(p[2]) % 4 === 0), fur(0.04)] },
  },

  anims: {
    ...quadruped({ tail: ['tail'], ears: ['ear_l', 'ear_r'], swing: 22, sleepDrop: 7, legFold: 75, walkLength: 1.2, runLength: 0.55 }),
    charge: extras.pronk(),
  },
};
