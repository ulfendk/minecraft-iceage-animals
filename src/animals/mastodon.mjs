import { extras, quadruped } from '../lib/anim.mjs';
import { hornArc, proboscidean } from '../lib/bodies.mjs';
import { all, bone, LEGS } from '../lib/parts.mjs';
import { fur, mottle, region } from '../lib/texture.mjs';

// Lower and longer than a mammoth (2.7 m at the shoulder, 4.6 m long), with a flatter head,
// a shorter, darker coat and long tusks that point forward and curve gently upwards.
const body = proboscidean({
  legH: 11, legW: 5, bodyW: 16, frontH: 11, rearH: 10, bodyL: 32, hump: 2,
  headW: 10, headH: 10, headD: 9, dome: 1, skirt: 3, ear: [1, 4, 3], tail: 6,
  tusks: ({ bottom, front }) => hornArc(
    [[3, bottom + 2, front + 2], [3.5, bottom + 1, front], [4, bottom, front - 3], [4.5, bottom, front - 6], [5, bottom + 1, front - 9], [5, bottom + 2.5, front - 11.5], [4.5, bottom + 4, front - 13]],
    { size: [3, 3, 3, 2, 2, 2, 1], mat: 'tusk' },
  ),
});

export default {
  id: 'mastodon',
  name: 'American Mastodon',
  role: 'megafauna',
  family: ['mastodon', 'proboscidean'],
  size: [1.6, 1.6],
  scale: 1.8,
  health: 70,
  speed: 0.2,
  xp: 8,
  knockbackResistance: 0.95,
  attack: { damage: 11, speed: 1.2, cooldown: 2 },
  alertsPack: true,
  breed: ['hay_block'],
  tempt: ['hay_block', 'apple', 'spruce_leaves'],
  heal: [['hay_block', 20], ['apple', 4]],
  sleeps: 'night',
  strollRange: 14,
  spawn: [
    { biomes: ['taiga'], weight: 2, group: [1, 3] },
    { biomes: ['forest'], weight: 1, group: [1, 2] },
  ],
  loot: [
    { item: 'leather', min: 1, max: 4 },
    { item: 'iceage:raw_game_meat', min: 4, max: 8, smelts: true },
    { item: 'iceage:ivory', min: 0, max: 1, chance: 0.35 },
  ],
  sounds: { ambient: 'mob.ravager.ambient', hurt: 'mob.ravager.hurt', death: 'mob.ravager.death', pitch: [0.9, 1.05], interval: 24 },
  egg: ['#4a3324', '#e8dcc0'],
  client: { runSpeed: 4, idle: ['idle', 'trunk_idle'] },
  hunt: { trophy: 'trophy_tusks' },

  model: { bones: body.bones.filter((b) => b.name !== 'saddle' && b.name !== 'chest') },

  materials: {
    hide: { base: '#4e3626', layers: [region('#3e2a1e', all(bone(...LEGS), ({ p }) => p[1] < 5)), mottle(0.1, { scale: 3 }), fur(0.1)] },
    skirt: { base: '#3e2a1c', layers: [region('#4e3626', ({ i, j }) => (i * 7 + Math.floor(j / 2)) % 5 === 0), fur(0.12)] },
    face: { base: '#463022', layers: [mottle(0.08, { scale: 2 }), fur(0.08)] },
    trunk: { base: '#463022', layers: [region('#3a281c', ({ p }) => Math.round(p[1]) % 2 === 0), fur(0.08)] },
    ear: { base: '#3a281c', layers: [fur(0.1)] },
    tail: { base: '#463022', layers: [fur(0.1)] },
    tuft: { base: '#22170f', layers: [fur(0.15)] },
    tusk: { base: '#ece0c2', layers: [region('#cdb88e', ({ p }) => p[1] < 7), mottle(0.06)] },
    toe: { base: '#3a281c', layers: [region('#cbbfa4', ({ face: f, i }) => f === 'front' && i % 2 === 1)] },
  },

  anims: {
    ...quadruped({ tail: ['tail'], ears: ['ear_l', 'ear_r'], swing: 18, sleepDrop: 9, legFold: 75, walkLength: 1.6, runLength: 0.8 }),
    ...extras.trunk(['trunk', 'trunk2', 'trunk3']),
  },
};
