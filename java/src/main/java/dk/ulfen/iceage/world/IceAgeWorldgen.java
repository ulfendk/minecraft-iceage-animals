package dk.ulfen.iceage.world;

import java.util.function.Predicate;

import dk.ulfen.iceage.IceAgeRegistry;
import dk.ulfen.iceage.species.Species;
import dk.ulfen.iceage.species.SpeciesRegistry;
import net.fabricmc.fabric.api.biome.v1.BiomeModifications;
import net.fabricmc.fabric.api.biome.v1.BiomeSelectionContext;
import net.fabricmc.fabric.api.biome.v1.BiomeSelectors;
import net.fabricmc.fabric.api.tag.convention.v2.ConventionalBiomeTags;
import net.minecraft.core.registries.Registries;
import net.minecraft.resources.ResourceKey;
import net.minecraft.tags.BiomeTags;
import net.minecraft.world.entity.MobCategory;
import net.minecraft.world.level.biome.Biomes;
import net.minecraft.world.level.levelgen.GenerationStep;
import net.minecraft.world.level.levelgen.placement.PlacedFeature;

/**
 * Natural spawns, the steppe plants and permafrost. Java has no Mammoth Steppe biome: the
 * animals that live there on Bedrock spawn in the cold vanilla biomes it is carved from.
 */
public final class IceAgeWorldgen {
	private IceAgeWorldgen() {}

	/** Snowy plains, ice spikes and snowy taiga: the Mammoth Steppe's stand-ins. */
	private static Predicate<BiomeSelectionContext> cold() {
		return BiomeSelectors.includeByKey(Biomes.SNOWY_PLAINS, Biomes.ICE_SPIKES, Biomes.SNOWY_TAIGA);
	}

	/** Biome names used in the shared specs -> biome selectors. */
	private static Predicate<BiomeSelectionContext> biomes(String name) {
		return switch (name) {
			case "steppe" -> cold();
			case "savanna" -> BiomeSelectors.tag(BiomeTags.IS_SAVANNA);
			case "jungle" -> BiomeSelectors.tag(BiomeTags.IS_JUNGLE);
			case "desert" -> BiomeSelectors.tag(ConventionalBiomeTags.IS_DESERT);
			case "swamp" -> BiomeSelectors.tag(ConventionalBiomeTags.IS_SWAMP);
			case "river" -> BiomeSelectors.tag(BiomeTags.IS_RIVER);
			case "beach" -> BiomeSelectors.tag(BiomeTags.IS_BEACH);
			case "mesa" -> BiomeSelectors.tag(BiomeTags.IS_BADLANDS);
			case "plains" -> BiomeSelectors.tag(ConventionalBiomeTags.IS_PLAINS);
			case "forest" -> BiomeSelectors.tag(BiomeTags.IS_FOREST);
			case "taiga" -> BiomeSelectors.tag(BiomeTags.IS_TAIGA);
			case "mountain" -> BiomeSelectors.includeByKey(Biomes.MEADOW, Biomes.STONY_PEAKS).or(BiomeSelectors.tag(BiomeTags.IS_HILL));
			case "peaks" -> BiomeSelectors.includeByKey(Biomes.SNOWY_SLOPES, Biomes.GROVE, Biomes.JAGGED_PEAKS, Biomes.FROZEN_PEAKS);
			case "tundra" -> BiomeSelectors.includeByKey(Biomes.SNOWY_PLAINS, Biomes.ICE_SPIKES);
			default -> throw new IllegalArgumentException("Unknown biome group " + name);
		};
	}

	public static void register() {
		for (Species s : SpeciesRegistry.all()) {
			for (Species.Spawn spawn : s.spawns()) {
				Predicate<BiomeSelectionContext> selector = spawn.biomes().stream().map(IceAgeWorldgen::biomes).reduce(Predicate::or).orElse(c -> false);
				MobCategory category = spawn.water() ? MobCategory.WATER_CREATURE : MobCategory.CREATURE;
				BiomeModifications.addSpawn(selector, category, IceAgeRegistry.ANIMALS.get(s.id()), spawn.weight(), spawn.min(), spawn.max());
			}
		}
		Predicate<BiomeSelectionContext> coldAll = cold().or(BiomeSelectors.tag(BiomeTags.IS_TAIGA));
		BiomeModifications.addFeature(cold(), GenerationStep.Decoration.VEGETAL_DECORATION, placed("steppe_grass"));
		BiomeModifications.addFeature(coldAll, GenerationStep.Decoration.VEGETAL_DECORATION, placed("cotton_grass"));
		BiomeModifications.addFeature(cold(), GenerationStep.Decoration.VEGETAL_DECORATION, placed("arctic_poppy"));
		BiomeModifications.addFeature(cold(), GenerationStep.Decoration.VEGETAL_DECORATION, placed("dwarf_willow"));
		BiomeModifications.addFeature(coldAll, GenerationStep.Decoration.UNDERGROUND_ORES, placed("permafrost"));
	}

	private static ResourceKey<PlacedFeature> placed(String name) {
		return ResourceKey.create(Registries.PLACED_FEATURE, IceAgeRegistry.id(name));
	}
}
