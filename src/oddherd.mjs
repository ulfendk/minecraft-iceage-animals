// The odd herd (scripts/oddherd.js): a woolly mammoth, a Megalonyx and a Smilodon that
// travel south together. While in the herd they follow a waypoint that the script keeps
// moving ahead of the mammoth, and the cat hunts nothing and leaves players alone unless
// it is hurt. The Java edition does the same in dk.ulfen.iceage.OddHerd.
import { NS } from './lib/constants.mjs';

export const ODD_HERD = ['woolly_mammoth', 'megalonyx', 'smilodon'];

/** Adds the odd-herd group, events and property to a member species' spec. */
export function withOddHerd(a) {
  if (!ODD_HERD.includes(a.id)) return a;
  const group = `${NS}:odd_herd`;
  const prop = `${NS}:odd_herd`;
  a.properties = { ...(a.properties ?? {}), [prop]: { type: 'bool', default: false, client_sync: false } };
  a.extraGroups = {
    ...(a.extraGroups ?? {}),
    [group]: {
      // Replaces the species' own target list: the only "target" is the waypoint ahead.
      'minecraft:behavior.nearest_attackable_target': {
        priority: 2, must_see: false, reselect_targets: true, within_radius: 96,
        entity_types: [{ filters: { test: 'is_family', subject: 'other', value: `${NS}_waypoint` }, max_dist: 96 }],
      },
      'minecraft:behavior.move_towards_target': { priority: 2, speed_multiplier: 0.85, within_radius: 96 },
    },
  };
  a.extraEvents = {
    ...(a.extraEvents ?? {}),
    [`${NS}:join_odd_herd`]: { add: { component_groups: [group] }, set_property: { [prop]: true } },
    [`${NS}:leave_odd_herd`]: { remove: { component_groups: [group] }, add: { component_groups: [`${NS}:active`] }, set_property: { [prop]: false } },
  };
  return a;
}

/** The invisible waypoint the odd herd walks towards. */
export const waypoint = {
  behavior: {
    format_version: '1.21.90',
    'minecraft:entity': {
      description: { identifier: `${NS}:waypoint`, is_spawnable: false, is_summonable: true },
      components: {
        'minecraft:type_family': { family: [`${NS}_waypoint`, 'inanimate'] },
        'minecraft:collision_box': { width: 0.1, height: 0.1 },
        'minecraft:physics': { has_gravity: false, has_collision: false },
        'minecraft:pushable': { is_pushable: false, is_pushable_by_piston: false },
        'minecraft:damage_sensor': { triggers: [{ cause: 'all', deals_damage: 'no' }] },
        'minecraft:knockback_resistance': { value: 1 },
        'minecraft:health': { value: 1, max: 1 },
        'minecraft:breathable': { breathes_water: true, breathes_air: true },
      },
    },
  },
  client: {
    format_version: '1.10.0',
    'minecraft:client_entity': {
      description: {
        identifier: `${NS}:waypoint`,
        materials: { default: 'entity_alphatest' },
        textures: { default: `textures/entity/${NS}/waypoint` },
        geometry: { default: `geometry.${NS}.waypoint` },
        render_controllers: [`controller.render.${NS}.waypoint`],
      },
    },
  },
  geometry: { bones: [{ name: 'root', pivot: [0, 0, 0], cubes: [{ origin: [0, 0, 0], size: [0, 0, 0], mat: 'none' }] }] },
  render: {
    format_version: '1.8.0',
    render_controllers: { [`controller.render.${NS}.waypoint`]: { geometry: 'Geometry.default', materials: [{ '*': 'Material.default' }], textures: ['Texture.default'] } },
  },
};
