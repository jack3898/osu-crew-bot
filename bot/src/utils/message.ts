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
