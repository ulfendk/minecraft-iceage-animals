// Generates the Java edition's resources (java/src/generated/resources) from the
// same specs as the Bedrock packs. GeckoLib reads the Bedrock geometry and
// animation formats directly, so models and animations are shared as-is.
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { huntingProfile } from '../src/hunting.mjs';
import { dirname, join } from 'node:path';

import { NS } from '../src/lib/constants.mjs';
import { hitbox } from '../src/lib/behavior.mjs';
import { eggIcon } from '../src/lib/texture.mjs';
import { furArmorTexture } from '../src/items.mjs';

const BEDROCK_TO_JAVA_SOUNDS = {
  'mob.horse.donkey.idle': 'entity.donkey.ambient', 'mob.horse.donkey.hit': 'entity.donkey.hurt',
  'mob.horse.donkey.death': 'entity.donkey.death', 'mob.horse.eat': 'entity.horse.eat',
  'mob.horse.idle': 'entity.horse.ambient', 'mob.horse.hit': 'entity.horse.hurt', 'mob.horse.death': 'entity.horse.death',
  'mob.goat.ambient': 'entity.goat.ambient', 'mob.goat.hurt': 'entity.goat.hurt', 'mob.goat.death': 'entity.goat.death',
  'mob.cow.say': 'entity.cow.ambient', 'mob.cow.hurt': 'entity.cow.hurt',
  'mob.pig.say': 'entity.pig.ambient', 'mob.pig.death': 'entity.pig.death',
  'mob.hoglin.hurt': 'entity.hoglin.hurt', 'mob.hoglin.ambient': 'entity.hoglin.ambient',
  'mob.hoglin.death': 'entity.hoglin.death', 'mob.hoglin.angry': 'entity.hoglin.angry',
  'mob.polarbear.warning': 'entity.polar_bear.warning', 'mob.polarbear.hurt': 'entity.polar_bear.hurt',
  'mob.polarbear.death': 'entity.polar_bear.death', 'mob.polarbear.idle': 'entity.polar_bear.ambient',
  'mob.cat.hiss': 'entity.cat.hiss', 'mob.cat.hit': 'entity.cat.hurt', 'mob.ocelot.death': 'entity.ocelot.death',
  'mob.cat.straymeow': 'entity.cat.stray_ambient',
  'mob.fox.screech': 'entity.fox.screech', 'mob.fox.ambient': 'entity.fox.ambient', 'mob.fox.hurt': 'entity.fox.hurt',
  'mob.fox.death': 'entity.fox.death', 'mob.fox.sniff': 'entity.fox.sniff',
  'mob.wolf.hurt': 'entity.wolf.hurt', 'mob.wolf.death': 'entity.wolf.death', 'mob.wolf.bark': 'entity.wolf.ambient',
  'mob.ravager.ambient': 'entity.ravager.ambient', 'mob.ravager.hurt': 'entity.ravager.hurt',
  'mob.ravager.death': 'entity.ravager.death', 'mob.ravager.roar': 'entity.ravager.roar',
  'mob.llama.idle': 'entity.llama.ambient', 'mob.llama.hurt': 'entity.llama.hurt', 'mob.llama.death': 'entity.llama.death',
  'mob.chicken.say': 'entity.chicken.ambient', 'mob.chicken.hurt': 'entity.chicken.hurt',
  'mob.parrot.idle': 'entity.parrot.ambient', 'mob.parrot.hurt': 'entity.parrot.hurt', 'mob.parrot.death': 'entity.parrot.death',
  'mob.phantom.idle': 'entity.phantom.ambient',
  'mob.turtle.ambient': 'entity.turtle.ambient_land', 'mob.turtle.hurt': 'entity.turtle.hurt', 'mob.turtle.death': 'entity.turtle.death',
  'mob.panda.idle': 'entity.panda.ambient', 'mob.panda.hurt': 'entity.panda.hurt', 'mob.panda.death': 'entity.panda.death',
  'mob.panda.idle.aggressive': 'entity.panda.aggressive_ambient',
  'mob.wolf.growl': 'entity.wolf.growl',
  'mob.armadillo.ambient': 'entity.armadillo.ambient', 'mob.armadillo.hurt': 'entity.armadillo.hurt', 'mob.armadillo.death': 'entity.armadillo.death',
  'mob.fish.hurt': 'entity.cod.hurt', 'mob.fish.death': 'entity.cod.death', 'mob.fish.flop': 'entity.cod.flop',
  'mob.guardian.ambient': 'entity.guardian.ambient', 'mob.guardian.hit': 'entity.guardian.hurt', 'mob.guardian.death': 'entity.guardian.death',
  'mob.dolphin.idle': 'entity.dolphin.ambient', 'mob.dolphin.hurt': 'entity.dolphin.hurt', 'mob.dolphin.death': 'entity.dolphin.death',
  'mob.spider.say': 'entity.spider.ambient', 'mob.spider.death': 'entity.spider.death',
  'mob.silverfish.say': 'entity.silverfish.ambient', 'mob.silverfish.hit': 'entity.silverfish.hurt', 'mob.silverfish.kill': 'entity.silverfish.death',
  'mob.frog.ambient': 'entity.frog.ambient', 'mob.frog.hurt': 'entity.frog.hurt', 'mob.frog.death': 'entity.frog.death',
  'mob.sniffer.idle': 'entity.sniffer.idle', 'mob.sniffer.hurt': 'entity.sniffer.hurt', 'mob.sniffer.death': 'entity.sniffer.death',
};
const VANILLA_PREY = new Set(['pig', 'chicken', 'parrot', 'rabbit', 'sheep', 'cow', 'salmon', 'cod']);
const ITEM_RENAMES = { deadbush: 'dead_bush' };

