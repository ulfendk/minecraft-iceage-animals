import { quadruped } from '../lib/anim.mjs';
import { caprid } from '../lib/bodies.mjs';
import { all, bone, face, LEGS } from '../lib/parts.mjs';
import { fur, gradient, mottle, region, underside } from '../lib/texture.mjs';

// A South American grazer the shape of a humpless camel, 1.6 m at the shoulder and 3 m long,
// with a long neck held forward and a short trunk on the end of its snout.
const base = caprid({
  bodyW: 9, bodyH: 8, bodyL: 22, legH: 11, legW: 3, neckW: 4, neckH: 14, headW: 4, headH: 4, headD: 6, muzzleD: 1,
  earL: 2, tail: 4,
});
const neckTop = 10 + 8 - 3 + 14; // caprid: bottom + bodyH - 3 + neckH
const snout = -11 - 2 - 6 - 1; // caprid: zf - 2 - headD - muzzleD
const model = {
  bones: [
    ...base.bones.map((b) => {
      if (b.name === 'neck') return { ...b, rotation: [25, 0, 0] };
      if (b.name === 'head') return { ...b, rotation: [-25, 0, 0] };
      return b;
    }),
    {
      name: 'trunk', parent: 'head', pivot: [0, neckTop - 2, snout + 1],
      cubes: [{ origin: [-1, neckTop - 5, snout - 1], size: [2, 3, 2], mat: 'trunk' }, { origin: [-1, neckTop - 7, snout - 1.5], size: [2, 2, 2], mat: 'trunk' }],
    },
  ],
  rear: base.rear,
};

export default {
  id: 'macrauchenia',
  name: 'Macrauchenia',
  role: 'prey',
  family: ['macrauchenia', 'grazer'],
  size: [1.0, 1.6],
  scale: 1.4,
  health: 26,
  speed: 0.27,
  xp: 4,
  fleeSpeed: 1.9,
  breed: ['wheat', 'iceage:dwarf_willow'],
  tempt: ['wheat', 'apple', 'iceage:dwarf_willow'],
  heal: [['wheat', 2], ['apple', 3]],
  grazes: true,
  sleeps: 'night',
  strollRange: 14,
  spawn: [
    { biomes: ['savanna'], weight: 3, group: [2, 5], blocks: ['grass_block'] },
    { biomes: ['plains'], weight: 1, group: [2, 4], blocks: ['grass_block'] },
  ],
  loot: [{ item: 'leather', min: 0, max: 2 }, { item: 'iceage:raw_game_meat', min: 2, max: 4, smelts: true }],
  sounds: { ambient: 'mob.llama.idle', hurt: 'mob.llama.hurt', death: 'mob.llama.death', pitch: [0.6, 0.7], interval: 18 },
  egg: ['#a4825a', '#5a4430'],
  client: { runSpeed: 5 },

  model,

  materials: {
    hide: {
      base: '#a4825a',
      layers: [
        underside('#d8c4a0', { y: 13, soft: 2, where: bone('body', 'neck') }),
        gradient('#7a5e3e', { axis: 1, from: 14, to: 19, where: bone('body') }),
        region('#6a5038', all(bone(...LEGS), ({ p }) => p[1] < 5)),
        mottle(0.08), fur(0.06),
      ],
    },
    face: { base: '#8a6c48', layers: [fur(0.05)] },
    muzzle: '#5a4430',
    trunk: { base: '#6a5038', layers: [region('#4a3828', face('front', 'bottom'))] },
    ear: '#8a6c48',
    tail: '#7a5e3e',
    hoof: '#2e2418',
  },

  anims: quadruped({ neck: 'neck', tail: ['tail'], ears: ['ear_l', 'ear_r'], swing: 30, sleepDrop: 8, legFold: 85, walkLength: 1.0, runLength: 0.45 }),
};
