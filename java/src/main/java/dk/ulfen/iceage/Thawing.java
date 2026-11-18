package dk.ulfen.iceage;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.fabricmc.fabric.api.event.player.UseBlockCallback;
import net.minecraft.core.BlockPos;
import net.minecraft.core.particles.ParticleTypes;
import net.minecraft.network.chat.Component;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.sounds.SoundEvents;
import net.minecraft.sounds.SoundSource;
import net.minecraft.world.InteractionResult;
import net.minecraft.world.entity.AgeableMob;
import net.minecraft.world.entity.EntitySpawnReason;
import net.minecraft.world.entity.Mob;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.level.block.CampfireBlock;
import net.minecraft.world.level.block.state.BlockState;

/**
 * Frozen remains, dug out of permafrost, thaw over a lit campfire: after about 20 seconds a
 * young Ice Age animal climbs out of the meltwater (the Java side of scripts/thawing.js).
 */
public final class Thawing {
	private static final int THAW_TICKS = 400;
	/** Species and weights: the big ones are rarer. Same table as scripts/thawing.js. */
	private static final Map<String, Integer> REVIVED = Map.ofEntries(
		Map.entry("woolly_mammoth", 2), Map.entry("mastodon", 1), Map.entry("woolly_rhino", 2), Map.entry("elasmotherium", 1),
		Map.entry("steppe_bison", 3), Map.entry("irish_elk", 2), Map.entry("wild_horse", 3), Map.entry("macrauchenia", 2),
		Map.entry("diprotodon", 1), Map.entry("glyptodon", 2), Map.entry("doedicurus", 1), Map.entry("megatherium", 1),
		Map.entry("megalonyx", 2), Map.entry("castoroides", 3), Map.entry("smilodon", 1), Map.entry("homotherium", 1),
		Map.entry("cave_lion", 1), Map.entry("cave_bear", 1), Map.entry("short_faced_bear", 1), Map.entry("dire_wolf", 2));
	private static final List<Thaw> THAWING = new ArrayList<>();

	private record Thaw(ServerLevel level, BlockPos pos, long doneAt) {}

	private Thawing() {}

	static void init() {
		UseBlockCallback.EVENT.register((player, world, hand, hit) -> {
			ItemStack held = player.getItemInHand(hand);
			if (!held.is(IceAgeRegistry.FROZEN_REMAINS)) return InteractionResult.PASS;
			BlockState state = world.getBlockState(hit.getBlockPos());
			if (!(state.getBlock() instanceof CampfireBlock) || !state.getValue(CampfireBlock.LIT)) {
				if (!world.isClientSide()) player.sendOverlayMessage(Component.translatable("iceage.thaw.need_fire"));
				return InteractionResult.FAIL;
			}
			if (world instanceof ServerLevel level) {
				held.consume(1, player);
				THAWING.add(new Thaw(level, hit.getBlockPos().immutable(), level.getGameTime() + THAW_TICKS));
				level.playSound(null, hit.getBlockPos(), SoundEvents.FIRE_EXTINGUISH, SoundSource.BLOCKS, 1.0F, 0.6F);
				player.sendOverlayMessage(Component.translatable("iceage.thaw.start"));
			}
			return InteractionResult.SUCCESS;
		});
	}

	static void tick() {
		for (Iterator<Thaw> it = THAWING.iterator(); it.hasNext(); ) {
			Thaw t = it.next();
			long left = t.doneAt - t.level.getGameTime();
			if (left == THAW_TICKS / 3 || left == 2 * THAW_TICKS / 3) {
				t.level.playSound(null, t.pos, SoundEvents.FIRE_EXTINGUISH, SoundSource.BLOCKS, 0.8F, 0.8F);
				t.level.sendParticles(ParticleTypes.SPLASH, t.pos.getX() + 0.5, t.pos.getY() + 1, t.pos.getZ() + 0.5, 12, 0.3, 0.2, 0.3, 0.1);
			}
			if (left > 0) continue;
			it.remove();
			Mob baby = IceAgeRegistry.ANIMALS.get(pick(t.level)).create(t.level, EntitySpawnReason.BREEDING);
			if (baby == null) continue;
			if (baby instanceof AgeableMob young) young.setAge(-24000);
			baby.snapTo(t.pos.getX() + 2, t.pos.getY(), t.pos.getZ() + 0.5, t.level.getRandom().nextFloat() * 360, 0);
			t.level.addFreshEntity(baby);
			t.level.playSound(null, t.pos, SoundEvents.GENERIC_SPLASH, SoundSource.BLOCKS, 1.0F, 1.0F);
			t.level.getPlayers(p -> p.blockPosition().closerThan(t.pos, 16)).forEach(p -> p.sendOverlayMessage(Component.translatable("iceage.thaw.done")));
		}
	}

	private static String pick(ServerLevel level) {
		int total = REVIVED.values().stream().mapToInt(Integer::intValue).sum();
		int n = level.getRandom().nextInt(total);
		for (Map.Entry<String, Integer> e : REVIVED.entrySet()) if ((n -= e.getValue()) < 0) return e.getKey();
		return "woolly_mammoth";
	}
}
