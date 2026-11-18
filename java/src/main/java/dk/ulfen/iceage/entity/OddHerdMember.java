package dk.ulfen.iceage.entity;

import net.minecraft.world.entity.Entity;

/** Members of the odd herd carry this entity tag (see dk.ulfen.iceage.OddHerd). */
public final class OddHerdMember {
	public static final String TAG = "iceage.odd_herd";

	private OddHerdMember() {}

	public static boolean is(Entity e) {
		return e.entityTags().contains(TAG);
	}
}
