/**
 * Dead simple convenience utility for making Discord messages ephemeral.
 */
export function hide(message: string): { content: string; ephemeral: true } {
  return {
    content: message,
    ephemeral: true,
  };
}
