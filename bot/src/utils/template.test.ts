import { expect, it } from "vitest";
import { template } from "./template.js";

it("should process template with numbers (obj)", () => {
  const exec = template`Hello, ${0}`;

  const result = exec({ 0: "world!" });

  expect(result).toBe("Hello, world!");
});

it("should process template with numbers (arr)", () => {
  const exec = template`Hello, ${0}`;

  const result = exec(["world!"]);

  expect(result).toBe("Hello, world!");
});

it("should process template with strings", () => {
  const exec = template`Hello, ${"msg"}`;

  const result = exec({ msg: "world!" });

  expect(result).toBe("Hello, world!");
});

it("should work with empty template", () => {
  const exec = template``;

  const result = exec({ msg: "world!" });

  expect(result).toBe("");
});

it("should work with keys missing", () => {
  const exec = template`Hello, ${"msg"}!`;

  // @ts-expect-error - intentional error
  const result = exec({});

  expect(result).toBe("Hello, !");
});

it("should work with unexpected keys", () => {
  const exec = template`Hello, ${"msg"}!`;

  // @ts-expect-error - intentional error
  const result = exec({ unexpected: "world" });

  expect(result).toBe("Hello, !");
});
