// Custom blocks (mammoth wool, permafrost and the plants of the mammoth steppe) and world
// generation: plants and permafrost in cold biomes, and the Mammoth Steppe biome for
// worlds with the Custom Biomes experiment.
import { PNG } from 'pngjs';
import { hex, mix, noise3, shade } from './lib/texture.mjs';

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

function texture(paint) {
  const png = new PNG({ width: 16, height: 16 });
  png.data.fill(0);
  const put = (x, y, c) => {
    if (x < 0 || y < 0 || x > 15 || y > 15) return;
    png.data.set(hex(c), (y * 16 + x) * 4);
  };
  paint(put);
  return PNG.sync.write(png);
}

/** Shaggy reddish-brown wool, the hairs hanging in vertical locks. */
const woolTexture = () => texture((put) => {
  const base = hex('#6e4528');
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      const lock = noise3(x * 0.9, y / 4, 0, 4);
      put(x, y, shade(base, 0.72 + lock * 0.5));
    }
});

/** Frozen, dark soil with veins and lenses of ice. */
const permafrostTexture = () => texture((put) => {
  const soil = ['#4a3a2c', '#56442f', '#3d3024', '#5c4a36'];
  const rand = rng(5);
  for (let y = 0; y < 16; y++)
    for (let x = 0; x < 16; x++) {
      let c = hex(soil[Math.floor(rand() * soil.length)]);
      const ice = noise3(x / 3, y / 2, 0, 9);
      if (ice > 0.68) c = mix(hex('#a9d4e6'), hex('#e8f6fb'), (ice - 0.68) * 3);
      else if (ice > 0.62) c = mix(c, hex('#8fb8c9'), 0.5);
      put(x, y, c);
    }
  // A few frost glints.
  for (const [x, y] of [[2, 3], [11, 6], [6, 12], [13, 13]]) put(x, y, '#ffffff');
});

/** Tufts of pale steppe grass. */
const grassTexture = () => texture((put) => {
  const rand = rng(17);
  const greens = ['#9aa45a', '#b3b36e', '#c9c08a', '#87914e'];
  for (let b = 0; b < 11; b++) {
    let x = 1 + Math.floor(rand() * 14);
    const h = 6 + Math.floor(rand() * 9);
    const c = greens[Math.floor(rand() * greens.length)];
    const lean = rand() < 0.5 ? -1 : 1;
    for (let i = 0; i < h; i++) {
      put(x, 15 - i, c);
      if (i > 3 && rand() < 0.3) x += lean;
    }
  }
});

/** Cotton grass: thin stalks with white fluffy heads. */
const cottonGrassTexture = () => texture((put) => {
  const rand = rng(23);
  for (let b = 0; b < 5; b++) {
    const x = 2 + b * 3 + Math.floor(rand() * 2);
    const h = 8 + Math.floor(rand() * 5);
    for (let i = 0; i < h; i++) put(x, 15 - i, i < 3 ? '#6f8a3a' : '#8a9a50');
    const top = 15 - h;
    for (const [dx, dy] of [[0, 0], [-1, 0], [1, 0], [0, -1], [-1, -1], [1, -1], [0, -2], [0, 1]]) put(x + dx, top + dy, dy === -2 ? '#f0f0ea' : '#ffffff');
  }
  for (let x = 0; x < 16; x += 2) put(x, 15, '#5f7a34');
});

/** Arctic poppy: yellow cup-shaped flowers on hairy stalks. */
const poppyTexture = () => texture((put) => {
  for (const [x, h] of [[4, 9], [8, 12], [11, 8]]) {
    for (let i = 0; i < h; i++) put(x, 15 - i, '#6d8040');
    const t = 15 - h;
    for (const [dx, dy, c] of [[-1, 0, '#f2d43a'], [1, 0, '#f2d43a'], [0, 0, '#e8a020'], [-1, -1, '#f8e45a'], [1, -1, '#f8e45a'], [0, -1, '#f8e45a'], [-2, -1, '#f2d43a'], [2, -1, '#f2d43a']]) put(x + dx, t + dy, c);
  }
  for (const [x, y] of [[3, 13], [5, 12], [7, 14], [9, 13], [12, 12]]) put(x, y, '#8a9c58');
});

