package dk.ulfen.iceage.entity;

import java.util.List;
import java.util.Set;

import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.sounds.SoundSource;
import net.minecraft.tags.BlockTags;
import net.minecraft.world.damagesource.DamageSource;
import net.minecraft.world.entity.Mob;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.item.ItemStack;

/**
 * Species-specific behaviours that go beyond the standard goals (the Java side of
 * scripts/behaviours.js): trumpets and roars, bears rearing up, ground sloths browsing and
 * Doedicurus swinging its tail club. Server side only.
 */
public final class IceAgeBehaviours {
	private static final Set<String> MEAT = Set.of(
		"iceage:raw_game_meat", "minecraft:beef", "minecraft:porkchop", "minecraft:mutton", "minecraft:chicken",
		"minecraft:rabbit", "minecraft:rotten_flesh", "minecraft:bone");

	private IceAgeBehaviours() {}

	public static boolean isMeat(ItemStack stack) {
		return MEAT.contains(BuiltInRegistries.ITEM.getKey(stack.getItem()).toString());
	}

	private static boolean chance(Mob a, float p) {
		return a.getRandom().nextFloat() < p;
	}

	private static List<Player> playersNear(Mob a, double r) {
		return a.level().getEntitiesOfClass(Player.class, a.getBoundingBox().inflate(r), p -> !p.isSpectator());
	}

	/** Every 2 seconds (staggered per animal). */
	public static <T extends Mob & IceAgeCreature> void tick(T a, ServerLevel level) {
		if (a.isBaby() || a.isCarcass() || (a.tickCount + a.getId()) % 40 != 0) return;
		switch (a.species().id()) {
			case "woolly_mammoth" -> { if (chance(a, 0.015F)) call(a, level, "trumpet", sound("entity.ravager.roar"), 1.35F); }
			case "mastodon" -> { if (chance(a, 0.015F)) call(a, level, "trumpet", sound("entity.ravager.roar"), 1.2F); }
			case "cave_lion" -> warnOrRoar(a, level, 10, 0.5F);
			case "smilodon" -> warnOrRoar(a, level, 7, 0.6F);
			case "homotherium" -> warnOrRoar(a, level, 7, 0.7F);
			case "cave_bear" -> rear(a, level, 6, 0.6F);
			case "short_faced_bear" -> rear(a, level, 9, 0.5F);
			case "dire_wolf" -> { if (level.isDarkOutside() && chance(a, 0.02F)) call(a, level, "howl", sound("entity.wolf.growl"), 0.6F); }
			case "megatherium", "megalonyx" -> browse(a, level);
			default -> {}
		}
	}

	private static void call(Mob a, ServerLevel level, String anim, net.minecraft.sounds.SoundEvent sound, float pitch) {
		((IceAgeCreature) a).playAction(anim);
		level.playSound(null, a, sound, SoundSource.NEUTRAL, 3.0F, pitch);
	}

	private static void warnOrRoar(Mob a, ServerLevel level, int range, float pitch) {
		if (!playersNear(a, range).isEmpty() && chance(a, 0.3F)) call(a, level, "roar", sound("entity.ravager.roar"), pitch);
		else if (chance(a, 0.01F)) call(a, level, "roar", sound("entity.ravager.roar"), pitch + 0.05F);
	}

	private static void rear(Mob a, ServerLevel level, int range, float pitch) {
		if (!playersNear(a, range).isEmpty() && chance(a, 0.3F)) call(a, level, "rear", sound("entity.polar_bear.warning"), pitch);
	}

	/** Ground sloths rear up on their hind legs and tail to pull down branches. */
	private static void browse(Mob a, ServerLevel level) {
		if (!chance(a, 0.04F)) return;
		boolean leaves = false;
		for (int dy = 3; dy <= 6 && !leaves; dy++) leaves = level.getBlockState(a.blockPosition().above(dy).north()).is(BlockTags.LEAVES);
		if (leaves || chance(a, 0.3F)) call(a, level, "browse", sound("block.sweet_berry_bush.pick_berries"), 0.6F);
	}

	/** Doedicurus swings its spiked tail club at whatever hits it. */
	public static void onHurt(Mob a, ServerLevel level, DamageSource source) {
		if (!"doedicurus".equals(((IceAgeCreature) a).species().id())) return;
		if (!(source.getEntity() instanceof net.minecraft.world.entity.LivingEntity attacker) || attacker == a || attacker.distanceTo(a) > 4.5F) return;
		((IceAgeCreature) a).playAction("tail_swing");
		level.playSound(null, a, sound("entity.iron_golem.attack"), SoundSource.NEUTRAL, 1.5F, 0.6F);
		attacker.hurtServer(level, a.damageSources().mobAttack(a), 6.0F);
	}

	private static net.minecraft.sounds.SoundEvent sound(String id) {
		return BuiltInRegistries.SOUND_EVENT.getValue(net.minecraft.resources.Identifier.withDefaultNamespace(id));
	}
}
