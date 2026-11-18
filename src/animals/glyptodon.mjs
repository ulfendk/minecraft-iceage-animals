import { shelled } from '../lib/anim.mjs';
import { glyptodont } from '../lib/bodies.mjs';
import { mottle, patches, region } from '../lib/texture.mjs';

// An armadillo as big as a small car: a domed shell 1.4 m high and 2 m long made of more
// than a thousand bony plates, an armoured cap on the head and a ringed tail.
const body = glyptodont({ shellW: 18, shellL: 24, shellH: 11, legH: 6, headW: 6, headD: 5, tailL: 10 });

export const GLYPTODONT_COLOURS = {
  shell: { base: '#7a6248', layers: [patches('#a48a66', { size: 1.6, line: 0.18, vary: 0.25, where: (c) => c.face !== 'bottom' }), mottle(0.08)] },
  rim: { base: '#5e4a36', layers: [region('#8a7052', ({ i }) => i % 2 === 0)] },
  skin: { base: '#5e5044', layers: [mottle(0.1, { scale: 1.5 })] },
  cap: { base: '#8a7052', layers: [patches('#a48a66', { size: 1.2, line: 0.2 })] },
  leg: { base: '#5e5044', layers: [region('#7a6a58', ({ i, j }) => (i + j) % 2 === 0)] },
  claw: '#2e2620',
  tail: { base: '#7a6248', layers: [region('#a48a66', ({ p }) => Math.floor(p[2]) % 2 === 0)] },
};

export default {
  id: 'glyptodon',
  name: 'Glyptodon',
  role: 'megafauna',
  family: ['glyptodont', 'shelled', 'grazer'],
  size: [1.3, 1.1],
  scale: 1.4,
  health: 60,
  speed: 0.12,
  xp: 5,
  knockbackResistance: 0.95,
  hidesInShell: true,
  sleeps: 'night',
  strollRange: 8,
  breed: ['wheat', 'short_grass'],
  tempt: ['wheat', 'short_grass', 'iceage:steppe_grass'],
  heal: [['wheat', 2], ['short_grass', 1]],
  grazes: true,
  spawn: [
    { biomes: ['savanna'], weight: 2, group: [1, 2], blocks: ['grass_block', 'coarse_dirt'] },
    { biomes: ['plains'], weight: 1, group: [1, 2], blocks: ['grass_block'] },
  ],
  loot: [{ item: 'turtle_scute', min: 1, max: 3 }, { item: 'iceage:raw_game_meat', min: 2, max: 4, smelts: true }],
  sounds: { ambient: 'mob.armadillo.ambient', hurt: 'mob.armadillo.hurt', death: 'mob.armadillo.death', pitch: [0.4, 0.5], interval: 26 },
  egg: ['#7a6248', '#a48a66'],
  // The shell is the target: the head and the soft underside are the vital spots.
  hunt: { minEnergy: 2700 },

  model: { bones: body.bones },

  materials: GLYPTODONT_COLOURS,

  anims: shelled({ tail: 'tail', headTuck: 3, legTuckX: -1, walkLength: 2.2 }),
};
