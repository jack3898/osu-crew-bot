import { format } from "date-fns/format";
import { EmbedBuilder } from "discord.js";
import type { UserExtended } from "osu-web.js";
import { accuracyComment, convertMode, playCountComment } from "./osu.js";

/**
 * Dead simple convenience utility for making Discord messages ephemeral.
 */
export function hide(message: string): { content: string; ephemeral: true } {
  return {
    content: message,
    ephemeral: true,
  };
}

/**
 * Convenience function to make role ID's pretty printable in a Discord message.
 */
export function prettyRole(roleId: string): `<@&${string}>` {
  return `<@&${roleId}>`;
}

export function createUserEmbed(user: UserExtended): EmbedBuilder {
  const {
    username,
    avatar_url,
    rank_history,
    rank_highest,
    join_date,
    playmode,
    id,
    statistics: {
      pp,
      ranked_score,
      hit_accuracy,
      play_count,
      total_score,
      country_rank,
      maximum_combo,
    },
    cover: { url: cover_url },
  } = user;

  const globalRank = rank_history.data.at(-1);

  const joinDateFormatted = format(new Date(join_date), "LLLL yyyy");
  const playmodeFormatted = convertMode(playmode);
  const globalRankFormatted = globalRank
    ? globalRank.toLocaleString()
    : "Unknown";
  const peakRankFormatted = rank_highest?.rank?.toLocaleString() ?? "Unknown";
  const peakRankUpdated = rank_highest?.updated_at
    ? format(new Date(rank_highest.updated_at), "do MMMM yyyy")
    : "Unknown";
  const countryRankFormatted = country_rank?.toLocaleString() ?? "Unknown";
  const hitAccuracyWithComment = `\`${hit_accuracy.toPrecision(4)}%\` (${accuracyComment(hit_accuracy)})`;
  const playCountWithComment = `\`${play_count.toLocaleString()}\` (${playCountComment(play_count)})`;

  const embed = new EmbedBuilder()
    .setTitle(`About ${username})`)
    .setThumbnail(avatar_url)
    .setDescription(
      `[${username}](https://osu.ppy.sh/users/${id}) joined Osu! in ${joinDateFormatted} and prefers **${playmodeFormatted}**.`,
    )
    .addFields([
      {
        name: "**Global rank** 🌍",
        value: globalRankFormatted,
        inline: true,
      },
      {
        name: "**Peak rank** 📈",
        value: `${peakRankFormatted}\nSince ${peakRankUpdated}`,
        inline: true,
      },
      {
        name: "**pp** 🍆",
        value: Math.round(pp).toLocaleString(),
        inline: true,
      },
      {
        name: "More stats",
        value: [
          `- Country rank :flag_${user.country_code.toLowerCase()}:: \`${countryRankFormatted}\``,
          `- Max combo: \`${maximum_combo.toLocaleString()}\``,
          `- Ranked score: \`${ranked_score.toLocaleString()}\``,
          `- Hit accuracy: ${hitAccuracyWithComment}`,
          `- Play count: ${playCountWithComment}`,
          `- Total score: \`${total_score.toLocaleString()}\``,
        ].join("\n"),
      },
    ]);

  if (cover_url) {
    embed.setImage(cover_url);
  }

  return embed;
}