/** Dwarf willow: a creeping shrub with small round leaves and fluffy catkins. */
const willowTexture = () => texture((put) => {
  const rand = rng(31);
  for (let b = 0; b < 4; b++) {
    let x = 2 + Math.floor(rand() * 12), y = 15;
    for (let i = 0; i < 8; i++) {
      put(x, y, '#6b4a30');
      if (rand() < 0.6) put(x + (rand() < 0.5 ? -1 : 1), y, rand() < 0.15 ? '#e8e2c8' : '#5f8a3e');
      y -= 1;
      x += rand() < 0.5 ? -1 : 1;
      x = Math.max(1, Math.min(14, x));
    }
  }
  for (let i = 0; i < 18; i++) put(Math.floor(rand() * 16), 7 + Math.floor(rand() * 8), rand() < 0.2 ? '#d8d0a8' : '#4f7a34');
});

const box = (origin, size) => ({
  origin, size,
  uv: Object.fromEntries(['north', 'south', 'east', 'west', 'up', 'down'].map((f) => [f, { uv: [0, 0], uv_size: [16, 16] }])),
});
const plane = (origin, size, rotation) => {
  const faces = size[0] === 0 ? ['east', 'west'] : ['north', 'south'];
  return {
    origin, size, ...(rotation ? { rotation, pivot: [0, 0, 0] } : {}),
    uv: Object.fromEntries(faces.map((f) => [f, { uv: [0, 0], uv_size: [16, 16] }])),
  };
};
const geometry = (id, cubes) => ({
  format_version: '1.12.0',
  'minecraft:geometry': [{ description: { identifier: `geometry.iceage.${id}`, texture_width: 16, texture_height: 16 }, bones: [{ name: 'block', pivot: [0, 0, 0], cubes }] }],
});

/** A full cube block. */
function solid({ id, name, sound, texture: tex, hardness, mapColor, loot }) {
  return {
    id, name, sound, texture: tex, kind: 'solid', hardness, loot,
    geometry: geometry(id, [box([-8, 0, -8], [16, 16, 16])]),
    definition: {
      format_version: '1.21.90',
      'minecraft:block': {
        description: { identifier: `iceage:${id}`, menu_category: { category: 'nature' } },
        components: {
          'minecraft:geometry': 'minecraft:geometry.full_block',
          'minecraft:material_instances': { '*': { texture: `iceage_${id}`, render_method: 'opaque' } },
          'minecraft:destructible_by_mining': { seconds_to_destroy: hardness },
          'minecraft:destructible_by_explosion': { explosion_resistance: hardness * 2 },
          'minecraft:map_color': mapColor,
          'minecraft:display_name': `tile.iceage:${id}.name`,
          ...(loot ? { 'minecraft:loot': `loot_tables/blocks/iceage_${id}.json` } : {}),
        },
      },
    },
  };
}

/** A small plant: two crossed planes, no collision, sits on soil or snow. */
function plant({ id, name, texture: tex, mapColor, height = 16 }) {
  return {
    id, name, sound: 'grass', texture: tex, kind: 'plant',
    geometry: geometry(id, [plane([-8, 0, 0], [16, height, 0], [0, 45, 0]), plane([-8, 0, 0], [16, height, 0], [0, -45, 0])]),
    definition: {
      format_version: '1.21.90',
      'minecraft:block': {
        description: { identifier: `iceage:${id}`, menu_category: { category: 'nature', group: 'minecraft:itemGroup.name.flower' } },
        components: {
          'minecraft:geometry': `geometry.iceage.${id}`,
          'minecraft:material_instances': { '*': { texture: `iceage_${id}`, render_method: 'alpha_test', ambient_occlusion: false, face_dimming: false } },
          'minecraft:collision_box': false,
          'minecraft:selection_box': { origin: [-6, 0, -6], size: [12, Math.min(16, height), 12] },
          'minecraft:light_dampening': 0,
          'minecraft:destructible_by_mining': { seconds_to_destroy: 0 },
          'minecraft:flammable': { catch_chance_modifier: 60, destroy_chance_modifier: 100 },
          'minecraft:map_color': mapColor,
          'minecraft:replaceable': {},
          'minecraft:placement_filter': {
            conditions: [{ allowed_faces: ['up'], block_filter: ['minecraft:grass_block', 'minecraft:dirt', 'minecraft:coarse_dirt', 'minecraft:podzol', 'minecraft:snow', 'minecraft:moss_block', 'iceage:permafrost'] }],
          },
          'minecraft:display_name': `tile.iceage:${id}.name`,
        },
      },
    },
  };
}

