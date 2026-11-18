// In-game texts (.lang files) for every supported language.
// Danish names for animals, items, habitats and tags are shared with the
// website (src/i18n.mjs); vanilla item names follow Minecraft's own da_DK.lang.
import { guide, ODD_HERD_NOTE } from './guide.mjs';
import { STRINGS } from './i18n.mjs';
import { NS } from './lib/constants.mjs';
import { BIOME_NAMES, TAGS } from './lib/info.mjs';

export const LOCALES = ['en_US', 'da_DK'];

/** Foods used for breeding and taming, keyed by item id. */
const FOODS = {
  acacia_leaves: ['Acacia Leaves', 'Akacieløv'], apple: ['Apple', 'Æble'], bamboo: ['Bamboo', 'Bambus'],
  beef: ['Raw Beef', 'Råt kød'], beetroot: ['Beetroot', 'Rødbede'], beetroot_seeds: ['Beetroot Seeds', 'Rødbedefrø'],
  birch_leaves: ['Birch Leaves', 'Birkeløv'], bone: ['Bone', 'Knogle'], carrot: ['Carrot', 'Gulerod'],
  chicken: ['Raw Chicken', 'Rå kylling'], cod: ['Raw Cod', 'Rå torsk'], glow_berries: ['Glow Berries', 'Glødebær'],
  golden_apple: ['Golden Apple', 'Gyldent æble'], golden_carrot: ['Golden Carrot', 'Gylden gulerod'],
  hay_block: ['Hay Bale', 'Halmballe'], kelp: ['Kelp', 'Tang'], melon_seeds: ['Melon Seeds', 'Melonfrø'],
  melon_slice: ['Melon Slice', 'Melonskive'], mutton: ['Raw Mutton', 'Råt fårekød'], oak_leaves: ['Oak Leaves', 'Egeløv'],
  porkchop: ['Raw Porkchop', 'Rå svinekotelet'], potato: ['Potato', 'Kartoffel'], pumpkin_seeds: ['Pumpkin Seeds', 'Græskarfrø'],
  rabbit: ['Raw Rabbit', 'Rå kanin'], rotten_flesh: ['Rotten Flesh', 'Råddent kød'], salmon: ['Raw Salmon', 'Rå laks'],
  sea_pickle: ['Sea Pickle', 'Søpølse'], short_grass: ['Short Grass', 'Kort græs'], spider_eye: ['Spider Eye', 'Edderkoppeøje'],
  sugar: ['Sugar', 'Sukker'], sugar_cane: ['Sugar Cane', 'Sukkerrør'], sweet_berries: ['Sweet Berries', 'Søde bær'],
  tropical_fish: ['Tropical Fish', 'Tropisk fisk'], wheat: ['Wheat', 'Hvede'], wheat_seeds: ['Wheat Seeds', 'Hvedefrø'],
  'iceage:raw_game_meat': ['Raw Game Meat', 'Råt vildtkød'], 'iceage:dwarf_willow': ['Dwarf Willow', 'Polarpil'],
  'iceage:steppe_grass': ['Steppe Grass', 'Steppegræs'], spruce_leaves: ['Spruce Leaves', 'Granløv'], fern: ['Fern', 'Bregne'],
  sweet_berries_bush: ['Sweet Berries', 'Søde bær'], kelp_block: ['Dried Kelp Block', 'Tørret tangblok'], dried_kelp: ['Dried Kelp', 'Tørret tang'],
  birch_log: ['Birch Log', 'Birkestamme'], stick: ['Stick', 'Pind'],
  honeycomb: ['Honeycomb', 'Bikage'], slime_ball: ['Slimeball', 'Slimklump'], seagrass: ['Seagrass', 'Søgræs'], cactus: ['Cactus', 'Kaktus'], dandelion: ['Dandelion', 'Mælkebøtte'], brown_mushroom: ['Brown Mushroom', 'Brun svamp'], red_mushroom: ['Red Mushroom', 'Rød svamp'], lily_pad: ['Lily Pad', 'Åkandeblad'], honey_bottle: ['Honey Bottle', 'Honningflaske'], egg: ['Egg', 'Æg'],
};
export const foodKey = (item) => `${NS}.food.${item.replace(/^.*:/, '')}`;

/** Danish compound form used before "-spawnæg" (as in vanilla "Heste-spawnæg"). */
const DA_EGG = {
  woolly_mammoth: 'Mammut', mastodon: 'Mastodont', woolly_rhino: 'Uldnæsehorns', elasmotherium: 'Elasmotherium',
  steppe_bison: 'Steppebison', irish_elk: 'Kæmpehjorte', wild_horse: 'Vildheste', macrauchenia: 'Macrauchenia', diprotodon: 'Diprotodon',
  glyptodon: 'Glyptodon', doedicurus: 'Doedicurus', megatherium: 'Kæmpedovendyrs', megalonyx: 'Megalonyx', castoroides: 'Kæmpebæver',
  smilodon: 'Sabelkatte', homotherium: 'Homotherium', cave_lion: 'Huleløve', cave_bear: 'Hulebjørne', short_faced_bear: 'Kortsnudebjørne',
  dire_wolf: 'Kæmpeulve',
};

