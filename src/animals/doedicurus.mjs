import { shelled } from '../lib/anim.mjs';
import { glyptodont } from '../lib/bodies.mjs';
import { mottle, patches, region } from '../lib/texture.mjs';
import { GLYPTODONT_COLOURS } from './glyptodon.mjs';

// A bigger, darker glyptodont, 1.5 m high, whose tail ends in a heavy club studded with
// spikes. Hurt it and it swings the club (scripts/behaviours.js).
const body = glyptodont({ shellW: 20, shellL: 26, shellH: 11, legH: 6, headW: 6, headD: 6, tailL: 15, club: true });

export default {
  id: 'doedicurus',
  name: 'Doedicurus',
  role: 'megafauna',
  family: ['glyptodont', 'shelled', 'grazer'],
  size: [1.4, 1.1],
  scale: 1.5,
  health: 70,
  speed: 0.12,
  xp: 6,
  knockbackResistance: 0.95,
  sleeps: 'night',
  strollRange: 8,
  breed: ['wheat', 'short_grass'],
  tempt: ['wheat', 'short_grass', 'iceage:steppe_grass'],
  heal: [['wheat', 2], ['short_grass', 1]],
  grazes: true,
  spawn: [{ biomes: ['savanna'], weight: 1, group: [1, 2], blocks: ['grass_block', 'coarse_dirt'] }],
  loot: [{ item: 'turtle_scute', min: 1, max: 4 }, { item: 'iceage:raw_game_meat', min: 2, max: 5, smelts: true }],
  sounds: { ambient: 'mob.armadillo.ambient', hurt: 'mob.armadillo.hurt', death: 'mob.armadillo.death', pitch: [0.3, 0.4], interval: 26 },
  egg: ['#5e4a36', '#d8c8a8'],
  hunt: { minEnergy: 2700 },

  model: { bones: body.bones },

  materials: {
    ...GLYPTODONT_COLOURS,
    shell: { base: '#5e4a36', layers: [patches('#7a6248', { size: 1.4, line: 0.2, vary: 0.25, where: (c) => c.face !== 'bottom' }), mottle(0.08)] },
    club: { base: '#5e4a36', layers: [patches('#7a6248', { size: 1.2, line: 0.2 })] },
    spike: { base: '#d8c8a8', layers: [region('#a89878', ({ p }) => p[2] < 22)] },
  },

  anims: {
    ...shelled({ tail: 'tail', headTuck: 3, legTuckX: -1, walkLength: 2.2 }),
    tail_swing: {
      animation_length: 0.8,
      bones: {
        tail: { rotation: { '0.0': [0, 0, 0], '0.25': [0, -50, 0], '0.45': [0, 55, 0], '0.8': [0, 0, 0] } },
        tail2: { rotation: { '0.0': [0, 0, 0], '0.25': [0, -20, 0], '0.45': [0, 30, 0], '0.8': [0, 0, 0] } },
      },
    },
  },
};
