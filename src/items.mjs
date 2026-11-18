// Custom items: definitions, pixel-art icons, recipes.
import { PNG } from 'pngjs';
import { hex, noise3, pixelIcon, shade } from './lib/texture.mjs';

const MEAT = {
  '.': null, o: '#5a1f1a', r: '#b5413a', p: '#d9736b', w: '#f0d9c8',
};
const COOKED = {
  '.': null, o: '#3b2213', r: '#8a4f2b', p: '#b8743f', w: '#e7c79a',
};
const meatRows = [
  '................',
  '................',
  '......oooo......',
  '....oorrrroo....',
  '...orrppprrro...',
  '..orrpprrrrrro..',
  '..orpprrrrrrro..',
  '.orrprrrrrrrro..',
  '.orrrrrrrrrro...',
  '.orrrrrrrroo....',
  '..orrrrrroww....',
  '...ooooooowwo...',
  '..........oww...',
  '...........oo...',
  '................',
  '................',
];

const FUR = { '.': null, k: '#3a2416', f: '#6b4a2e', l: '#8a6440', h: '#a88058' };

/** Fur armour pieces: [id, name, Bedrock slot, enchant slot, protection, durability, icon rows]. */
const ARMOUR = [
  ['fur_hood', 'Fur Hood', 'slot.armor.head', 'armor_head', 1, 80, [
    '................',
    '................',
    '....kkkkkkkk....',
    '...kfflllfffk...',
    '..kfllhhhllffk..',
    '..kflhhhhhhlfk..',
    '..kflk....klfk..',
    '..kflk....klfk..',
    '..kffk....kffk..',
    '..kffk....kffk..',
    '...kk......kk...',
    '................',
    '................',
    '................',
    '................',
    '................',
  ]],
  ['fur_coat', 'Fur Coat', 'slot.armor.chest', 'armor_torso', 3, 120, [
    '................',
    '..kkkk....kkkk..',
    '.kfllfk..kfllfk.',
    '.kflhfkkkkfhlfk.',
    '.kflhhhhhhhhlfk.',
    '.kkkflhhhhlfkkk.',
    '...kflhhhhlfk...',
    '...kflhhhhlfk...',
    '...kfllhhllfk...',
    '...kfllhhllfk...',
    '...kffllllffk...',
    '...kffffffffk...',
    '...kkkkkkkkkk...',
    '................',
    '................',
    '................',
  ]],
  ['fur_leggings', 'Fur Leggings', 'slot.armor.legs', 'armor_legs', 2, 110, [
    '................',
    '...kkkkkkkkkk...',
    '...kflhhhhlfk...',
    '...kflhhhhlfk...',
    '...kflhkkhlfk...',
    '...kflk..klfk...',
    '...kflk..klfk...',
    '...kflk..klfk...',
    '...kflk..klfk...',
    '...kflk..klfk...',
    '...kffk..kffk...',
    '...kkkk..kkkk...',
    '................',
    '................',
    '................',
    '................',
  ]],
  ['fur_boots', 'Fur Boots', 'slot.armor.feet', 'armor_feet', 1, 90, [
    '................',
    '................',
    '................',
    '................',
    '................',
    '...kkkk..kkkk...',
    '...kflk..klfk...',
    '...kflk..klfk...',
    '...kflk..klfk...',
    '..kkflk..klfkk..',
    '.kfhhlk..klhhfk.',
    '.kffffk..kffffk.',
    '.kkkkkk..kkkkkk.',
    '................',
    '................',
    '................',
  ]],
];

/** Vanilla-layout armour texture (64x32) painted all over with shaggy brown fur. */
export function furArmorTexture(seed = 3) {
  const png = new PNG({ width: 64, height: 32 });
  const base = hex('#6b4a2e');
  for (let y = 0; y < 32; y++)
    for (let x = 0; x < 64; x++) {
      // Long hairs: streaks that run down the texture.
      const streak = noise3(x * 1.7, y / 3, 0, seed);
      const n = noise3(x / 4, y / 4, 1, seed + 1);
      let c = shade(base, 0.7 + streak * 0.45 + (n - 0.5) * 0.2);
      png.data.set(c, (y * 64 + x) * 4);
    }
  return PNG.sync.write(png);
}

