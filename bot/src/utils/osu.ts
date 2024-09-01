export function convertMode(mode: string): string {
  switch (mode) {
    case "osu":
      return "osu!standard";
    case "taiko":
      return "osu!taiko";
    case "fruits":
      return "osu!catch";
    case "mania":
      return "osu!mania";
    default:
      return mode;
  }
}

export function accuracyComment(accuracy: number): string {
  if (accuracy > 99) {
    return "insane";
  } else if (accuracy > 98) {
    return "great";
  } else if (accuracy > 97) {
    return "decent";
  } else if (accuracy > 95) {
    return "OK";
  } else if (accuracy > 90) {
    return "meh";
  }

  return "needs improvement";
}

export function playCountComment(playCount: number): string {
  if (playCount > 500_000) {
    return "major neek";
  } else if (playCount > 250_000) {
    return "neek";
  } else if (playCount > 100_000) {
    return "minor neek";
  } else if (playCount > 50_000) {
    return "saddo";
  } else if (playCount > 25_000) {
    return "japenese";
  } else if (playCount > 10_000) {
    return "cosplayer";
  } else if (playCount > 5_000) {
    return "casual";
  }

  return "normie";
}