export const blocks = [
  solid({ id: 'mammoth_wool_block', name: 'Mammoth Wool Block', sound: 'cloth', texture: woolTexture(), hardness: 0.8, mapColor: '#6e4528' }),
  // Frozen soil with the odd bit of something frozen in it (src/hunting is not involved: the
  // remains are thawed over a campfire, see scripts/thawing.js).
  solid({ id: 'permafrost', name: 'Permafrost', sound: 'gravel', texture: permafrostTexture(), hardness: 1.0, mapColor: '#4a3a2c', loot: [
    { item: 'iceage:frozen_remains', chance: 0.25 },
    { item: 'minecraft:dirt', chance: 0.75 },
  ] }),
  plant({ id: 'steppe_grass', name: 'Steppe Grass', texture: grassTexture(), mapColor: '#b3b36e' }),
  plant({ id: 'cotton_grass', name: 'Cotton Grass', texture: cottonGrassTexture(), mapColor: '#e8e8e0' }),
  plant({ id: 'arctic_poppy', name: 'Arctic Poppy', texture: poppyTexture(), mapColor: '#f2d43a' }),
  plant({ id: 'dwarf_willow', name: 'Dwarf Willow', texture: willowTexture(), mapColor: '#4f7a34' }),
];

/** Bedrock block loot tables (only blocks that don't just drop themselves). */
export function blockLoot(block) {
  return {
    pools: [{
      rolls: 1,
      entries: block.loot.map((l) => ({ type: 'item', name: l.item, weight: Math.round(l.chance * 100) })),
    }],
  };
}

export const blockRecipes = [
  {
    'minecraft:recipe_shaped': {
      description: { identifier: 'iceage:mammoth_wool_block' },
      tags: ['crafting_table'],
      pattern: ['WW', 'WW'],
      key: { W: { item: 'iceage:mammoth_wool' } },
      result: { item: 'iceage:mammoth_wool_block' },
      unlock: [{ item: 'iceage:mammoth_wool' }],
    },
  },
  {
    'minecraft:recipe_shapeless': {
      description: { identifier: 'iceage:mammoth_wool_from_block' },
      tags: ['crafting_table'],
      ingredients: [{ item: 'iceage:mammoth_wool_block' }],
      result: { item: 'iceage:mammoth_wool', count: 4 },
      unlock: [{ item: 'iceage:mammoth_wool_block' }],
    },
  },
];

// ---------------------------------------------------------------- world generation

/** Bedrock biome tag of the Mammoth Steppe (animals' spawn rules use it as 'steppe'). */
export const STEPPE_TAG = 'iceage_steppe';

/** Cold vanilla biomes (Bedrock tags) that get the steppe plants and permafrost without the experiment. */
const COLD = ['ice_plains', 'cold', 'frozen'];
const anyTag = (tags) => [{ any_of: tags.map((value) => ({ test: 'has_biome_tag', operator: '==', value })) }];

/** Plants scattered on the surface: [block, tags, tries per chunk, chance 1 in n]. */
const PLANTS = [
  ['steppe_grass', [...COLD, STEPPE_TAG], 6, 1],
  ['cotton_grass', ['ice_plains', 'taiga', STEPPE_TAG], 3, 2],
  ['arctic_poppy', [...COLD, STEPPE_TAG], 2, 3],
  ['dwarf_willow', ['ice_plains', 'frozen', STEPPE_TAG], 2, 3],
];

const surfaceRule = (id, feature, tags, iterations, denominator) => ({
  format_version: '1.13.0',
  'minecraft:feature_rules': {
    description: { identifier: `iceage:${id}`, places_feature: `iceage:${feature}` },
    conditions: { placement_pass: 'surface_pass', 'minecraft:biome_filter': anyTag(tags) },
    distribution: {
      iterations,
      // Bedrock wants the denominator above the numerator: leave it out for "every chunk".
      ...(denominator > 1 ? { scatter_chance: { numerator: 1, denominator } } : {}),
      x: { distribution: 'uniform', extent: [0, 15] },
      y: 'query.heightmap(variable.worldx, variable.worldz)',
      z: { distribution: 'uniform', extent: [0, 15] },
    },
  },
});