const UI = {
  'iceage.guide.title': ['Field Guide', 'Felthåndbog'],
  'iceage.guide.intro': [
    'Animals you have spotted appear here. Walk close to an animal to add it.',
    'Dyr, du har set, dukker op her. Gå tæt på et dyr for at tilføje det.',
  ],
  'iceage.guide.spotted': ['New in your Field Guide: %s', 'Nyt i din felthåndbog: %s'],
  'iceage.guide.back': ['Back to the Field Guide', 'Tilbage til felthåndbogen'],
  'iceage.guide.welcome': [
    "§bYou received an Ice Age Field Guide!§r Use it to see the animals you've spotted.",
    '§bDu har fået en istids-felthåndbog!§r Brug den til at se de dyr, du har opdaget.',
  ],
  'iceage.guide.lives_in': ['Lives in:', 'Lever i:'],
  'iceage.guide.traits': ['Traits:', 'Kendetegn:'],
  'iceage.guide.breed_with': ['Breed with:', 'Avl med:'],
  'iceage.guide.tame_with': ['Tame with:', 'Tæm med:'],
  'iceage.guide.size': ['Real size: %s m at the shoulder, %s m long', 'Rigtig størrelse: %s m over skuldrene, %s m lang'],
  'iceage.guide.odd_herd': [ODD_HERD_NOTE, STRINGS.da.oddHerd],
  'iceage.odd_herd.spotted': ['§7An unlikely herd is heading south...', '§7En usandsynlig flok er på vej sydpå …'],
  'iceage.thaw.start': ['The frozen remains begin to thaw...', 'De frosne rester begynder at tø op …'],
  'iceage.thaw.done': ['Something stirs in the meltwater!', 'Noget rører sig i smeltevandet!'],
  'iceage.thaw.need_fire': ['Use frozen remains on a lit campfire to thaw them.', 'Brug frosne rester på et tændt lejrbål for at tø dem op.'],
};

/**
 * Lang entries for one locale as [key, value] pairs.
 * animals/items/blocks/helpers come from the build; `description` is the pack description.
 */
export function langEntries(locale, { animals, items, blocks, extraEntities, description, version }) {
  const i = LOCALES.indexOf(locale);
  const da = locale === 'da_DK' ? STRINGS.da : null;
  const pick = (pair) => pair[Math.max(0, i)];
  const out = [];
  out.push(['pack.description', da
    ? `Istidsdyr: uldhårede mammutter, sabelkatte, kæmpedovendyr og andre istidsdyr i rigtig størrelse (v${version})`
    : `${description} (v${version})`]);

  for (const a of animals) {
    const name = da?.names[a.id] ?? a.name;
    out.push([`entity.${NS}:${a.id}.name`, name]);
    out.push([`item.spawn_egg.entity.${NS}:${a.id}.name`, da ? `${DA_EGG[a.id] ?? name}-spawnæg` : `${a.name} Spawn Egg`]);
    out.push([`${NS}.guide.entry.${a.id}`, da?.guide[a.id] ?? guide[a.id] ?? '']);
  }
  for (const e of extraEntities) {
    out.push([`entity.${NS}:${e.id}.name`, e.name]);
    out.push([`item.spawn_egg.entity.${NS}:${e.id}.name`, e.name]);
  }
  for (const item of items) out.push([`item.${NS}:${item.id}.name`, da?.items[item.id] ?? item.name]);
  for (const block of blocks) out.push([`tile.${NS}:${block.id}.name`, da?.items[block.id] ?? block.name]);

  for (const [id, name] of Object.entries(BIOME_NAMES)) out.push([`${NS}.habitat.${id}`, da?.habitats[name] ?? name]);
  for (const [id, name] of Object.entries(TAGS)) out.push([`${NS}.tag.${id}`, da?.tags[name] ?? name]);
  for (const [item, pair] of Object.entries(FOODS)) out.push([foodKey(item), pick(pair)]);
  for (const [key, pair] of Object.entries(UI)) out.push([key, pick(pair)]);
  return out;
}

/** Every breed/tame food must have a translation. */
export function missingFoods(animals) {
  const used = new Set(animals.flatMap((a) => [...(a.breed ?? []), ...(a.ride?.tameItems ?? [])]));
  return [...used].filter((item) => !FOODS[item]);
}
