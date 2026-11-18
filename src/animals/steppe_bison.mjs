import { quadruped } from '../lib/anim.mjs';
import { caprid, hornArc } from '../lib/bodies.mjs';
import { all, bone, LEGS } from '../lib/parts.mjs';
import { fur, mottle, region } from '../lib/texture.mjs';

// Bigger than today's bison: 2 m at the hump, 3.4 m long, with long horns that spread
// sideways and curve up, a woolly cape over the forequarters and slim hindquarters.
const base = caprid({
  bodyW: 10, bodyH: 12, bodyL: 24, legH: 9, legW: 4, neckW: 8, neckH: 2, headW: 7, headH: 7, headD: 6, muzzleD: 2,
  hump: 5, beard: 4, tail: 7, earL: 1,
  horns: ({ top, back, side }) => [
    { origin: [-side + 0.5, top - 2, back - 5], size: [2 * side - 1, 3, 5], mat: 'mane', hair: true },
    // Long horns: straight out to the sides, then up and a little forward.
    ...hornArc([[side + 0.5, top - 2.5, back - 3.5], [side + 2.5, top - 2.5, back - 3.5], [side + 4.5, top - 2, back - 3.5], [side + 6, top - 1, back - 4], [side + 6.5, top + 0.5, back - 4.5], [side + 6.5, top + 2, back - 5]], { size: [2, 2, 2, 2, 1, 1] }),
  ],
});
const model = {
  ...base,
  bones: base.bones.map((b) => (b.name === 'body'
    ? {
      ...b,
      cubes: [
        ...b.cubes.filter((c) => c.origin[1] < 20),
        { origin: [-5, 20, -13], size: [10, 6, 9], mat: 'mane', hair: true },
        { origin: [-7, 11, -13], size: [14, 12, 11], mat: 'mane', hair: true },
        { origin: [-6, 5, -12.5], size: [12, 6, 9], mat: 'mane', hair: true },
      ],
    }
    : b)),
};

export default {
  id: 'steppe_bison',
  name: 'Steppe Bison',
  role: 'megafauna',
  family: ['bovine', 'grazer'],
  size: [1.4, 1.6],
  scale: 1.6,
  health: 45,
  speed: 0.22,
  xp: 6,
  knockbackResistance: 0.8,
  attack: { damage: 8, speed: 1.6, cooldown: 1.5 },
  hostile: { range: 5, filters: [{ test: 'is_baby', subject: 'self', value: false }] },
  alertsPack: true,
  breed: ['wheat'],
  tempt: ['wheat', 'hay_block', 'iceage:steppe_grass'],
  heal: [['wheat', 2], ['hay_block', 20]],
  grazes: true,
  sleeps: 'night',
  strollRange: 14,
  spawn: [
    { biomes: ['steppe'], weight: 5, group: [4, 8] },
    { biomes: ['plains'], weight: 2, group: [3, 6], blocks: ['grass_block'] },
    { biomes: ['tundra'], weight: 1, group: [2, 4] },
  ],
  loot: [
    { item: 'leather', min: 1, max: 3 },
    { item: 'iceage:raw_game_meat', min: 2, max: 5, smelts: true },
  ],
  sounds: { ambient: 'mob.cow.say', hurt: 'mob.cow.hurt', death: 'mob.cow.hurt', pitch: [0.4, 0.5], interval: 16 },
  egg: ['#6b4a2c', '#2a1c12'],
  client: { runSpeed: 4 },

  model,

  materials: {
    hide: { base: '#7a5634', layers: [region('#5a3e26', all(bone(...LEGS), ({ p }) => p[1] < 5)), mottle(0.08, { scale: 3 }), fur(0.08)] },
    mane: { base: '#4a3220', layers: [region('#5c412b', ({ i, j }) => (i * 5 + Math.floor(j / 2)) % 5 === 0), mottle(0.1, { scale: 3 }), fur(0.16)] },
    face: { base: '#3a2818', layers: [fur(0.1)] },
    muzzle: { base: '#241a12', layers: [fur(0.05)] },
    beard: { base: '#3a2818', layers: [fur(0.14)] },
    ear: '#3a2818',
    tail: { base: '#4a3220', layers: [region('#2a1c12', ({ p }) => p[1] < 15), fur(0.1)] },
    horn: { base: '#2a2420', layers: [region('#bfb29a', ({ p }) => p[1] > 31)] },
    hoof: '#16120f',
  },

  anims: quadruped({ neck: 'neck', tail: ['tail'], ears: ['ear_l', 'ear_r'], swing: 22, sleepDrop: 6, legFold: 75, walkLength: 1.3, runLength: 0.6 }),
};