const javaItem = (id) => {
  const [ns, name] = id.includes(':') ? id.split(':') : ['minecraft', id];
  return `${ns}:${ITEM_RENAMES[name] ?? name}`;
};
const javaSound = (s) => {
  if (!s) return null;
  const j = BEDROCK_TO_JAVA_SOUNDS[s];
  if (!j) throw new Error(`No Java sound mapped for Bedrock sound "${s}" (tools/java.mjs)`);
  return `minecraft:${j}`;
};

async function write(path, data) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, typeof data === 'string' || Buffer.isBuffer(data) ? data : JSON.stringify(data, null, 2) + '\n');
}

/** Turn the Bedrock-style hunting/flee families into concrete entity ids. */
function resolveTargets(families, animals) {
  const out = new Set();
  for (const f of families ?? []) {
    let matched = false;
    for (const a of animals) {
      if (a.id === f || (a.family ?? []).includes(f)) {
        out.add(`${NS}:${a.id}`);
        matched = true;
      }
    }
    if (VANILLA_PREY.has(f)) out.add(`minecraft:${f}`);
    else if (!matched && f === 'player') out.add('minecraft:player');
  }
  return [...out];
}

function hostileRule(a) {
  if (!a.hostile) return null;
  let when = 'always';
  for (const f of a.hostile.filters ?? []) {
    if (f.test === 'is_daytime') when = f.value ? 'day' : 'night';
    if (f.test === 'in_water' && f.subject === 'other') when = 'in_water';
  }
  if (when === 'in_water' && (a.hostile.filters ?? []).some((f) => f.test === 'actor_health')) when = 'in_water_hurt';
  return { range: a.hostile.range ?? 8, when };
}

