package dk.ulfen.iceage;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.function.Function;

import dk.ulfen.iceage.entity.IceAgeAnimal;
import dk.ulfen.iceage.entity.IceAgeMount;
import dk.ulfen.iceage.entity.IceAgeSwimmer;
import dk.ulfen.iceage.item.FieldGuideItem;
import dk.ulfen.iceage.species.Species;
import dk.ulfen.iceage.species.SpeciesRegistry;
import net.fabricmc.fabric.api.creativetab.v1.FabricCreativeModeTab;
import net.fabricmc.fabric.api.object.builder.v1.entity.FabricDefaultAttributeRegistry;
import net.minecraft.core.Registry;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.core.registries.Registries;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.Identifier;
import net.minecraft.resources.ResourceKey;
import net.minecraft.sounds.SoundEvents;
import net.minecraft.world.entity.EntityType;
import net.minecraft.world.entity.Mob;
import net.minecraft.world.entity.MobCategory;
import net.minecraft.world.entity.SpawnPlacementTypes;
import net.minecraft.world.entity.SpawnPlacements;
import net.minecraft.world.food.FoodProperties;
import net.minecraft.world.item.BlockItem;
import net.minecraft.world.item.CreativeModeTab;
import net.minecraft.world.item.Item;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.equipment.ArmorMaterial;
import net.minecraft.world.item.equipment.ArmorType;
import net.minecraft.world.item.equipment.EquipmentAsset;
import net.minecraft.world.item.equipment.EquipmentAssets;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.SoundType;
import net.minecraft.world.level.block.state.BlockBehaviour;
import net.minecraft.world.level.levelgen.Heightmap;
import net.minecraft.world.level.material.MapColor;

/** Everything the mod adds to the game registries. */
public final class IceAgeRegistry {
	public static final Map<String, EntityType<? extends Mob>> ANIMALS = new LinkedHashMap<>();
	public static final Map<String, Item> SPAWN_EGGS = new LinkedHashMap<>();

	public static Block MAMMOTH_WOOL_BLOCK;
	public static Block PERMAFROST;
	public static Block STEPPE_GRASS;
	public static Block COTTON_GRASS;
	public static Block ARCTIC_POPPY;
	public static Block DWARF_WILLOW;

	public static Item FIELD_GUIDE;
	public static Item RAW_GAME_MEAT;
	public static Item COOKED_GAME_MEAT;
	public static Item MAMMOTH_WOOL;
	public static Item IVORY;
	public static Item FROZEN_REMAINS;
	public static Item FUR_HOOD;
	public static Item FUR_COAT;
	public static Item FUR_LEGGINGS;
	public static Item FUR_BOOTS;

	private IceAgeRegistry() {}

	public static Identifier id(String path) {
		return Identifier.fromNamespaceAndPath(IceAgeAnimals.MOD_ID, path);
	}

	static void register() {
		registerEntities();
		registerBlocks();
		registerItems();
		registerCreativeTab();
	}

	// ---------------------------------------------------------------- entities

	private static <T extends net.minecraft.world.entity.Entity> EntityType<T> entity(String name, EntityType.Builder<T> builder) {
		ResourceKey<EntityType<?>> key = ResourceKey.create(Registries.ENTITY_TYPE, id(name));
		return Registry.register(BuiltInRegistries.ENTITY_TYPE, key, builder.build(key));
	}

	private static void registerEntities() {
		for (Species s : SpeciesRegistry.all()) {
			EntityType<? extends Mob> type;
			if (s.isSwimmer()) {
				EntityType<IceAgeSwimmer> t = entity(s.id(), EntityType.Builder.<IceAgeSwimmer>of(IceAgeSwimmer::new, MobCategory.WATER_CREATURE).sized(s.width(), s.height()).clientTrackingRange(8));
				FabricDefaultAttributeRegistry.register(t, IceAgeSwimmer.createAttributes(s));
				SpawnPlacements.register(t, SpawnPlacementTypes.IN_WATER, Heightmap.Types.MOTION_BLOCKING_NO_LEAVES, net.minecraft.world.entity.animal.fish.WaterAnimal::checkSurfaceWaterAnimalSpawnRules);
				type = t;
			} else if (s.isMount()) {
				EntityType<IceAgeMount> t = entity(s.id(), EntityType.Builder.<IceAgeMount>of(IceAgeMount::new, MobCategory.CREATURE).sized(s.width(), s.height()).clientTrackingRange(10));
				FabricDefaultAttributeRegistry.register(t, IceAgeMount.createAttributes(s));
				SpawnPlacements.register(t, SpawnPlacementTypes.ON_GROUND, Heightmap.Types.MOTION_BLOCKING_NO_LEAVES, IceAgeAnimal::checkSpawn);
				type = t;
			} else {
				EntityType<IceAgeAnimal> t = entity(s.id(), EntityType.Builder.<IceAgeAnimal>of(IceAgeAnimal::new, MobCategory.CREATURE).sized(s.width(), s.height()).clientTrackingRange(10));
				FabricDefaultAttributeRegistry.register(t, IceAgeAnimal.createAttributes(s));
				SpawnPlacements.register(t, s.flies() ? SpawnPlacementTypes.NO_RESTRICTIONS : SpawnPlacementTypes.ON_GROUND,
					Heightmap.Types.MOTION_BLOCKING_NO_LEAVES, IceAgeAnimal::checkSpawn);
				type = t;
			}
			ANIMALS.put(s.id(), type);
		}
	}

	// ---------------------------------------------------------------- blocks

