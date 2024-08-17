import TTLCache from "@isaacs/ttlcache";
import { z } from "zod";

export type RoleMap = {
  roleId: string;
  rankRange: [number, number];
};

const roleMappingsSchema = z
  .array(
    z.object({
      roleId: z.string(), // Role ID
      rankRange: z.tuple([z.number(), z.number()]), // Osu! rank range for this role
    }),
  )
  .catch((error) => {
    console.error(
      "Failed to parse role mappings. Unexpected data format provided",
      error,
    );

    return [];
  });

export class RoleCalculator {
  constructor(roleMappingUrl: string) {
    this.#roleMappingUrl = roleMappingUrl;
  }

  readonly #roleMappingUrl: string;
  readonly #roleMappingCache = new TTLCache<string, RoleMap[]>({
    ttl: 1000 * 60 * 30, // 30 minutes
  });

  async fetchRoleMappings(): Promise<RoleMap[]> {
    if (this.#roleMappingCache.has("roleMappings")) {
      console.info("Using cached role mappings");

      return this.#roleMappingCache.get("roleMappings")!;
    }

    const result = await fetch(this.#roleMappingUrl)
      .then((res) => res.json())
      .catch((error) => {
        console.error("Failed to fetch role mappings", error);

        return [];
      });

    const mappings = roleMappingsSchema.parse(result);

    this.#roleMappingCache.set("roleMappings", mappings);

    return mappings;
  }

  /**
   * Get the role ID for the given osu! rank.
   */
  async getDiscordRoleWithOsuRank(
    osuRank: number,
  ): Promise<string | undefined> {
    const roleMappings = await this.fetchRoleMappings();

    const bestRole = roleMappings.find(
      (role) => osuRank >= role.rankRange[0] && osuRank <= role.rankRange[1],
    );

    if (!bestRole) {
      console.error(`No role found for rank ${osuRank}`);

      return;
    }

    return bestRole.roleId;
  }
}
