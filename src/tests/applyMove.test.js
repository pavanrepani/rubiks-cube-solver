
import { describe, it, expect } from "vitest";

import { createSolvedCube } from "../cube/cubeState";
import { applyMove, applyMoves } from "../cube/applyMove";


function createLabeledCube() {
    return Object.fromEntries(
      ["U", "R", "F", "D", "L", "B"].map((face) => [
        face,
        Array.from({ length: 9 }, (_, i) => `${face}${i}`),
      ])
    );
  }
  
  
  
  function hasSameStickers(a, b) {
    const stickersA = Object.values(a).flat().sort();
    const stickersB = Object.values(b).flat().sort();
  
    return JSON.stringify(stickersA) === JSON.stringify(stickersB);
  }
  
const sameCube = (a, b) =>
  JSON.stringify(a) === JSON.stringify(b);

describe("Cube move engine", () => {
  it.each(["U", "R", "F", "D", "L", "B"])(
    "%s four times restores the original cube",
    (face) => {
      const original = createSolvedCube();
      const result = applyMoves(original, [
        face, face, face, face,
      ]);

      expect(sameCube(result, original)).toBe(true);
    }
  );

  it.each(["U", "R", "F", "D", "L", "B"])(
    "%s followed by its inverse restores the cube",
    (face) => {
      const original = createSolvedCube();
      const result = applyMoves(original, [
        face, `${face}'`,
      ]);

      expect(sameCube(result, original)).toBe(true);
    }
  );

  it.each(["U", "R", "F", "D", "L", "B"])(
    "%s2 twice restores the cube",
    (face) => {
      const original = createSolvedCube();
      const result = applyMoves(original, [
        `${face}2`, `${face}2`,
      ]);

      expect(sameCube(result, original)).toBe(true);
    }
  );


it.each(["U", "R", "F", "D", "L", "B"])(
    "%s changes sticker positions and four turns restore them",
    (face) => {
      const original = createLabeledCube();
  
      const once = applyMove(original, face);
      expect(sameCube(once, original)).toBe(false);
      expect(hasSameStickers(once, original)).toBe(true);
  
      const fourTurns = applyMoves(original, [
        face, face, face, face,
      ]);
  
      expect(sameCube(fourTurns, original)).toBe(true);
    }
  );
  
  it.each(["U", "R", "F", "D", "L", "B"])(
    "%s followed by its inverse restores labeled stickers",
    (face) => {
      const original = createLabeledCube();
      const result = applyMoves(original, [face, `${face}'`]);
  
      expect(sameCube(result, original)).toBe(true);
    }
  );
  

  it("does not mutate the original cube", () => {
    const original = createSolvedCube();
    const snapshot = structuredClone(original);

    applyMove(original, "R");

    expect(sameCube(original, snapshot)).toBe(true);
  });

  it("rejects invalid move notation", () => {
    expect(() => applyMove(createSolvedCube(), "X"))
      .toThrow("Invalid move notation");
  });
});
