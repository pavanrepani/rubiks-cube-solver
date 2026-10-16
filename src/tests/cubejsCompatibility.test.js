
import { describe, it, expect } from "vitest";
import Cube from "cubejs";

import { applyMove } from "../cube/applyMove";
import {
  FACE_ORDER,
  COLORS,
  createSolvedCube,
} from "../cube/cubeState";

const COLOR_TO_FACE = Object.fromEntries(
  FACE_ORDER.map((face) => [COLORS[face], face])
);

function toFaceletString(cube) {
  return FACE_ORDER.map((face) =>
    cube[face]
      .map((color) => {
        const faceLetter = COLOR_TO_FACE[color];

        if (!faceLetter) {
          throw new Error(`Unknown sticker color: ${color}`);
        }

        return faceLetter;
      })
      .join("")
  ).join("");
}

describe("Move engine compatibility with cubejs", () => {
  it.each(["U", "R", "F", "D", "L", "B"])(
    "matches cubejs for the %s move",
    (move) => {
      const localCube = applyMove(createSolvedCube(), move);

      const referenceCube = new Cube();
      referenceCube.move(move);

      expect(toFaceletString(localCube)).toBe(
        referenceCube.asString()
      );
    }
  );

  it.each([
    ["R", "U", "F", "D", "L", "B"],
    ["R", "U", "R'", "U'"],
    ["F2", "D", "L'", "B2", "U", "R2"],
  ])("matches cubejs throughout a move sequence", (...moves) => {
    let localCube = createSolvedCube();
    const referenceCube = new Cube();

    for (const move of moves) {
      localCube = applyMove(localCube, move);
      referenceCube.move(move);

      expect(toFaceletString(localCube)).toBe(
        referenceCube.asString()
      );
    }
  });
});