	private static Block block(String name, Function<BlockBehaviour.Properties, Block> factory, BlockBehaviour.Properties props) {
		ResourceKey<Block> key = ResourceKey.create(Registries.BLOCK, id(name));
		Block block = Registry.register(BuiltInRegistries.BLOCK, key, factory.apply(props.setId(key)));
		item(name, p -> new BlockItem(block, p), new Item.Properties().useBlockDescriptionPrefix());
		return block;
	}

	private static Block plant(String name, MapColor colour) {
		return block(name, Block::new, BlockBehaviour.Properties.of()
			.mapColor(colour).noCollision().instabreak().sound(SoundType.GRASS).ignitedByLava().replaceable()
			.offsetType(BlockBehaviour.OffsetType.XZ));
	}

	private static void registerBlocks() {
		MAMMOTH_WOOL_BLOCK = block("mammoth_wool_block", Block::new, BlockBehaviour.Properties.of()
			.mapColor(MapColor.COLOR_BROWN).strength(0.8F).sound(SoundType.WOOL).ignitedByLava());
		PERMAFROST = block("permafrost", Block::new, BlockBehaviour.Properties.of()
			.mapColor(MapColor.DIRT).strength(1.0F).sound(SoundType.GRAVEL));
		STEPPE_GRASS = plant("steppe_grass", MapColor.SAND);
		COTTON_GRASS = plant("cotton_grass", MapColor.SNOW);
		ARCTIC_POPPY = plant("arctic_poppy", MapColor.COLOR_YELLOW);
		DWARF_WILLOW = plant("dwarf_willow", MapColor.PLANT);
	}

	// ---------------------------------------------------------------- items

	private static <T extends Item> T item(String name, Function<Item.Properties, T> factory, Item.Properties props) {
		ResourceKey<Item> key = ResourceKey.create(Registries.ITEM, id(name));
		return Registry.register(BuiltInRegistries.ITEM, key, factory.apply(props.setId(key)));
	}

	private static Item food(String name, int nutrition, float saturation) {
		return item(name, Item::new, new Item.Properties().food(new FoodProperties.Builder().nutrition(nutrition).saturationModifier(saturation).build()));
	}

	private static final ResourceKey<EquipmentAsset> FUR_ASSET = ResourceKey.create(EquipmentAssets.ROOT_ID, id("fur"));
	/** Like leather, but a little tougher; repaired with mammoth wool (tag iceage:repairs_fur_armor). */
	private static final ArmorMaterial FUR_MATERIAL = new ArmorMaterial(8,
		Map.of(ArmorType.HELMET, 1, ArmorType.CHESTPLATE, 3, ArmorType.LEGGINGS, 2, ArmorType.BOOTS, 1), 15,
		SoundEvents.ARMOR_EQUIP_LEATHER, 0.0F, 0.0F,
		net.minecraft.tags.TagKey.create(Registries.ITEM, id("repairs_fur_armor")), FUR_ASSET);

	private static void registerItems() {
		for (Species s : SpeciesRegistry.all()) {
			EntityType<? extends Mob> type = ANIMALS.get(s.id());
			SPAWN_EGGS.put(s.id(), item(s.id() + "_spawn_egg", net.minecraft.world.item.SpawnEggItem::new, new Item.Properties().spawnEgg(type)));
		}
		FIELD_GUIDE = item("field_guide", FieldGuideItem::new, new Item.Properties().stacksTo(1));
		RAW_GAME_MEAT = food("raw_game_meat", 3, 0.3F);
		COOKED_GAME_MEAT = food("cooked_game_meat", 8, 0.8F);
		MAMMOTH_WOOL = item("mammoth_wool", Item::new, new Item.Properties());
		IVORY = item("ivory", Item::new, new Item.Properties());
		FROZEN_REMAINS = item("frozen_remains", Item::new, new Item.Properties().stacksTo(16));
		FUR_HOOD = item("fur_hood", Item::new, new Item.Properties().humanoidArmor(FUR_MATERIAL, ArmorType.HELMET));
		FUR_COAT = item("fur_coat", Item::new, new Item.Properties().humanoidArmor(FUR_MATERIAL, ArmorType.CHESTPLATE));
		FUR_LEGGINGS = item("fur_leggings", Item::new, new Item.Properties().humanoidArmor(FUR_MATERIAL, ArmorType.LEGGINGS));
		FUR_BOOTS = item("fur_boots", Item::new, new Item.Properties().humanoidArmor(FUR_MATERIAL, ArmorType.BOOTS));
	}

	private static void registerCreativeTab() {
		CreativeModeTab tab = FabricCreativeModeTab.builder()
			.title(Component.translatable("itemGroup.iceage"))
			.icon(() -> new ItemStack(SPAWN_EGGS.get("woolly_mammoth")))
			.displayItems((params, out) -> {
				SPAWN_EGGS.values().forEach(out::accept);
				for (Item i : new Item[] {FIELD_GUIDE, FUR_HOOD, FUR_COAT, FUR_LEGGINGS, FUR_BOOTS, MAMMOTH_WOOL, IVORY, FROZEN_REMAINS,
					RAW_GAME_MEAT, COOKED_GAME_MEAT}) out.accept(i);
				for (Block b : new Block[] {MAMMOTH_WOOL_BLOCK, PERMAFROST, STEPPE_GRASS, COTTON_GRASS, ARCTIC_POPPY, DWARF_WILLOW}) out.accept(b);
			})
			.build();
		Registry.register(BuiltInRegistries.CREATIVE_MODE_TAB, id("iceage"), tab);
	}
}
