package dk.ulfen.iceage;

import dk.ulfen.iceage.species.SpeciesRegistry;
import dk.ulfen.iceage.world.IceAgeWorldgen;
import net.fabricmc.api.ModInitializer;
import net.fabricmc.fabric.api.event.lifecycle.v1.ServerEntityEvents;
import net.fabricmc.fabric.api.event.lifecycle.v1.ServerTickEvents;
import net.fabricmc.fabric.api.networking.v1.ServerPlayConnectionEvents;
import net.minecraft.world.entity.Mob;

public class IceAgeAnimals implements ModInitializer {
	public static final String MOD_ID = "iceage";

	@Override
	public void onInitialize() {
		SpeciesRegistry.load();
		IceAgeRegistry.register();
		IceAgeWorldgen.register();
		FieldGuide.init();
		Thawing.init();

		ServerTickEvents.END_SERVER_TICK.register(server -> {
			Thawing.tick();
			FieldGuide.tick(server);
		});
		ServerTickEvents.END_LEVEL_TICK.register(OddHerd::tick);
		ServerPlayConnectionEvents.JOIN.register((handler, sender, server) -> FieldGuide.onJoin(handler.getPlayer()));
		// Freshly generated or naturally spawned mammoths may form an odd herd.
		ServerEntityEvents.ENTITY_LOAD.register((entity, level) -> {
			if (entity instanceof Mob mob && mob.getType() == IceAgeRegistry.ANIMALS.get("woolly_mammoth")
				&& entity.tickCount == 0 && !entity.entityTags().contains("iceage.checked")) {
				entity.addTag("iceage.checked");
				OddHerd.onNaturalSpawn(mob, level);
			}
		});
	}
}
