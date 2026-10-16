
import { FACE_ORDER } from "./cubeState";

// Face normals point outward from the cube.
const FACE_INFO = {
  U: { normal: [0, 1, 0], axis: 1, sign: 1 },
  R: { normal: [1, 0, 0], axis: 0, sign: 1 },
  F: { normal: [0, 0, 1], axis: 2, sign: 1 },
  D: { normal: [0, -1, 0], axis: 1, sign: -1 },
  L: { normal: [-1, 0, 0], axis: 0, sign: -1 },
  B: { normal: [0, 0, -1], axis: 2, sign: -1 },
};

// Convert a face sticker into a 3D position and outward normal.
function stickerToCoordinate(face, index) {
  const row = Math.floor(index / 3);
  const col = index % 3;

  switch (face) {
    case "U":
      return { pos: [col - 1, 1, row - 1], normal: [0, 1, 0] };
    case "R":
      return { pos: [1, 1 - row, 1 - col], normal: [1, 0, 0] };
    case "F":
      return { pos: [col - 1, 1 - row, 1], normal: [0, 0, 1] };
    case "D":
      return { pos: [col - 1, -1, 1 - row], normal: [0, -1, 0] };
    case "L":
      return { pos: [-1, 1 - row, col - 1], normal: [-1, 0, 0] };
    case "B":
      return { pos: [1 - col, 1 - row, -1], normal: [0, 0, -1] };
    default:
      throw new Error(`Unknown face: ${face}`);
  }
}

// Convert a 3D position and normal back into a face sticker index.
function coordinateToSticker(pos, normal) {
  const [x, y, z] = pos;
  const key = normal.join(",");

  let face;
  let row;
  let col;

  switch (key) {
    case "0,1,0":
      face = "U";
      row = z + 1;
      col = x + 1;
      break;
    case "1,0,0":
      face = "R";
      row = 1 - y;
      col = 1 - z;
      break;
    case "0,0,1":
      face = "F";
      row = 1 - y;
      col = x + 1;
      break;
    case "0,-1,0":
      face = "D";
      row = 1 - z;
      col = x + 1;
      break;
    case "-1,0,0":
      face = "L";
      row = 1 - y;
      col = z + 1;
      break;
    case "0,0,-1":
      face = "B";
      row = 1 - y;
      col = 1 - x;
      break;
    default:
      throw new Error("Invalid sticker normal.");
  }

  const index = row * 3 + col;

  if (
    !FACE_ORDER.includes(face) ||
    row < 0 || row > 2 ||
    col < 0 || col > 2
  ) {
    throw new Error("Invalid sticker coordinates.");
  }

  return { face, index };
}

// Apply a positive 90-degree right-handed rotation.
function rotateVector(vector, axis, quarterTurns) {
  let [x, y, z] = vector;
  const turns = ((quarterTurns % 4) + 4) % 4;

  for (let i = 0; i < turns; i++) {
    if (axis === 0) [x, y, z] = [x, -z, y];
    else if (axis === 1) [x, y, z] = [z, y, -x];
    else [x, y, z] = [-y, x, z];
  }

  return [x, y, z];
}

// Apply one face turn: U, R, F, D, L, or B.
export function applyMove(cube, notation) {
  const match = /^([URFDLB])(['2]?)$/.exec(notation);

  if (!match) {
    throw new Error(`Invalid move notation: ${notation}`);
  }

  const [, face, suffix] = match;
  const { axis, sign } = FACE_INFO[face];

  // Clockwise is negative around the outward-facing normal.
  const amount = suffix === "2" ? 2 : suffix === "'" ? -1 : 1;
  const quarterTurns = -sign * amount;

  // Create a fresh state; never mutate the original cube.
  const next = Object.fromEntries(
    FACE_ORDER.map((f) => [f, Array(9)])
  );

  for (const sourceFace of FACE_ORDER) {
    for (let index = 0; index < 9; index++) {
      const color = cube[sourceFace][index];
      const { pos, normal } = stickerToCoordinate(
        sourceFace,
        index
      );

      let targetPos = pos;
      let targetNormal = normal;

      // Only stickers belonging to the turned layer move.
      if (pos[axis] === sign) {
        targetPos = rotateVector(pos, axis, quarterTurns);
        targetNormal = rotateVector(normal, axis, quarterTurns);
      }

      const target = coordinateToSticker(
        targetPos,
        targetNormal
      );

      next[target.face][target.index] = color;
    }
  }

  return next;
}

// Apply a sequence such as ["R", "U", "R'", "U'"].
export function applyMoves(cube, moves) {
  return moves.reduce(
    (current, move) => applyMove(current, move),
    cube
  );
}