/** Species data read by the Java mod at startup (dk.ulfen.iceage.species.Species). */
function speciesRecord(a, animals, animNames) {
  const s = a.sounds ?? {};
  return {
    id: a.id,
    kind: a.ride ? 'mount' : a.movement === 'swim' || a.movement === 'dolphin' ? 'swimmer' : 'animal',
    width: Math.round((hitbox(a)[0] / (a.scale ?? 1)) * 1000) / 1000,
    height: a.size[1],
    health: a.health,
    speed: a.speed,
    attackDamage: a.attack?.damage ?? 0,
    attackSpeed: a.attack?.speed ?? 1.3,
    leap: !!a.attack?.leap,
    knockbackResistance: a.knockbackResistance ?? 0,
    alertsPack: !!a.alertsPack,
    hunts: resolveTargets(a.hunts, animals),
    huntInterval: a.huntInterval ?? 30,
    huntRange: a.huntRange ?? 16,
    fleesFrom: resolveTargets(a.fleesFrom, animals),
    fleeDistance: a.fleeDistance ?? 12,
    fleeSpeed: a.fleeSpeed ?? 1.6,
    panicSpeed: a.panicSpeed ?? 1.5,
    hostile: hostileRule(a),
    sleeps: a.sleeps ?? 'night',
    movement: a.movement ?? 'walk',
    flySpeed: a.flySpeed ?? 0.15,
    swimSpeed: a.swimSpeed ?? 0.12,
    school: !!a.school,
    hidesInShell: !!a.hidesInShell,
    poisonous: !!a.poisonous,
    quills: !!a.quills,
    poisonImmune: !!a.poisonImmune,
    colourChange: !!a.colourChange,
    shocks: !!a.shocks,
    constricts: !!a.constricts,
    crushesShells: (a.family ?? []).includes('shell_crusher'),
    attackEffect: a.attack?.effect ?? null,
    variantTextures: (a.variants ?? []).map((v) => v.texture ?? null),
    climbs: !!a.climbs,
    fallImmune: !!a.fallImmune || a.movement === 'fly',
    grazes: !!a.grazes,
    wades: !!a.wades,
    breed: (a.breed ?? []).map(javaItem),
    tempt: (a.tempt ?? a.breed ?? []).map(javaItem),
    heal: (a.heal ?? []).map(([item, amount]) => ({ item: javaItem(item), amount })),
    variants: a.variants?.length ?? 0,
    babyScale: a.babyScale ?? 0.5,
    scale: a.scale ?? 1,
    ride: a.ride ? {
      seats: (a.ride.seats ?? [a.ride.seat]).length,
      seatHeight: (a.ride.seats ?? [a.ride.seat])[0][1],
      chest: !!a.ride.chest,
      jump: a.ride.jump !== false,
      jumpStrength: a.ride.jumpStrength ?? 0.5,
      tameItems: (a.ride.tameItems ?? []).map(javaItem),
      temper: a.ride.temper ?? 100,
    } : null,
    sounds: {
      ambient: javaSound(s.ambient), hurt: javaSound(s.hurt), death: javaSound(s.death),
      pitchMin: (s.pitch ?? [1, 1])[0], pitchMax: (s.pitch ?? [1, 1])[1], interval: s.interval ?? 10,
    },
    animations: animNames,
    idle: a.client?.idle ?? ['idle'],
    runSpeed: a.client?.runSpeed ?? 5,
    maneRule: a.client?.visibility?.mane ? 'variant0_adult' : null,
    spawns: (a.spawn ?? []).map((sp) => ({ biomes: sp.biomes, weight: sp.weight ?? 5, min: sp.group?.[0] ?? 1, max: sp.group?.[1] ?? 1, water: !!sp.water })),
    layEgg: a.extraComponents?.['minecraft:spawn_entity'] ? javaItem(a.extraComponents['minecraft:spawn_entity'].entities.spawn_item) : null,
    scavenger: !!a.extraComponents?.['minecraft:behavior.pickup_items'],
    egg: a.egg,
  };
}

