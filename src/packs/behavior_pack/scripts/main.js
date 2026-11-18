import { system, world } from '@minecraft/server';
import { setupBehaviours } from './behaviours.js';
import { setupFieldGuide } from './fieldguide.js';
import { setupHunting } from './hunting.js';
import { setupOddHerd } from './oddherd.js';
import { setupThawing } from './thawing.js';
import { selfTest } from './selftest.js';

world.afterEvents.worldLoad.subscribe(() => {
  setupBehaviours();
  setupFieldGuide();
  setupOddHerd();
  setupThawing();
  setupHunting();
  console.log('[Ice Age Animals] loaded');
});

system.afterEvents.scriptEventReceive.subscribe((event) => {
  if (event.id === 'iceage:selftest') selfTest(event.message);
});