export const items = [
  {
    id: 'field_guide',
    name: 'Ice Age Field Guide',
    category: 'equipment',
    stack: 1,
    icon: pixelIcon([
      '................',
      '..bbbbbbbbbbb...',
      '..bcccccccccccb.',
      '..bcbbbbbbbbcb..',
      '..bcbwwwwwwbcb..',
      '..bcbwkkkkwbcb..',
      '..bcbkkkkkkbcb..',
      '..bcbkwkkwkbcb..',
      '..bcbkwwwwkbcb..',
      '..bcbwwwwwwbcb..',
      '..bcbbbbbbbbcb..',
      '..bcccccccccccb.',
      '..bppppppppppb..',
      '..bbbbbbbbbbb...',
      '................',
      '................',
    ], { '.': null, b: '#27465e', c: '#4f7fa3', w: '#e8f1f6', k: '#6b4a2e', p: '#f2ecdc' }),
  },
  {
    id: 'raw_game_meat',
    name: 'Raw Game Meat',
    category: 'nature',
    food: { nutrition: 3, saturation: 0.3 },
    icon: pixelIcon(meatRows, MEAT),
  },
  {
    id: 'cooked_game_meat',
    name: 'Cooked Game Meat',
    category: 'nature',
    food: { nutrition: 8, saturation: 0.8 },
    icon: pixelIcon(meatRows, COOKED),
  },
  {
    id: 'mammoth_wool',
    name: 'Mammoth Wool',
    category: 'items',
    icon: pixelIcon([
      '................',
      '................',
      '.....kk..kk.....',
      '....kffkkllk....',
      '...kfllffhlfk...',
      '..kflhllfhhlfk..',
      '..kflhhlflhlfk..',
      '.kfllhlflfhllfk.',
      '.kflhllflfhhlfk.',
      '..kfllflfflfk...',
      '..kkfllfllffk...',
      '...kkfffffkk....',
      '.....kkkkk......',
      '................',
      '................',
      '................',
    ], FUR),
  },
  {
    id: 'ivory',
    name: 'Ivory',
    category: 'items',
    icon: pixelIcon([
      '................',
      '................',
      '...........ow...',
      '..........owwo..',
      '..........owo...',
      '.........owwo...',
      '........owwo....',
      '.......owwso....',
      '......owwso.....',
      '.....owwso......',
      '...oowwsso......',
      '..owwwsso.......',
      '..oossoo........',
      '...ooo..........',
      '................',
      '................',
    ], { '.': null, o: '#8a7a5a', w: '#f4ecd6', s: '#d8c8a2' }),
  },
  {
    id: 'frozen_remains',
    name: 'Frozen Remains',
    category: 'items',
    stack: 16,
    icon: pixelIcon([
      '................',
      '...iiiiiiiiii...',
      '..iaaaaaaaaaai..',
      '..iabbaaaabaai..',
      '..iabwwaaaaaai..',
      '..iaawwwwaabai..',
      '..iaaawffwaaai..',
      '..iaabwffwwaai..',
      '..iaaawwwwwaai..',
      '..iaaaaawwaaai..',
      '..iabaaaaaabai..',
      '..iaaaaaaaaaai..',
      '...iiiiiiiiii...',
      '................',
      '................',
      '................',
    ], { '.': null, i: '#5f8fb0', a: '#bfe0ef', b: '#e8f6fc', w: '#e6dcc4', f: '#6b4a2e' }),
  },
  ...ARMOUR.map(([id, name, slot, enchant, protection, durability, rows]) => ({
    id,
    name,
    category: 'equipment',
    stack: 1,
    armor: { slot, protection, texture: slot === 'slot.armor.legs' ? 'fur_2' : 'fur_1' },
    components: {
      'minecraft:wearable': { slot, protection },
      'minecraft:durability': { max_durability: durability },
      'minecraft:repairable': { repair_items: [{ items: ['iceage:mammoth_wool'], repair_amount: Math.round(durability / 3) }] },
      'minecraft:enchantable': { slot: enchant, value: 15 },
    },
    icon: pixelIcon(rows, FUR),
  })),
];

