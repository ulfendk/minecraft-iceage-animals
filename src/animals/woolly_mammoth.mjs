import { extras, quadruped } from '../lib/anim.mjs';
import { hornArc, proboscidean } from '../lib/bodies.mjs';
import { all, bone, face, LEGS } from '../lib/parts.mjs';
import { fur, gradient, mottle, region } from '../lib/texture.mjs';

// About as big as an African elephant (3.2 m at the shoulder): a high domed head, a fatty
// hump over the shoulders, a back that slopes down to the hips, small furry ears and a
// short tail. Its long, spiralling tusks sweep down, out and up again, and a coat of long
// hair hangs from its flanks nearly to its knees.
const body = proboscidean({
  legH: 13, legW: 5, bodyW: 16, frontH: 12, rearH: 9, bodyL: 26, hump: 2,
  headW: 10, headH: 12, headD: 10, dome: 2, skirt: 6, topknot: true, ear: [1, 4, 3], tail: 5,
  tusks: ({ bottom, front }) => hornArc(
    [
      [3, bottom + 2, front + 2], [3.5, bottom, front], [4.5, bottom - 2, front - 2], [6, bottom - 3, front - 4.5],
      [7.5, bottom - 2.5, front - 7], [8.5, bottom - 0.5, front - 9], [8.5, bottom + 2, front - 10], [7.5, bottom + 4, front - 10.5], [6, bottom + 5, front - 10],
    ],
    { size: [3, 3, 3, 3, 2, 2, 2, 2, 1], mat: 'tusk' },
  ),
});

export const MAMMOTH_HAIR = {
  // Reddish brown, a little lighter on the back where the sun bleached it, and long dark
  // guard hairs hanging in locks.
  hide: { base: '#6b4126', layers: [gradient('#8a5a34', { axis: 1, from: 16, to: 26, where: bone('body') }), region('#563420', all(bone(...LEGS), ({ p }) => p[1] < 6)), mottle(0.12, { scale: 3 }), fur(0.12)] },
  skirt: { base: '#4e2e1a', layers: [region('#62402a', ({ i, j }) => (i * 7 + Math.floor(j / 3)) % 5 === 0), region('#3e2414', ({ i }) => i % 3 === 0), fur(0.14)] },
  mane: { base: '#5a3820', layers: [fur(0.18)] },
  face: { base: '#5e3a22', layers: [mottle(0.1, { scale: 2 }), fur(0.1)] },
  trunk: { base: '#5a3822', layers: [region('#4a2e1c', ({ p }) => Math.round(p[1]) % 2 === 0), fur(0.1)] },
  ear: { base: '#4e2e1a', layers: [fur(0.12)] },
  tail: { base: '#5a3820', layers: [fur(0.1)] },
  tuft: { base: '#2e1c10', layers: [fur(0.16)] },
  tusk: { base: '#efe3c4', layers: [region('#d6c49a', ({ p }) => p[1] < 8), region('#b8a37a', face('bottom')), mottle(0.06)] },
  toe: { base: '#4a2e1c', layers: [region('#cfc2a6', ({ face: f, i }) => f === 'front' && i % 2 === 1)] },
  blanket: { base: '#2f5d7a', layers: [region('#d9c27a', ({ p }) => Math.floor(p[1]) % 5 === 0 || Math.floor(p[2]) % 5 === 0), fur(0.04)] },
  chest: { base: '#8f6a35', layers: [region('#4e3a1c', ({ i, j, fw, fh }) => i === 0 || j === 0 || i === fw - 1 || j === fh - 1)] },
};

export default {
  id: 'woolly_mammoth',
  name: 'Woolly Mammoth',
  role: 'megafauna',
  family: ['mammoth', 'proboscidean', 'odd_herd_leader'],
  size: [1.6, 1.7],
  scale: 2.0,
  health: 80,
  speed: 0.2,
  xp: 8,
  knockbackResistance: 0.95,
  attack: { damage: 12, speed: 1.2, cooldown: 2 },
  alertsPack: true,
  breed: ['hay_block', 'wheat'],
  tempt: ['hay_block', 'wheat', 'apple', 'iceage:dwarf_willow'],
  heal: [['hay_block', 20], ['wheat', 2], ['apple', 4]],
  grazes: true,
  sleeps: 'night',
  strollRange: 18,
  ride: {
    seats: [[0, body.seatY + 0.1, -0.3], [0, body.seatY - 0.05, 0.45]],
    tameItems: ['hay_block', 'apple', 'wheat'],
    temper: 120,
    chest: true,
    jump: false,
  },
  spawn: [
    { biomes: ['steppe'], weight: 4, group: [2, 4] },
    { biomes: ['tundra'], weight: 2, group: [2, 4] },
    { biomes: ['taiga'], weight: 1, group: [1, 3] },
  ],
  loot: [
    { item: 'iceage:mammoth_wool', min: 2, max: 5 },
    { item: 'iceage:raw_game_meat', min: 4, max: 8, smelts: true },
    { item: 'iceage:ivory', min: 0, max: 1, chance: 0.35 },
  ],
  sounds: { ambient: 'mob.ravager.ambient', hurt: 'mob.ravager.hurt', death: 'mob.ravager.death', pitch: [0.85, 1.0], interval: 22 },
  egg: ['#6b4126', '#efe3c4'],
  client: { runSpeed: 4, idle: ['idle', 'trunk_idle'] },
  hunt: { trophy: 'trophy_tusks' },

  model: { bones: body.bones },

  materials: MAMMOTH_HAIR,

  anims: {
    ...quadruped({ tail: ['tail'], ears: ['ear_l', 'ear_r'], swing: 18, sleepDrop: 10, legFold: 75, walkLength: 1.6, runLength: 0.8 }),
    ...extras.trunk(['trunk', 'trunk2', 'trunk3']),
  },
};
