export function verifyNewMinMax(
  oldMin: number,
  oldMax: number,
  proposedMin?: number,
  proposedMax?: number,
): boolean {
  const upcomingMin = proposedMin ?? oldMin;
  const upcomingMax = proposedMax ?? oldMax;

  return !(upcomingMin > upcomingMax || upcomingMax < upcomingMin);
}

/**
 * Any value, if it's a number greater than 0 you're golden.
 *
 * Great for nullish values, saving awkwardly long expressions in ifs.
 */
export function positiveInt(test: unknown): test is number {
  return typeof test === "number" && test > 0;
}
