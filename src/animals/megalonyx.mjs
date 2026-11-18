import { extras, quadruped } from '../lib/anim.mjs';
import { sloth } from '../lib/bodies.mjs';
import { SLOTH_COLOURS } from './megatherium.mjs';

// A ground sloth the size of an ox: 1.2 m at the shoulder and 2.5 m from nose to rump, with
// a rounder head and long hooked claws. It ambles about in no hurry at all.
const model = sloth({ bodyW: 12, bodyH: 10, bodyL: 22, legH: 7, legW: 5, headW: 7, headH: 7, headD: 6, muzzleW: 4, muzzleH: 4, muzzleD: 2, tailL: 8, tailW: 4 });

export default {
  id: 'megalonyx',
  name: 'Megalonyx',
  role: 'megafauna',
  family: ['sloth'],
  size: [1.2, 1.0],
  scale: 1.2,
  health: 40,
  speed: 0.14,
  xp: 5,
  knockbackResistance: 0.7,
  attack: { damage: 7, speed: 1.1, cooldown: 2 },
  breed: ['apple', 'sweet_berries'],
  tempt: ['apple', 'sweet_berries', 'oak_leaves', 'iceage:dwarf_willow'],
  heal: [['apple', 4], ['sweet_berries', 2]],
  sleeps: 'night',
  strollRange: 8,
  spawn: [
    { biomes: ['forest'], weight: 2, group: [1, 2] },
    { biomes: ['taiga'], weight: 1, group: [1, 2] },
  ],
  loot: [{ item: 'leather', min: 1, max: 3 }, { item: 'iceage:raw_game_meat', min: 2, max: 4, smelts: true }],
  sounds: { ambient: 'mob.sniffer.idle', hurt: 'mob.sniffer.hurt', death: 'mob.sniffer.death', pitch: [0.6, 0.7], interval: 22 },
  egg: ['#8a7050', '#3a3028'],

  model: { bones: model.bones },

  materials: SLOTH_COLOURS('#8a7050', '#a88e6a'),

  anims: {
    ...quadruped({ tail: ['tail'], ears: ['ear_l', 'ear_r'], swing: 18, sleepDrop: 5, legFold: 70, walkLength: 1.8, runLength: 0.9 }),
    browse: extras.rear({ ...model.rear, angle: 65, length: 3.5 }),
  },
};
