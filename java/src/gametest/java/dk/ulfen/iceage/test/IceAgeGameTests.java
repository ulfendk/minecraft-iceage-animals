package dk.ulfen.iceage.test;

import java.util.ArrayList;
import java.util.List;

import dk.ulfen.iceage.IceAgeRegistry;
import dk.ulfen.iceage.OddHerd;
import dk.ulfen.iceage.entity.IceAgeAnimal;
import dk.ulfen.iceage.entity.IceAgeMount;
import dk.ulfen.iceage.entity.OddHerdMember;
import net.fabricmc.fabric.api.gametest.v1.GameTest;
import net.minecraft.core.BlockPos;
import net.minecraft.gametest.framework.GameTestHelper;
import net.minecraft.world.effect.MobEffectInstance;
import net.minecraft.world.effect.MobEffects;
import net.minecraft.world.entity.EntityType;
import net.minecraft.world.entity.Mob;
import net.minecraft.world.phys.Vec3;

/** Server-side checks run by `./gradlew runGameTest` (and in CI). */
public class IceAgeGameTests {
	private static Mob spawn(GameTestHelper helper, String id, BlockPos pos) {
		return helper.spawn(IceAgeRegistry.ANIMALS.get(id), pos);
	}

	/** Every species can be spawned and is still alive two seconds later. */
	@GameTest(maxTicks = 100)
	public void everyAnimalSpawns(GameTestHelper helper) {
		List<Mob> mobs = new ArrayList<>();
		int i = 0;
		for (EntityType<? extends Mob> type : IceAgeRegistry.ANIMALS.values()) {
			Mob mob = helper.spawn(type, new BlockPos(1 + (i % 5) * 2, 1, 1 + (i / 5) * 2));
			mob.addEffect(new MobEffectInstance(MobEffects.RESISTANCE, 200, 4)); // predators may attack their neighbours
			mobs.add(mob);
			i++;
		}
		helper.runAfterDelay(40, () -> {
			for (Mob m : mobs) {
				if (!m.isAlive()) helper.fail("Died or vanished: " + m.getType().getDescriptionId());
			}
			helper.succeed();
		});
	}

	/** A wild horse runs away from a dire wolf standing next to it. */
	@GameTest(maxTicks = 200)
	public void horseFleesDireWolf(GameTestHelper helper) {
		Mob wolf = spawn(helper, "dire_wolf", new BlockPos(3, 1, 3));
		wolf.setNoAi(true);
		Mob horse = spawn(helper, "wild_horse", new BlockPos(4, 1, 3));
		Vec3 start = horse.position();
		helper.succeedWhen(() -> {
			if (horse.position().distanceTo(start) < 2.0) helper.fail("Horse has not fled");
		});
	}

	/** An animal that goes for something actually hurts it: the charge lands and deals its damage. */
	@GameTest(maxTicks = 200)
	public void angryAnimalHurtsTarget(GameTestHelper helper) {
		Mob rhino = spawn(helper, "woolly_rhino", new BlockPos(2, 1, 2));
		Mob pig = helper.spawn(net.minecraft.world.entity.EntityTypes.PIG, new BlockPos(6, 1, 6));
		pig.setNoAi(true);
		float health = pig.getHealth();
		rhino.setTarget(pig);
		helper.succeedWhen(() -> {
			if (pig.getHealth() >= health) helper.fail("Woolly rhino did not hurt the pig");
		});
	}

	/** Mounts can be tamed. */
	@GameTest(maxTicks = 20)
	public void mammothCanBeTamed(GameTestHelper helper) {
		IceAgeMount mammoth = (IceAgeMount) spawn(helper, "woolly_mammoth", new BlockPos(3, 1, 3));
		mammoth.setTamed(true);
		if (!mammoth.isTamed()) helper.fail("Mammoth could not be tamed");
		helper.succeed();
	}

	/** A glyptodon pulls in its head when hurt and then takes much less damage. */
	@GameTest(maxTicks = 20)
	public void glyptodonHides(GameTestHelper helper) {
		IceAgeAnimal g = (IceAgeAnimal) spawn(helper, "glyptodon", new BlockPos(3, 1, 3));
		g.hurtServer(helper.getLevel(), helper.getLevel().damageSources().generic(), 1.0F);
		if (!g.isHiding()) helper.fail("Glyptodon did not hide");
		float before = g.getHealth();
		g.setInvulnerableTime(0);
		g.hurtServer(helper.getLevel(), helper.getLevel().damageSources().generic(), 10.0F);
		if (before - g.getHealth() > 2.5F) helper.fail("Hiding glyptodon took full damage: " + (before - g.getHealth()));
		helper.succeed();
	}

	/** Doedicurus swings its tail club at what hits it. */
	@GameTest(maxTicks = 20)
	public void doedicurusClubs(GameTestHelper helper) {
		Mob d = spawn(helper, "doedicurus", new BlockPos(3, 1, 3));
		Mob pig = helper.spawn(net.minecraft.world.entity.EntityTypes.PIG, new BlockPos(3, 1, 6));
		pig.setNoAi(true);
		float before = pig.getHealth();
		d.hurtServer(helper.getLevel(), helper.getLevel().damageSources().mobAttack(pig), 1.0F);
		if (pig.getHealth() >= before) helper.fail("Doedicurus did not club its attacker");
		helper.succeed();
	}

	/** The animals are their real size: a mammoth's hitbox is over 3 m tall, a giant beaver's under 1 m. */
	@GameTest(maxTicks = 20)
	public void realSizes(GameTestHelper helper) {
		Mob mammoth = spawn(helper, "woolly_mammoth", new BlockPos(3, 1, 3));
		Mob beaver = spawn(helper, "castoroides", new BlockPos(8, 1, 8));
		if (Math.abs(mammoth.getScale() - 2.0F) > 0.01F) helper.fail("Mammoth scale is " + mammoth.getScale());
		if (mammoth.getBbHeight() < 3.0F) helper.fail("Mammoth is only " + mammoth.getBbHeight() + " blocks tall");
		if (beaver.getBbHeight() > 1.0F) helper.fail("Giant beaver is " + beaver.getBbHeight() + " blocks tall");
		helper.succeed();
	}

	/** The odd herd forms: a mammoth gets a sloth and a sabre-toothed cat for company, and the cat leaves players alone. */
	@GameTest(maxTicks = 20)
	public void oddHerdForms(GameTestHelper helper) {
		Mob mammoth = spawn(helper, "woolly_mammoth", new BlockPos(5, 1, 5));
		List<Mob> herd = OddHerd.form(mammoth, helper.getLevel(), false);
		if (herd.size() != 3) helper.fail("Odd herd has " + herd.size() + " members");
		for (Mob m : herd) if (!OddHerdMember.is(m)) helper.fail("Not tagged as odd herd: " + m.getType().getDescriptionId());
		helper.succeed();
	}
}
