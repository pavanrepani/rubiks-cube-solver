
import { describe, it, expect } from "vitest";

import { createSolvedCube, COLORS } from "../cube/cubeState";
import { validateCube } from "../cube/validateCube";

describe("validateCube", () => {
  it("accepts a solved cube", () => {
    const cube = createSolvedCube();

    expect(validateCube(cube).valid).toBe(true);
  });

  it("rejects a missing face", () => {
    const cube = createSolvedCube();
    delete cube.U;

    const result = validateCube(cube);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it("rejects a face with fewer than nine stickers", () => {
    const cube = createSolvedCube();
    cube.F.pop();

    expect(validateCube(cube).valid).toBe(false);
  });

  it("rejects an invalid sticker color", () => {
    const cube = createSolvedCube();
    cube.U[0] = "#123456";

    const result = validateCube(cube);

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) =>
      error.includes("Invalid color")
    )).toBe(true);
  });

  it("rejects incorrect color counts", () => {
    const cube = createSolvedCube();

    // Preserve the center but change one white sticker to red.
    cube.U[0] = COLORS.R;

    const result = validateCube(cube);

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) =>
      error.includes("must appear 9 times")
    )).toBe(true);
  });

  it("rejects a changed center sticker", () => {
    const cube = createSolvedCube();
    cube.U[4] = COLORS.R;

    const result = validateCube(cube);

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) =>
      error.includes("center sticker")
    )).toBe(true);
  });
});