function lootTable(a) {
  return {
    type: 'minecraft:entity',
    pools: (a.loot ?? []).map((l) => ({
      rolls: 1,
      ...(l.chance ? { conditions: [{ condition: 'minecraft:random_chance', chance: l.chance }] } : {}),
      entries: [{
        type: 'minecraft:item',
        name: javaItem(l.item),
        functions: [
          { function: 'minecraft:set_count', count: { type: 'minecraft:uniform', min: l.min ?? 0, max: l.max ?? 1 } },
          ...(l.smelts ? [{ function: 'minecraft:furnace_smelt', conditions: [{ condition: 'minecraft:entity_properties', entity: 'this', predicate: { flags: { is_on_fire: true } } }] }] : []),
          { function: 'minecraft:enchanted_count_increase', enchantment: 'minecraft:looting', count: { type: 'minecraft:uniform', min: 0, max: 1 } },
        ],
      }],
    })),
  };
}

/** Bedrock recipe -> Java recipe (one or more files). */
function javaRecipes(recipe) {
  const [type, body] = Object.entries(recipe)[0];
  const name = body.description.identifier.split(':')[1];
  const result = (r) => ({ id: javaItem(r.item), count: r.count ?? 1 });
  if (type === 'minecraft:recipe_shaped') {
    return [[name, {
      type: 'minecraft:crafting_shaped',
      category: 'misc',
      pattern: body.pattern,
      key: Object.fromEntries(Object.entries(body.key).map(([k, v]) => [k, javaItem(v.item)])),
      result: result(body.result),
    }]];
  }
  if (type === 'minecraft:recipe_shapeless') {
    return [[name, {
      type: 'minecraft:crafting_shapeless',
      category: 'misc',
      ingredients: body.ingredients.flatMap((i) => Array.from({ length: i.count ?? 1 }, () => javaItem(i.item))),
      result: result(body.result),
    }]];
  }
  if (type === 'minecraft:recipe_furnace') {
    const base = { ingredient: javaItem(body.input), result: { id: javaItem(body.output) } };
    return [
      [name, { type: 'minecraft:smelting', category: 'food', ...base, experience: 0.35, cookingtime: 200 }],
      [`${name}_from_smoking`, { type: 'minecraft:smoking', category: 'food', ...base, experience: 0.35, cookingtime: 100 }],
      [`${name}_from_campfire`, { type: 'minecraft:campfire_cooking', category: 'food', ...base, experience: 0.35, cookingtime: 600 }],
    ];
  }
  throw new Error(`Unknown recipe type ${type}`);
}