const shaped = (id, pattern, key, result = `iceage:${id}`, count = 1) => ({
  'minecraft:recipe_shaped': {
    description: { identifier: `iceage:${id}` },
    tags: ['crafting_table'],
    pattern,
    key: Object.fromEntries(Object.entries(key).map(([k, item]) => [k, { item }])),
    result: { item: result, count },
    unlock: [{ item: Object.values(key)[0] }],
  },
});

const W = 'iceage:mammoth_wool';

export const recipes = [
  {
    'minecraft:recipe_shapeless': {
      description: { identifier: 'iceage:field_guide' },
      tags: ['crafting_table'],
      ingredients: [{ item: 'minecraft:book' }, { item: 'minecraft:snowball' }],
      result: { item: 'iceage:field_guide' },
      unlock: [{ item: 'minecraft:book' }],
    },
  },
  {
    'minecraft:recipe_furnace': {
      description: { identifier: 'iceage:cooked_game_meat' },
      tags: ['furnace', 'smoker', 'campfire', 'soul_campfire'],
      input: 'iceage:raw_game_meat',
      output: 'iceage:cooked_game_meat',
    },
  },
  shaped('fur_hood', ['WWW', 'W W'], { W }),
  shaped('fur_coat', ['W W', 'WWW', 'WWW'], { W }),
  shaped('fur_leggings', ['WWW', 'W W', 'W W'], { W }),
  shaped('fur_boots', ['W W', 'W W'], { W }),
  {
    'minecraft:recipe_shapeless': {
      description: { identifier: 'iceage:bone_meal_from_ivory' },
      tags: ['crafting_table'],
      ingredients: [{ item: 'iceage:ivory' }],
      result: { item: 'minecraft:bone_meal', count: 6 },
      unlock: [{ item: 'iceage:ivory' }],
    },
  },
];

export function buildItem(item) {
  const components = {
    'minecraft:icon': `iceage_${item.id}`,
    'minecraft:display_name': { value: `item.iceage:${item.id}.name` },
    'minecraft:max_stack_size': item.stack ?? 64,
  };
  if (item.food) {
    Object.assign(components, {
      'minecraft:food': { nutrition: item.food.nutrition, saturation_modifier: item.food.saturation },
      'minecraft:use_animation': 'eat',
      'minecraft:use_modifiers': { use_duration: 1.6, movement_modifier: 0.35 },
    });
  }
  Object.assign(components, item.components ?? {});
  return {
    format_version: '1.21.90',
    'minecraft:item': {
      description: { identifier: `iceage:${item.id}`, menu_category: { category: item.category ?? 'items' } },
      components,
    },
  };
}

/** Bedrock attachable for a fur armour piece: vanilla armour geometry with the fur texture. */
export function armorAttachable(item) {
  const part = { 'slot.armor.head': ['helmet', 'helmet'], 'slot.armor.chest': ['chestplate', 'chest'], 'slot.armor.legs': ['leggings', 'leg'], 'slot.armor.feet': ['boots', 'boot'] }[item.armor.slot];
  return {
    format_version: '1.10.0',
    'minecraft:attachable': {
      description: {
        identifier: `iceage:${item.id}`,
        materials: { default: 'armor', enchanted: 'armor_enchanted' },
        textures: { default: `textures/models/armor/iceage_${item.armor.texture}`, enchanted: 'textures/misc/enchanted_item_glint' },
        geometry: { default: `geometry.humanoid.armor.${part[0]}` },
        scripts: { parent_setup: `variable.${part[1]}_layer_visible = 0.0;` },
        render_controllers: ['controller.render.armor'],
      },
    },
  };
}
