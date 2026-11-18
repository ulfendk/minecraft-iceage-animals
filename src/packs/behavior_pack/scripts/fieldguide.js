// The Field Guide: a book that records every iceage animal you've seen.
import { ItemStack, system, world } from '@minecraft/server';
import { ActionFormData } from '@minecraft/server-ui';
import { ANIMALS } from './data.js';

const SEEN = 'iceage:seen';
const GIVEN = 'iceage:guide_given';

function seenSet(player) {
  try {
    return new Set(JSON.parse(player.getDynamicProperty(SEEN) ?? '[]'));
  } catch {
    return new Set();
  }
}

/** Spotting: every 2 seconds, record animals within 12 blocks of each player. */
function spot() {
  for (const player of world.getPlayers()) {
    const seen = seenSet(player);
    let changed = false;
    let nearby;
    try {
      nearby = player.dimension.getEntities({ families: ['iceage'], location: player.location, maxDistance: 12 });
    } catch {
      continue;
    }
    for (const e of nearby) {
      const id = e.typeId.split(':')[1];
      if (seen.has(id)) continue;
      const animal = ANIMALS.find((a) => a.id === id);
      if (!animal) continue;
      seen.add(id);
      changed = true;
      player.onScreenDisplay.setActionBar({ rawtext: [{ translate: 'iceage.guide.spotted', with: { rawtext: [nameOf(animal)] } }] });
      player.playSound('random.orb', { pitch: 1.4 });
      if (seen.size === ANIMALS.length) player.playSound('random.levelup');
    }
    if (changed) player.setDynamicProperty(SEEN, JSON.stringify([...seen]));
  }
}

// All visible text goes through lang keys so it follows the player's language.
const nameOf = (a) => ({ translate: `entity.iceage:${a.id}.name` });
const list = (keys) => keys.flatMap((key, i) => (i ? [{ text: ', ' }, { translate: key }] : [{ translate: key }]));
const line = (label, keys) => (keys.length ? [{ text: '\n§2' }, { translate: label }, { text: '§r ' }, ...list(keys)] : []);

function openIndex(player) {
  const seen = seenSet(player);
  const form = new ActionFormData()
    .title({ rawtext: [{ translate: 'iceage.guide.title' }, { text: ` (${seen.size}/${ANIMALS.length})` }] })
    .body({ translate: 'iceage.guide.intro' });
  const order = [...ANIMALS].sort((a, b) => a.name.localeCompare(b.name));
  for (const a of order) {
    if (seen.has(a.id)) form.button(nameOf(a), `textures/ui/iceage/${a.id}`);
    else form.button('§8???');
  }
  form.show(player).then((res) => {
    if (res.canceled || res.selection === undefined) return;
    const a = order[res.selection];
    if (seen.has(a.id)) openEntry(player, a);
    else openIndex(player);
  });
}

function openEntry(player, a) {
  const body = [
    { translate: `iceage.guide.entry.${a.id}` },
    { text: '\n' },
    ...line('iceage.guide.lives_in', a.habitats.map((h) => `iceage.habitat.${h}`)),
    ...line('iceage.guide.traits', a.tags.map((t) => `iceage.tag.${t}`)),
    ...line('iceage.guide.breed_with', a.food.map((f) => `iceage.food.${f}`)),
    ...line('iceage.guide.tame_with', a.tame.map((f) => `iceage.food.${f}`)),
  ];
  new ActionFormData()
    .title(nameOf(a))
    .body({ rawtext: body })
    .button({ translate: 'iceage.guide.back' }, `textures/ui/iceage/${a.id}`)
    .show(player)
    .then((res) => {
      if (!res.canceled) openIndex(player);
    });
}

export function setupFieldGuide() {
  system.runInterval(spot, 40);
  world.afterEvents.itemUse.subscribe(({ itemStack, source }) => {
    if (itemStack?.typeId !== 'iceage:field_guide') return;
    source.playSound('item.book.page_turn');
    system.run(() => openIndex(source));
  });
  // Everyone gets a Field Guide the first time they join a world with the add-on.
  world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
    if (!initialSpawn || player.getDynamicProperty(GIVEN)) return;
    player.setDynamicProperty(GIVEN, true);
    system.runTimeout(() => {
      try {
        player.getComponent('minecraft:inventory')?.container?.addItem(new ItemStack('iceage:field_guide', 1));
        player.sendMessage({ translate: 'iceage.guide.welcome' });
      } catch {
        // Player left before the timeout.
      }
    }, 60);
  });
}
