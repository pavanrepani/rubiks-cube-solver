
import { COLORS } from "./cubeState";

// Each entry lists the sticker positions belonging to one corner.
// The order is important for checking corner orientation.
const CORNERS = [
  [["U", 8], ["R", 0], ["F", 2]], // URF
  [["U", 6], ["F", 0], ["L", 2]], // UFL
  [["U", 0], ["L", 0], ["B", 2]], // ULB
  [["U", 2], ["B", 0], ["R", 2]], // UBR
  [["D", 2], ["F", 8], ["R", 6]], // DFR
  [["D", 0], ["L", 8], ["F", 6]], // DLF
  [["D", 6], ["B", 8], ["L", 6]], // DBL
  [["D", 8], ["R", 8], ["B", 6]], // DRB
];

// Each entry lists the two stickers belonging to one edge.
const EDGES = [
  [["U", 5], ["R", 1]], // UR
  [["U", 7], ["F", 1]], // UF
  [["U", 3], ["L", 1]], // UL
  [["U", 1], ["B", 1]], // UB
  [["D", 5], ["R", 7]], // DR
  [["D", 1], ["F", 7]], // DF
  [["D", 3], ["L", 7]], // DL
  [["D", 7], ["B", 7]], // DB
  [["F", 5], ["R", 3]], // FR
  [["F", 3], ["L", 5]], // FL
  [["B", 5], ["L", 3]], // BL
  [["B", 3], ["R", 5]], // BR
];

function signature(colors) {
  return [...colors].sort().join("|");
}

function readPiece(cube, positions) {
  return positions.map(([face, index]) => cube[face][index]);
}

function makePieceLookup(positions) {
  return new Map(
    positions.map((piece, index) => [
      signature(piece.map(([face]) => COLORS[face])),
      index,
    ])
  );
}

const CORNER_LOOKUP = makePieceLookup(CORNERS);
const EDGE_LOOKUP = makePieceLookup(EDGES);

function permutationParity(permutation) {
  let parity = 0;

  for (let i = 0; i < permutation.length; i++) {
    for (let j = i + 1; j < permutation.length; j++) {
      if (permutation[i] > permutation[j]) {
        parity ^= 1;
      }
    }
  }

  return parity;
}

export function validatePhysicalCube(cube) {
  const errors = [];

  const cornerPermutation = [];
  const edgePermutation = [];
  const seenCorners = new Set();
  const seenEdges = new Set();

  let cornerTwistSum = 0;
  let edgeFlipSum = 0;

  // Validate all eight corner pieces.
  for (let i = 0; i < CORNERS.length; i++) {
    const colors = readPiece(cube, CORNERS[i]);
    const id = CORNER_LOOKUP.get(signature(colors));

    if (id === undefined) {
      errors.push(`Corner ${i + 1} does not match a real corner piece.`);
      continue;
    }

    if (seenCorners.has(id)) {
      errors.push("A corner piece appears more than once.");
    }

    seenCorners.add(id);
    cornerPermutation.push(id);

    const orientation = colors.findIndex(
      (color) => color === COLORS.U || color === COLORS.D
    );

    if (orientation === -1) {
      errors.push(`Corner ${i + 1} has no U/D-colored sticker.`);
    } else {
      cornerTwistSum += orientation;
    }
  }

  // Validate all twelve edge pieces.
  for (let i = 0; i < EDGES.length; i++) {
    const colors = readPiece(cube, EDGES[i]);
    const id = EDGE_LOOKUP.get(signature(colors));

    if (id === undefined) {
      errors.push(`Edge ${i + 1} does not match a real edge piece.`);
      continue;
    }

    if (seenEdges.has(id)) {
      errors.push("An edge piece appears more than once.");
    }

    seenEdges.add(id);
    edgePermutation.push(id);

    const referenceColor = colors.some(
      (color) => color === COLORS.U || color === COLORS.D
    )
      ? colors.find(
          (color) => color === COLORS.U || color === COLORS.D
        )
      : colors.find(
          (color) => color === COLORS.F || color === COLORS.B
        );

    edgeFlipSum += colors.indexOf(referenceColor);
  }

  if (
    seenCorners.size === 8 &&
    cornerPermutation.length === 8 &&
    cornerTwistSum % 3 !== 0
  ) {
    errors.push("Corner twist sum is invalid.");
  }

  if (
    seenEdges.size === 12 &&
    edgePermutation.length === 12 &&
    edgeFlipSum % 2 !== 0
  ) {
    errors.push("Edge flip sum is invalid.");
  }

  if (
    seenCorners.size === 8 &&
    seenEdges.size === 12 &&
    cornerPermutation.length === 8 &&
    edgePermutation.length === 12 &&
    permutationParity(cornerPermutation) !==
      permutationParity(edgePermutation)
  ) {
    errors.push("Corner and edge permutation parity do not match.");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