export const features = {};
for (const [id, tags, iterations, denominator] of PLANTS) {
  features[`features/${id}_feature.json`] = {
    format_version: '1.13.0',
    'minecraft:single_block_feature': {
      description: { identifier: `iceage:${id}_feature` },
      places_block: `iceage:${id}`,
      enforce_placement_rules: true,
      enforce_survivability_rules: true,
      may_attach_to: { min_sides_must_attach: 1, bottom: ['minecraft:grass_block', 'minecraft:dirt', 'minecraft:coarse_dirt', 'minecraft:podzol', 'minecraft:snow'] },
    },
  };
  features[`feature_rules/${id}_rule.json`] = surfaceRule(`${id}_rule`, `${id}_feature`, tags, iterations, denominator);
}
// Permafrost: blobs in the frozen ground just under the surface of cold biomes.
features['features/permafrost_feature.json'] = {
  format_version: '1.13.0',
  'minecraft:ore_feature': {
    description: { identifier: 'iceage:permafrost_feature' },
    count: 12,
    replace_rules: [{ places_block: 'iceage:permafrost', may_replace: ['minecraft:dirt', 'minecraft:gravel', 'minecraft:stone', 'minecraft:coarse_dirt'] }],
  },
};
features['feature_rules/permafrost_rule.json'] = {
  format_version: '1.13.0',
  'minecraft:feature_rules': {
    description: { identifier: 'iceage:permafrost_rule', places_feature: 'iceage:permafrost_feature' },
    conditions: { placement_pass: 'underground_pass', 'minecraft:biome_filter': anyTag([...COLD, STEPPE_TAG]) },
    distribution: {
      iterations: 3,
      x: { distribution: 'uniform', extent: [0, 15] },
      y: { distribution: 'uniform', extent: ['query.heightmap(variable.worldx, variable.worldz) - 8', 'query.heightmap(variable.worldx, variable.worldz) - 2'] },
      z: { distribution: 'uniform', extent: [0, 15] },
    },
  },
};

/**
 * The Mammoth Steppe (Bedrock, Custom Biomes experiment): cold, dry grassland with patchy
 * snow, carved out of snowy plains, taiga and plains. Without the experiment the animals
 * and plants live in the vanilla cold biomes instead.
 */
export const biome = {
  behavior: {
    format_version: '1.21.110',
    'minecraft:biome': {
      description: { identifier: 'iceage:mammoth_steppe' },
      components: {
        'minecraft:climate': { downfall: 0.2, snow_accumulation: [0.0, 0.125], temperature: 0.05 },
        'minecraft:surface_builder': {
          builder: {
            type: 'minecraft:overworld',
            sea_floor_depth: 7,
            sea_floor_material: 'minecraft:gravel',
            foundation_material: 'minecraft:stone',
            mid_material: 'minecraft:dirt',
            top_material: 'minecraft:grass_block',
            sea_material: 'minecraft:water',
          },
        },
        'minecraft:surface_material_adjustments': {
          adjustments: [
            { materials: { top_material: 'minecraft:coarse_dirt' }, noise_range: [0.3, 0.45], noise_frequency_scale: 0.07 },
            { materials: { top_material: 'minecraft:snow' }, noise_range: [-0.65, -0.35], noise_frequency_scale: 0.05 },
            { materials: { top_material: 'minecraft:podzol' }, noise_range: [0.7, 0.8], noise_frequency_scale: 0.07 },
          ],
        },
        'minecraft:replace_biomes': {
          replacements: [
            { dimension: 'minecraft:overworld', targets: ['minecraft:ice_plains'], amount: 0.45, noise_frequency_scale: 0.5 },
            { dimension: 'minecraft:overworld', targets: ['minecraft:cold_taiga', 'minecraft:taiga'], amount: 0.2, noise_frequency_scale: 0.5 },
            { dimension: 'minecraft:overworld', targets: ['minecraft:plains'], amount: 0.12, noise_frequency_scale: 0.4 },
          ],
        },
        'minecraft:tags': { tags: ['animal', 'monster', 'overworld', 'cold', STEPPE_TAG] },
      },
    },
  },
  client: {
    format_version: '1.21.120',
    'minecraft:client_biome': {
      description: { identifier: 'iceage:mammoth_steppe' },
      components: {
        'minecraft:sky_color': { sky_color: '#a9c4d8' },
        'minecraft:fog_appearance': { fog_identifier: 'minecraft:fog_cold_taiga' },
        'minecraft:water_appearance': { surface_color: '#3d6e8a' },
        'minecraft:grass_appearance': { color: '#a8a868' },
        'minecraft:foliage_appearance': { color: '#7a8a52' },
        'minecraft:atmosphere_identifier': { atmosphere_identifier: 'minecraft:default_atmospherics' },
        'minecraft:lighting_identifier': { lighting_identifier: 'minecraft:default_lighting' },
        'minecraft:color_grading_identifier': { color_grading_identifier: 'minecraft:default_color_grading' },
        'minecraft:water_identifier': { water_identifier: 'minecraft:default_water' },
        'minecraft:biome_music': { music_definition: 'cold_taiga' },
      },
    },
  },
};
