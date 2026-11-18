package dk.ulfen.iceage.client;

import dk.ulfen.iceage.IceAgeRegistry;
import dk.ulfen.iceage.entity.IceAgeCreature;
import net.fabricmc.api.ClientModInitializer;
import net.minecraft.client.renderer.entity.EntityRenderers;
import net.minecraft.world.entity.EntityType;
import net.minecraft.world.entity.Mob;

public class IceAgeAnimalsClient implements ClientModInitializer {
	@Override
	@SuppressWarnings("unchecked")
	public void onInitializeClient() {
		for (EntityType<? extends Mob> type : IceAgeRegistry.ANIMALS.values()) {
			registerAnimal((EntityType<IceAgeAnimalType>) (EntityType<?>) type);
		}
	}

	private static <T extends Mob & IceAgeCreature> void registerAnimal(EntityType<T> type) {
		EntityRenderers.register(type, context -> new IceAgeRenderer<>(context, type));
	}

	/** Type-only helper so the raw entity types can be passed to the generic registration. */
	private abstract static class IceAgeAnimalType extends Mob implements IceAgeCreature {
		private IceAgeAnimalType() {
			super(null, null);
		}
	}
}
