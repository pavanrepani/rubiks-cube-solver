
import { describe, it, expect } from "vitest";

import { createSolvedCube, COLORS } from "../cube/cubeState";
import { applyMoves } from "../cube/applyMove";
import { validateCube } from "../cube/validateCube";

describe("Physical cube legality", () => {
  it("accepts a solved cube", () => {
    expect(validateCube(createSolvedCube()).valid).toBe(true);
  });

  it("accepts a cube scrambled using legal moves", () => {
    const cube = applyMoves(createSolvedCube(), [
      "R", "U", "R'", "U'", "F2", "D", "L'",
    ]);

    const result = validateCube(cube);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("rejects a twisted corner", () => {
    const cube = createSolvedCube();

    const a = cube.U[8];
    const b = cube.R[0];
    const c = cube.F[2];

    cube.U[8] = b;
    cube.R[0] = c;
    cube.F[2] = a;

    const result = validateCube(cube);

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) =>
      error.includes("Corner twist")
    )).toBe(true);
  });

  it("rejects a flipped edge", () => {
    const cube = createSolvedCube();

    [cube.U[7], cube.F[1]] = [
      cube.F[1],
      cube.U[7],
    ];

    const result = validateCube(cube);

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) =>
      error.includes("Edge flip")
    )).toBe(true);
  });

  it("rejects an edge permutation with mismatched parity", () => {
    const cube = createSolvedCube();

    // Exchange the two edge-piece colors while keeping
    // the corner arrangement unchanged.
    [cube.R[1], cube.F[1]] = [
      cube.F[1],
      cube.R[1],
    ];

    const result = validateCube(cube);

    expect(result.valid).toBe(false);
    expect(result.errors.some((error) =>
      error.includes("permutation parity")
    )).toBe(true);
  });
});