export async function buildJava({ animals, geos, anims, textures, items, blocks, recipes, langs, icon, OUT }) {
  const R = OUT;
  await rm(R, { recursive: true, force: true });
  const A = join(R, 'assets', NS);
  const D = join(R, 'data', NS);

  const species = [];
  for (const a of animals) {
    await write(join(A, 'geckolib', 'models', 'entity', `${a.id}.geo.json`), geos[a.id]);
    await write(join(A, 'geckolib', 'animations', 'entity', `${a.id}.animation.json`), anims[a.id]);
    await write(join(A, 'textures', 'entity', `${a.id}.png`), textures[a.id]);
    for (const v of a.variants ?? []) {
      if (v.texture) await write(join(A, 'textures', 'entity', `${a.id}_${v.texture}.png`), textures[`${a.id}_${v.texture}`]);
    }
    await write(join(A, 'textures', 'item', `${a.id}_spawn_egg.png`), eggIcon(a.egg[0], a.egg[1], a.id.length));
    await itemModel(A, `${a.id}_spawn_egg`, 'minecraft:item/generated');
    await write(join(D, 'loot_table', 'entities', `${a.id}.json`), lootTable(a));
    species.push(speciesRecord(a, animals, Object.keys(a.anims)));
  }
  await write(join(D, 'species.json'), species);
  // Realistic Hunting picks these up from every mod's hunting/targets/ (see src/hunting.mjs).
  await write(join(R, 'hunting', 'targets', `${NS}.json`), animals.map((a) => {
    const { bedrock, icon, entry, ...p } = huntingProfile(a, { name: `entity.${NS}.${a.id}` });
    const s = a.sounds ?? {};
    return {
      ...p,
      sounds: { warn: javaSound(s.ambient), death: javaSound(s.death), pitch: s.pitch ?? [1, 1] },
      loot: p.loot.map((l) => ({ ...l, item: javaItem(l.item) })),
    };
  }));

  for (const item of items) {
    await write(join(A, 'textures', 'item', `${item.id}.png`), item.icon);
    await itemModel(A, item.id, 'minecraft:item/generated');
  }
  // Fur armour: vanilla-layout layers, repaired with mammoth wool, and warm enough to walk
  // through powder snow without freezing (like leather).
  await write(join(A, 'textures', 'entity', 'equipment', 'humanoid', 'fur.png'), furArmorTexture(3));
  await write(join(A, 'textures', 'entity', 'equipment', 'humanoid_leggings', 'fur.png'), furArmorTexture(5));
  await write(join(A, 'equipment', 'fur.json'), { layers: { humanoid: [{ texture: `${NS}:fur` }], humanoid_leggings: [{ texture: `${NS}:fur` }] } });
  const furArmor = items.filter((i) => i.armor).map((i) => `${NS}:${i.id}`);
  await write(join(D, 'tags', 'item', 'repairs_fur_armor.json'), { values: [`${NS}:mammoth_wool`] });
  await write(join(R, 'data', 'minecraft', 'tags', 'item', 'freeze_immune_wearables.json'), { replace: false, values: furArmor });

  for (const block of blocks) {
    await write(join(A, 'textures', 'block', `${block.id}.png`), block.texture);
    await write(join(A, 'models', 'block', `${block.id}.json`), block.kind === 'plant'
      ? { parent: 'minecraft:block/cross', textures: { cross: `${NS}:block/${block.id}` } }
      : { parent: 'minecraft:block/cube_all', textures: { all: `${NS}:block/${block.id}` } });
    await write(join(A, 'blockstates', `${block.id}.json`), { variants: { '': { model: `${NS}:block/${block.id}` } } });
    await write(join(A, 'models', 'item', `${block.id}.json`), block.kind === 'plant'
      ? { parent: 'minecraft:item/generated', textures: { layer0: `${NS}:block/${block.id}` } }
      : { parent: `${NS}:block/${block.id}` });
    await write(join(A, 'items', `${block.id}.json`), { model: { type: 'minecraft:model', model: `${NS}:item/${block.id}` } });
    await write(join(D, 'loot_table', 'blocks', `${block.id}.json`), {
      type: 'minecraft:block',
      pools: [{
        rolls: 1,
        conditions: [{ condition: 'minecraft:survives_explosion' }],
        // Permafrost drops frozen remains or dirt (src/blocks.mjs); with silk touch, itself.
        entries: block.loot
          ? [{ type: 'minecraft:alternatives', children: [
            { type: 'minecraft:item', name: `${NS}:${block.id}`, conditions: [{ condition: 'minecraft:match_tool', predicate: { predicates: { 'minecraft:enchantments': [{ enchantments: 'minecraft:silk_touch', levels: { min: 1 } }] } } }] },
            ...block.loot.map((l, i) => ({ type: 'minecraft:item', name: javaItem(l.item), ...(i < block.loot.length - 1 ? { conditions: [{ condition: 'minecraft:random_chance', chance: l.chance }] } : {}) })),
          ] }]
          : [{ type: 'minecraft:item', name: `${NS}:${block.id}` }],
      }],
    });
  }

  for (const recipe of recipes) for (const [name, body] of javaRecipes(recipe)) await write(join(D, 'recipe', `${name}.json`), body);

  // World generation (added to biomes by dk.ulfen.iceage.world.IceAgeWorldgen). 26.x format:
  // worldgen/feature (no "config" wrapper) + placed_feature with count/offset/filter for patches.
  const W = join(D, 'worldgen');
  const trapezoid = (r) => ({ type: 'minecraft:trapezoid', min: -r, max: r, plateau: 0 });
  const patch = (feature, rarity, count) => ({
    feature: `${NS}:${feature}`,
    placement: [
      { type: 'minecraft:rarity_filter', chance: rarity },
      { type: 'minecraft:in_square' },
      { type: 'minecraft:heightmap', heightmap: 'MOTION_BLOCKING_NO_LEAVES' },
      { type: 'minecraft:biome' },
      { type: 'minecraft:count', count },
      { type: 'minecraft:offset', x: trapezoid(5), y: trapezoid(1), z: trapezoid(5) },
      {
        type: 'minecraft:block_predicate_filter',
        predicate: { type: 'minecraft:all_of', predicates: [
          { type: 'minecraft:matching_block_tag', tag: 'minecraft:air' },
          { type: 'minecraft:matching_blocks', blocks: ['minecraft:grass_block', 'minecraft:dirt', 'minecraft:coarse_dirt', 'minecraft:podzol', 'minecraft:snow_block'], offset: [0, -1, 0] },
        ] },
      },
    ],
  });
  for (const [id, rarity, count] of [['steppe_grass', 1, 10], ['cotton_grass', 2, 6], ['arctic_poppy', 3, 4], ['dwarf_willow', 3, 4]]) {
    await write(join(W, 'feature', `${id}.json`), { type: 'minecraft:simple_block', to_place: { id: `${NS}:${id}` } });
    await write(join(W, 'placed_feature', `${id}.json`), patch(id, rarity, count));
  }
  // Permafrost: blobs in the frozen ground a few blocks under the surface.
  await write(join(W, 'feature', 'permafrost.json'), {
    type: 'minecraft:ore', size: 12, discard_chance_on_air_exposure: 0.5,
    targets: [{ target: { predicate_type: 'minecraft:tag_match', tag: 'minecraft:dirt' }, state: { id: `${NS}:permafrost` } }, { target: { predicate_type: 'minecraft:block_match', block: 'minecraft:gravel' }, state: { id: `${NS}:permafrost` } }],
  });
  await write(join(W, 'placed_feature', 'permafrost.json'), {
    feature: `${NS}:permafrost`,
    placement: [
      { type: 'minecraft:count', count: 4 },
      { type: 'minecraft:in_square' },
      { type: 'minecraft:height_range', height: { type: 'minecraft:uniform', min_inclusive: { absolute: 50 }, max_inclusive: { absolute: 90 } } },
      { type: 'minecraft:biome' },
    ],
  });

  // Language files: Bedrock keys -> Java keys.
  for (const [locale, entries] of Object.entries(langs)) {
    const out = {};
    for (const [k, v] of entries) {
      let m;
      if ((m = k.match(/^entity\.iceage:(.+)\.name$/))) out[`entity.${NS}.${m[1]}`] = v;
      else if ((m = k.match(/^item\.spawn_egg\.entity\.iceage:(.+)\.name$/))) out[`item.${NS}.${m[1]}_spawn_egg`] = v;
      else if ((m = k.match(/^item\.iceage:(.+)\.name$/))) out[`item.${NS}.${m[1]}`] = v;
      else if ((m = k.match(/^tile\.iceage:(.+)\.name$/))) out[`block.${NS}.${m[1]}`] = v;
      else if (k.startsWith('iceage.')) out[k] = v.replace(/%s/g, '%s');
    }
    out[`itemGroup.${NS}`] = locale === 'da_DK' ? 'Istidsdyr' : 'Ice Age Animals';
    await write(join(A, 'lang', `${locale.toLowerCase()}.json`), out);
  }

  await write(join(A, 'icon.png'), icon);
  return species.length;
}

async function itemModel(A, id, parent) {
  await write(join(A, 'models', 'item', `${id}.json`), { parent, textures: { layer0: `${NS}:item/${id}` } });
  await write(join(A, 'items', `${id}.json`), { model: { type: 'minecraft:model', model: `${NS}:item/${id}` } });
}
