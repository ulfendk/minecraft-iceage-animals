// Real sizes of every animal. Models are built to these (1 block = 1 m) and the build
// fails if a model's shoulder height or head-and-body length is more than 10% off
// (see src/lib/measure.mjs). Weights feed Realistic Hunting (src/hunting.mjs).
//
// shoulder: height at the withers in metres (top of the hump where there is one; hair
//           is not counted). length: tip of the nose to the rump, without trunk or tail.
// weight: live weight range in kg. Figures are typical adults, from the published
// estimates noted per animal.
export const SIZES = {
  // Proboscideans. Woolly mammoths were about as big as African elephants; bulls up to 3.4 m.
  woolly_mammoth: { shoulder: 3.2, length: 4.4, weight: [4000, 7000], note: 'Larramendi 2016: bulls 2.7–3.4 m, 4–8 t' },
  mastodon: { shoulder: 2.7, length: 4.6, weight: [3500, 7000], note: 'American mastodon, Larramendi 2016: 2.5–2.9 m, longer and lower than a mammoth' },
  // Rhinos.
  woolly_rhino: { shoulder: 1.75, length: 3.6, weight: [1800, 2900], note: 'Coelodonta: 1.6–2.0 m, 3.2–3.8 m long' },
  elasmotherium: { shoulder: 2.1, length: 4.5, weight: [3500, 4500], note: 'Elasmotherium sibiricum: about 2 m, 4.5 m long' },
  // Hoofed animals.
  steppe_bison: { shoulder: 2.0, length: 3.4, weight: [700, 1200], note: 'Bison priscus: up to 2 m at the hump' },
  irish_elk: { shoulder: 2.0, length: 3.1, weight: [450, 700], note: 'Megaloceros giganteus: 2.0–2.1 m, antlers up to 3.6 m across' },
  wild_horse: { shoulder: 1.4, length: 2.2, weight: [300, 450], note: 'Pleistocene Equus ferus: 1.3–1.45 m' },
  macrauchenia: { shoulder: 1.6, length: 3.0, weight: [900, 1100], note: 'Macrauchenia patachonica: about 1.5–1.7 m, 3 m long' },
  // Australian marsupial.
  diprotodon: { shoulder: 1.8, length: 3.8, weight: [2000, 2800], note: 'Diprotodon optatum: 1.8 m, 3.8 m long' },
  // Xenarthrans.
  glyptodon: { shoulder: 1.4, length: 2.6, weight: [800, 2000], note: 'Glyptodon clavipes: shell about 1.4 m high and 2 m long; 3.2–3.3 m long with the tail' },
  doedicurus: { shoulder: 1.5, length: 3.0, weight: [1400, 2400], note: 'Doedicurus clavicaudatus: 1.5 m high, about 3.6–4 m long with the tail club' },
  megatherium: { shoulder: 2.0, length: 4.6, weight: [3000, 4500], note: 'Megatherium americanum: about 2 m at the shoulder on all fours, 6 m with the tail, over 4 m standing' },
  megalonyx: { shoulder: 1.2, length: 2.5, weight: [800, 1200], note: 'Megalonyx jeffersonii: about 3 m long with the tail' },
  castoroides: { shoulder: 0.6, length: 1.5, weight: [60, 110], note: 'Giant beaver, Castoroides ohioensis: 1.9–2.2 m long with the tail' },
  // Carnivores.
  smilodon: { shoulder: 1.15, length: 2.0, weight: [220, 400], note: 'Smilodon populator: about 1.1–1.2 m' },
  homotherium: { shoulder: 1.1, length: 1.9, weight: [150, 230], note: 'Homotherium latidens: about 1.1 m, high shoulders and a sloping back' },
  cave_lion: { shoulder: 1.2, length: 2.3, weight: [200, 340], note: 'Panthera spelaea: about 10% bigger than a modern lion' },
  cave_bear: { shoulder: 1.35, length: 2.9, weight: [350, 600], note: 'Ursus spelaeus: about 1.35 m on all fours, males up to 3 m long' },
  short_faced_bear: { shoulder: 1.6, length: 2.8, weight: [600, 950], note: 'Arctodus simus: about 1.5–1.8 m on all fours, long legs' },
  dire_wolf: { shoulder: 0.85, length: 1.6, weight: [55, 70], note: 'Aenocyon dirus: a little bigger than the largest grey wolves' },
};

/**
 * Animals from Ice Age Animals' sibling add-ons, measured the same way (by the build in
 * minecraft-safari-animals), so the size check can print how the extinct giants compare
 * with their living relatives. Shoulder heights in metres.
 */
export const RELATIVES = {
  woolly_mammoth: ['African elephant', 3.2],
  woolly_rhino: ['white rhino', 1.8],
  steppe_bison: ['American bison', 1.85],
  cave_lion: ['lion', 1.1],
  cave_bear: ['grizzly bear', 1.1],
  dire_wolf: ['grey wolf', 0.8],
};
