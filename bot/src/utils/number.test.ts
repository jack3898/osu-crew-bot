import { describe, expect, it } from "vitest";
import { positiveInt, verifyNewMinMax } from "./number.js";

describe("verifyNewMinMax", () => {
  it("should expect min to be smaller than old max (error, min is bigger)", () => {
    const result = verifyNewMinMax(5, 10, 11, undefined);

    expect(result).toBe(false);
  });

  it("should expect min to be smaller than old max (ok min is smaller)", () => {
    const result = verifyNewMinMax(5, 12, 11, undefined);

    expect(result).toBe(true);
  });

  it("should allow min to be equal to old max", () => {
    const result = verifyNewMinMax(5, 12, 12, undefined);

    expect(result).toBe(true);
  });

  it("should expect max to be larger than old min (error, max is smaller)", () => {
    const result = verifyNewMinMax(5, 10, undefined, 4);

    expect(result).toBe(false);
  });

  it("should expect min to be smaller than old max (ok min is smaller)", () => {
    const result = verifyNewMinMax(5, 12, undefined, 6);

    expect(result).toBe(true);
  });

  it("should allow max to be equal to old min", () => {
    const result = verifyNewMinMax(5, 12, undefined, 5);

    expect(result).toBe(true);
  });

  it("should allow a new correct range", () => {
    const result = verifyNewMinMax(5, 12, 4, 5);

    expect(result).toBe(true);
  });

  it("should allow a new correct range when both are equal", () => {
    const result = verifyNewMinMax(5, 12, 5, 5);

    expect(result).toBe(true);
  });

  it("should not allow new min to be bigger than new max", () => {
    const result = verifyNewMinMax(5, 12, 6, 5);

    expect(result).toBe(false);
  });
});

describe("positiveInt", () => {
  it.each([1, 2, 3, Number.MAX_SAFE_INTEGER, 1.1])("is positive %", (num) => {
    expect(positiveInt(num)).toBe(true);
  });

  it.each([null, undefined, {}, [], -1, 0, -1.1])("is positive %", (num) => {
    expect(positiveInt(num)).toBe(false);
  });
});
