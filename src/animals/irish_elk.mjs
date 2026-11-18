import { extras, quadruped } from '../lib/anim.mjs';
import { caprid, splitBone } from '../lib/bodies.mjs';
import { all, bone, face, LEGS } from '../lib/parts.mjs';
import { fur, gradient, mottle, region, underside } from '../lib/texture.mjs';

// The biggest deer ever: 2 m at the shoulder, with palmate antlers that spread 3.5 m from
// tip to tip. A dark mane on the neck and a pale rump.
const PALM = 'antler';
function antlers({ top, back, side }) {
  const cubes = [];
  for (const s of [1, -1]) {
    const x = (v, w) => (s > 0 ? v : -v - w); // mirror a cube's x origin
    // The beam: out sideways from the top of the head (kept above the brain, so a side-on
    // brain shot isn't stopped by an antler).
    cubes.push({ origin: [x(side - 1, 3), top, back - 3], size: [3, 2, 2], mat: PALM });
    cubes.push({ origin: [x(side + 2, 4), top + 0.5, back - 3.5], size: [4, 2, 2], mat: PALM });
    // The brow tine, forward over the face.
    cubes.push({ origin: [x(side + 1, 1), top + 0.5, back - 6], size: [1, 1, 3], mat: PALM });
    // The great flat palm, tilted up, with tines along its front edge.
    cubes.push({ origin: [x(side + 5, 14), top + 1, back - 6], size: [14, 1, 7], mat: PALM, rotation: [0, 0, -s * 18], pivot: [s * (side + 5), top + 1, back - 2] });
    for (let t = 0; t < 5; t++) {
      cubes.push({ origin: [x(side + 7 + t * 2.5, 1), top + 2 + t * 0.8, back - 7], size: [1, 3, 1], mat: PALM, rotation: [0, 0, -s * 18], pivot: [s * (side + 5), top + 1, back - 2] });
    }
  }
  return cubes;
}

const model = splitBone(caprid({
  bodyW: 9, bodyH: 10, bodyL: 22, legH: 12, legW: 3, neckW: 5, neckH: 9, headW: 5, headH: 4, headD: 7, muzzleD: 2,
  earL: 3, tail: 2, horns: antlers,
}), 'head', PALM, 'antlers');

export default {
  id: 'irish_elk',
  name: 'Irish Elk',
  role: 'prey',
  family: ['deer', 'grazer'],
  size: [1.2, 1.5],
  scale: 1.5,
  health: 30,
  speed: 0.28,
  xp: 5,
  fleeSpeed: 1.8,
  breed: ['apple', 'wheat'],
  tempt: ['apple', 'wheat', 'iceage:dwarf_willow'],
  heal: [['apple', 4], ['wheat', 2]],
  grazes: true,
  sleeps: 'night',
  strollRange: 16,
  ride: { seat: [0, 1.45, 0.05], tameItems: ['apple', 'wheat'], temper: 90, jumpStrength: 0.75 },
  spawn: [
    { biomes: ['steppe'], weight: 2, group: [2, 4] },
    { biomes: ['taiga'], weight: 2, group: [2, 4] },
    { biomes: ['forest'], weight: 1, group: [1, 3] },
  ],
  loot: [
    { item: 'leather', min: 1, max: 3 },
    { item: 'iceage:raw_game_meat', min: 2, max: 4, smelts: true },
  ],
  sounds: { ambient: 'mob.goat.ambient', hurt: 'mob.goat.hurt', death: 'mob.goat.death', pitch: [0.4, 0.5], interval: 20 },
  egg: ['#8a6440', '#e8dcc0'],
  client: { runSpeed: 5 },

  model: {
    ...model,
    bones: [
      ...model.bones,
      {
        name: 'saddle', parent: 'body', pivot: [0, 21, 0],
        cubes: [{ origin: [-4.5, 20.5, -4], size: [9, 1, 8], mat: 'saddle', inflate: 0.3 }, { origin: [-5.5, 15, -2], size: [1, 6, 4], mat: 'saddle' }, { origin: [4.5, 15, -2], size: [1, 6, 4], mat: 'saddle' }],
      },
    ],
  },

  materials: {
    hide: {
      base: '#8a6440',
      layers: [
        region('#4a3422', all(bone('neck'), face('front', 'bottom', 'left', 'right'))),
        region('#e2d2b0', all(bone('body'), ({ p }) => p[2] > 9)),
        underside('#c8b08a', { y: 13, soft: 2, where: bone('body') }),
        region('#5a4028', all(bone(...LEGS), ({ p }) => p[1] < 6)),
        mottle(0.06), fur(0.07),
      ],
    },
    face: { base: '#7a5838', layers: [gradient('#4a3422', { axis: 2, from: -18, to: -24 }), fur(0.06)] },
    muzzle: '#2e2218',
    ear: '#7a5838',
    tail: '#e2d2b0',
    antler: { base: '#cdb98e', layers: [region('#e8dcc0', face('top')), mottle(0.1, { scale: 2 })] },
    hoof: '#1e1712',
    saddle: { base: '#5a3a22', layers: [fur(0.04)] },
  },

  anims: {
    ...quadruped({ neck: 'neck', tail: ['tail'], ears: ['ear_l', 'ear_r'], swing: 30, sleepDrop: 8, legFold: 85, walkLength: 1.0, runLength: 0.45 }),
    alert: extras.alert({ neck: 'neck', ears: ['ear_l', 'ear_r'] }),
  },
};
