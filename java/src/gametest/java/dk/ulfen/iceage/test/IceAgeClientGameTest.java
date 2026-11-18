package dk.ulfen.iceage.test;

import java.util.List;

import dk.ulfen.iceage.IceAgeRegistry;
import net.fabricmc.fabric.api.client.gametest.v1.FabricClientGameTest;
import net.fabricmc.fabric.api.client.gametest.v1.context.ClientGameTestContext;
import net.fabricmc.fabric.api.client.gametest.v1.context.TestSingleplayerContext;

/**
 * Starts a real client, lines up the animals in front of the camera and takes screenshots
 * (run with `./gradlew runClientGameTest`; images land in build/run/clientGameTest/screenshots).
 */
public class IceAgeClientGameTest implements FabricClientGameTest {
	@Override
	public void runTest(ClientGameTestContext context) {
		try (TestSingleplayerContext world = context.worldBuilder().create()) {
			world.getServer().runCommand("gamerule doDaylightCycle false");
			world.getServer().runCommand("gamerule doMobSpawning false");
			world.getServer().runCommand("time set noon");
			world.getServer().runCommand("weather clear");
			context.waitTicks(20);

			List<String> only = System.getProperty("iceage.screenshot") == null ? List.of() : List.of(System.getProperty("iceage.screenshot").split(","));
			List<String> ids = IceAgeRegistry.ANIMALS.keySet().stream().filter(id -> only.isEmpty() || only.contains(id)).toList();
			for (int group = 0; group * 3 < ids.size(); group++) {
				world.getServer().runCommand("kill @e[type=!player]");
				world.getServer().runCommand("fill -8 -62 " + (group * 40 - 4) + " 8 -58 " + (group * 40 + 4) + " air replace water");
				int z = group * 40;
				for (int i = 0; i < 3 && group * 3 + i < ids.size(); i++) {
					int x = (i - 1) * 4;
					String id = ids.get(group * 3 + i);
					boolean water = IceAgeRegistry.ANIMALS.get(id).getCategory() == net.minecraft.world.entity.MobCategory.WATER_CREATURE;
					if (water) {
						// A glass tank so the water doesn't spread over the flat world.
						world.getServer().runCommand("fill " + (x - 2) + " -62 " + (z - 2) + " " + (x + 2) + " -59 " + (z + 2) + " glass");
						world.getServer().runCommand("fill " + (x - 1) + " -61 " + (z - 1) + " " + (x + 1) + " -59 " + (z + 1) + " water");
					}
					world.getServer().runCommand("summon iceage:" + id + " " + x + (water ? " -60.5 " : " -60 ") + z + " {NoAI:1b,Rotation:[150f,0f]}");
				}
				world.getServer().runCommand("tp @p 0 -58 " + (z - 6) + " 0 22");
				context.waitTicks(40);
				context.takeScreenshot("iceage_group_" + group);
			}

			// The odd herd, side by side.
			world.getServer().runCommand("kill @e[type=!player]");
			world.getServer().runCommand("summon iceage:woolly_mammoth 0 -60 4 {NoAI:1b,Rotation:[150f,0f]}");
			world.getServer().runCommand("summon iceage:megalonyx -4 -60 2 {NoAI:1b,Rotation:[150f,0f]}");
			world.getServer().runCommand("summon iceage:smilodon 4 -60 2 {NoAI:1b,Rotation:[150f,0f]}");
			world.getServer().runCommand("tp @p 0 -57 -8 0 15");
			context.waitTicks(60);
			context.takeScreenshot("iceage_odd_herd");
		}
	}
}
