package dk.ulfen.iceage;

import java.util.List;

import dk.ulfen.iceage.entity.IceAgeCreature;
import dk.ulfen.iceage.entity.OddHerdMember;
import net.minecraft.core.BlockPos;
import net.minecraft.network.chat.Component;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.server.level.ServerPlayer;
import net.minecraft.world.entity.EntitySpawnReason;
import net.minecraft.world.entity.Mob;
import net.minecraft.world.level.levelgen.Heightmap;

/**
 * The odd herd (the Java side of scripts/oddherd.js): now and then a naturally spawned
 * woolly mammoth is joined by a Megalonyx and a Smilodon. They keep the peace among
 * themselves (the cat hunts nothing and leaves players alone unless it is hurt, see
 * IceAgeGoals) and plod south together, the other two keeping close to the mammoth.
 */
public final class OddHerd {
	private static final float CHANCE = 1F / 40F;
	private static final int LEG = 32;

	private OddHerd() {}

	/** Called for every woolly mammoth that spawns naturally. */
	static void onNaturalSpawn(Mob mammoth, ServerLevel level) {
		if (level.getRandom().nextFloat() > CHANCE) return;
		boolean nearby = !level.getEntitiesOfClass(Mob.class, mammoth.getBoundingBox().inflate(256), OddHerdMember::is).isEmpty();
		if (!nearby) form(mammoth, level, true);
	}

	/** Spawns the sloth and the cat next to the mammoth and sends the three south. */
	public static List<Mob> form(Mob mammoth, ServerLevel level, boolean announce) {
		mammoth.addTag(OddHerdMember.TAG);
		java.util.ArrayList<Mob> herd = new java.util.ArrayList<>(List.of(mammoth));
		int side = -1;
		for (String id : List.of("megalonyx", "smilodon")) {
			Mob m = IceAgeRegistry.ANIMALS.get(id).create(level, EntitySpawnReason.EVENT);
			if (m == null) continue;
			m.snapTo(mammoth.getX() + side * 2.5, mammoth.getY() + 0.5, mammoth.getZ() - 2, mammoth.getYRot(), 0);
			m.addTag(OddHerdMember.TAG);
			level.addFreshEntity(m);
			herd.add(m);
			side = -side;
		}
		if (announce) {
			for (ServerPlayer p : level.getPlayers(p -> p.distanceTo(mammoth) < 48)) {
				p.sendOverlayMessage(Component.translatable("iceage.odd_herd.spotted"));
			}
		}
		return herd;
	}

	/** Every 3 seconds: the mammoth heads south, the others keep up with it. */
	static void tick(ServerLevel level) {
		if (level.getGameTime() % 60 != 0) return;
		for (ServerPlayer player : level.players()) {
			List<Mob> members = level.getEntitiesOfClass(Mob.class, player.getBoundingBox().inflate(128), OddHerdMember::is);
			for (Mob m : members) {
				if (!(m instanceof IceAgeCreature c) || c.isCarcass() || c.isResting()) continue;
				// They only fight back: drop any target that isn't the one that hurt them.
				if (m.getTarget() != null && m.getTarget() != m.getLastHurtByMob()) m.setTarget(null);
				if (m.getTarget() != null) continue;
				if (c.species().id().equals("woolly_mammoth")) {
					if (m.getNavigation().isDone()) {
						BlockPos goal = level.getHeightmapPos(Heightmap.Types.MOTION_BLOCKING_NO_LEAVES, BlockPos.containing(m.getX(), m.getY(), m.getZ() + LEG));
						m.getNavigation().moveTo(goal.getX() + 0.5, goal.getY(), goal.getZ() + 0.5, 0.85);
					}
				} else {
					Mob leader = members.stream().filter(o -> o instanceof IceAgeCreature oc && oc.species().id().equals("woolly_mammoth")).findFirst().orElse(null);
					if (leader == null) {
						m.removeTag(OddHerdMember.TAG);
					} else if (m.distanceTo(leader) > 5) {
						m.getNavigation().moveTo(leader.getX() + (m.getX() < leader.getX() ? -2.5 : 2.5), leader.getY(), leader.getZ() - 2, 1.0);
					}
				}
			}
		}
	}
}
