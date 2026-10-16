
export const FACE_ORDER = ["U", "R", "F", "D", "L", "B"];

export const COLORS = {
  U: "#ffffff", // White
  R: "#e53935", // Red
  F: "#19a85b", // Green
  D: "#ffd500", // Yellow
  L: "#ff8c00", // Orange
  B: "#2878e5", // Blue
};

export function createSolvedCube() {
  return Object.fromEntries(
    FACE_ORDER.map((face) => [
      face,
      Array(9).fill(COLORS[face]),
    ])
  );
}

export function setStickerColor(cube, face, index, color) {
  if (!FACE_ORDER.includes(face)) {
    throw new Error(`Invalid face: ${face}`);
  }

  if (!Number.isInteger(index) || index < 0 || index >= 9) {
    throw new Error(`Invalid sticker index: ${index}`);
  }

  return {
    ...cube,
    [face]: cube[face].map((sticker, i) =>
      i === index ? color : sticker
    ),
  };
}

export function isSolvedCube(cube) {
  return FACE_ORDER.every((face) =>
    cube[face].every((color) => color === cube[face][0])
  );
}
