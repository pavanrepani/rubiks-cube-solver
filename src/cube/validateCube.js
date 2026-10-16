import { validatePhysicalCube } from "./validatePhysicalCube";
import { FACE_ORDER, COLORS } from "./cubeState";

const VALID_COLORS = new Set(Object.values(COLORS));

export function validateCube(cube) {
  const errors = [];

  if (!cube || typeof cube !== "object") {
    return {
      valid: false,
      errors: ["Cube state must be an object."],
    };
  }

  // 1. Check that all six faces exist and have nine stickers.
  for (const face of FACE_ORDER) {
    if (!Array.isArray(cube[face]) || cube[face].length !== 9) {
      errors.push(`${face} face must contain exactly 9 stickers.`);
    }
  }

  // Stop if the structure is invalid.
  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // 2. Check that every sticker uses a recognized color.
  for (const face of FACE_ORDER) {
    for (let i = 0; i < 9; i++) {
      if (!VALID_COLORS.has(cube[face][i])) {
        errors.push(
          `Invalid color at ${face} face, sticker ${i + 1}.`
        );
      }
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // 3. Every color must occur exactly nine times.
  const counts = Object.fromEntries(
    [...VALID_COLORS].map((color) => [color, 0])
  );

  for (const face of FACE_ORDER) {
    for (const color of cube[face]) {
      counts[color]++;
    }
  }

  for (const [color, count] of Object.entries(counts)) {
    if (count !== 9) {
      errors.push(
        `Color ${color} must appear 9 times; found ${count}.`
      );
    }
  }

  // 4. Each face's center identifies that face.
  for (const face of FACE_ORDER) {
    if (cube[face][4] !== COLORS[face]) {
      errors.push(
        `The center sticker of ${face} must remain its original color.`
      );
    }
  }

  if (errors.length === 0) {
    const physicalResult = validatePhysicalCube(cube);
    errors.push(...physicalResult.errors);
  }
  
  return {
    valid: errors.length === 0,
    errors,
    counts,
  };
}
