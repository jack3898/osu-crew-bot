import { expect, it } from "vitest";
import { addSecondsToDate } from "./add-seconds-to-date.js";

it("should add seconds to a date", () => {
  const result = addSecondsToDate(new Date(0), 1);

  expect(result.getTime()).toBe(1000);
});

it("should add seconds to bigger date", () => {
  const result = addSecondsToDate(new Date("2024-08-24T13:16:29.173Z"), 60);

  expect(result.toISOString()).toBe("2024-08-24T13:17:29.173Z");
});
