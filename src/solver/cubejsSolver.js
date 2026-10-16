
import { FACE_ORDER, COLORS } from "../cube/cubeState";

const COLOR_TO_FACE = Object.fromEntries(
  FACE_ORDER.map((face) => [COLORS[face], face])
);

let CubeClass = null;
let initialized = false;
let initializationPromise = null;

function toFaceletString(cube) {
  return FACE_ORDER.map((face) =>
    cube[face]
      .map((color) => {
        const letter = COLOR_TO_FACE[color];

        if (!letter) {
          throw new Error(`Unrecognized sticker color: ${color}`);
        }

        return letter;
      })
      .join("")
  ).join("");
}

async function loadCubeClass() {
  if (CubeClass) return CubeClass;

  const module = await import("cubejs");
  CubeClass = module.default ?? module.Cube ?? module;

  if (typeof CubeClass !== "function") {
    throw new Error("Could not load the cubejs Cube constructor.");
  }

  return CubeClass;
}

async function initializeSolver() {
  const Cube = await loadCubeClass();

  if (initialized) return Cube;
  if (initializationPromise) {
    await initializationPromise;
    return Cube;
  }

  initializationPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        Cube.initSolver();
        initialized = true;
        resolve();
      } catch (error) {
        reject(error);
      }
    }, 50);
  });

  try {
    await initializationPromise;
    return Cube;
  } catch (error) {
    initializationPromise = null;
    throw error;
  }
}

export async function solveCube(cube) {
  const facelets = toFaceletString(cube);

  if (facelets.length !== 54) {
    throw new Error("The cube must contain exactly 54 stickers.");
  }

  const Cube = await initializeSolver();
  const solverCube = Cube.fromString(facelets);
  const solution = solverCube.solve();

  solverCube.move(solution);

  if (!solverCube.isSolved()) {
    throw new Error("The solver returned an invalid solution.");
  }

  return solution.trim()
    ? solution.trim().split(/\s+/)
    : [];
}
