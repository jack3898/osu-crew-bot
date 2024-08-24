export function addSecondsToDate(date: Date, seconds: number): Date {
  const secondsAsMillis = seconds * 1000;
  const dateAsMillis = date.getTime();

  return new Date(secondsAsMillis + dateAsMillis);
}
