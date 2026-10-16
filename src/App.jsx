import { useEffect, useState } from "react";
import { solveCube } from "./solver/cubejsSolver";
import CubeCanvas from "./components/cubeCanvas";
import MoveControls from "./components/MoveControls";
import { validateCube } from "./cube/validateCube";
import { applyMove } from "./cube/applyMove";
import "./App.css";

import {
  FACE_ORDER,
  COLORS,
  createSolvedCube,
  setStickerColor,
  isSolvedCube,
} from "./cube/cubeState";

const FACE_NAMES = {
  U: "Up",
  R: "Right",
  F: "Front",
  D: "Down",
  L: "Left",
  B: "Back",
};

const PALETTE = [
  { name: "White", value: COLORS.U },
  { name: "Red", value: COLORS.R },
  { name: "Green", value: COLORS.F },
  { name: "Yellow", value: COLORS.D },
  { name: "Orange", value: COLORS.L },
  { name: "Blue", value: COLORS.B },
];

function invertMove(move) {
  if (move.endsWith("2")) return move;
  if (move.endsWith("'")) return move.slice(0, -1);
  return `${move}'`;
}

function App() {
  const [cube, setCube] = useState(createSolvedCube);
  const [selectedColor, setSelectedColor] = useState(COLORS.R);
  const [selectedFace, setSelectedFace] = useState("U");
  const [history, setHistory] = useState([]);
  const [activeMove, setActiveMove] = useState(null);
  const [solveQueue, setSolveQueue] = useState([]);
  const [isSolving, setIsSolving] = useState(false);
  const [solverStatus, setSolverStatus] = useState("");
  const [solverError, setSolverError] = useState("");
  const solved = isSolvedCube(cube);
  const validation = validateCube(cube);

  function paintSticker(face, index) {
    if (activeMove) return;

    setCube((current) =>
      setStickerColor(current, face, index, selectedColor)
    );

    // Manual edits invalidate the previous move history.
    setHistory([]);
  }

  function resetCube() {
    setCube(createSolvedCube());
    setSelectedFace("U");
    setSelectedColor(COLORS.R);
    setHistory([]);
    setActiveMove(null);
    setSolveQueue([]);
    setIsSolving(false);
    setSolverStatus("");
    setSolverError("");
  }

  function startMove(move) {
    if (activeMove || isSolving || solveQueue.length > 0) return;
    setActiveMove(move);
  }
  
  function finishMove(move) {
    setCube((current) => applyMove(current, move));
    setHistory((current) => [...current, move]);
    setActiveMove(null);
  
    if (isSolving && solveQueue.length === 0) {
      setIsSolving(false);
      setSolverStatus("Cube solved successfully!");
    }
  }
  
  function undoMove() {
    if (activeMove || isSolving || history.length === 0) return;
  
    const lastMove = history[history.length - 1];
  
    setCube((current) => applyMove(current, invertMove(lastMove)));
    setHistory((current) => current.slice(0, -1));
  }
  
  
async function handleSolve() {
  if (activeMove || isSolving) return;

  // Check the actual logical cube state first.
  if (isSolvedCube(cube)) {
    setSolverStatus("The cube is already solved!");
    setSolverError("");
    setIsSolving(false);
    setSolveQueue([]);
    return;
  }

  setSolverError("");
  setSolverStatus("Initializing solver and calculating solution...");
  setIsSolving(true);

  try {
    const solution = await solveCube(cube);

    if (solution.length === 0) {
      setSolverStatus("The cube is already solved!");
      setIsSolving(false);
      return;
    }

    setSolverStatus(
      `Solution found: ${solution.length} moves. Playing solution...`
    );

    setSolveQueue(solution);
  } catch (error) {
    setSolverError(
      error instanceof Error
        ? error.message
        : "Unable to solve the cube."
    );
    setSolverStatus("");
    setIsSolving(false);
    setSolveQueue([]);
  }
}


  function restoreCenter() {
    if (activeMove) return;

    setCube((current) => ({
      ...current,
      [selectedFace]: current[selectedFace].map((color, index) =>
        index === 4 ? COLORS[selectedFace] : color
      ),
    }));

    setHistory([]);
  }

  useEffect(() => {
    if (!activeMove && solveQueue.length > 0) {
      const [nextMove, ...remainingMoves] = solveQueue;
  
      setSolveQueue(remainingMoves);
      setActiveMove(nextMove);
    }
  }, [activeMove, solveQueue]);

  return (
    <main className="app">
      <header className="navbar">
        <h1>
          <span className="logo">R</span> RubikSolver
        </h1>
        <span className="status">CUBE MODEL · MOVE CONTROLS</span>
      </header>

      <section className="hero">
        <p className="eyebrow">YOUR PERSONAL CUBE ASSISTANT</p>
        <h2>Let's solve the cube.</h2>
        <p className="subtitle">
          Configure, rotate, validate, and solve your Rubik's Cube.
        </p>
      </section>

      <section className="workspace">
        <div className="panel cube-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">01 / CUBE EDITOR</p>
              <h3>Configure your cube</h3>
            </div>
            <span className="tag">54 STICKERS</span>
          </div>

          <div className="cube-3d-section">
            <div className="section-caption">
              3D PREVIEW · DRAG TO ROTATE
            </div>

            <CubeCanvas
              cube={cube}
              activeMove={activeMove}
              onMoveComplete={finishMove}
            />
          </div>

          <MoveControls
            onMove={startMove}
            disabled={Boolean(activeMove)}
            onUndo={undoMove}
            onReset={resetCube}
            canUndo={history.length > 0}
          />

          <div className="move-history">
            <h4>Move History</h4>
            <p>
              {history.length > 0
                ? history.join(" ")
                : "No moves yet"}
            </p>
          </div>

          <p className="description">
            Select a face, choose a color, and tap a sticker to paint it.
          </p>

          <div className="face-selector">
            {FACE_ORDER.map((face) => (
              <button
                key={face}
                disabled={Boolean(activeMove)}
                className={
                  selectedFace === face ? "face-tab active" : "face-tab"
                }
                onClick={() => setSelectedFace(face)}
              >
                {face}
              </button>
            ))}
          </div>

          <div className="active-face">
            <span>{FACE_NAMES[selectedFace]} face</span>
            <span>
              {cube[selectedFace].filter(
                (color) => color === selectedColor
              ).length}{" "}
              stickers match selected color
            </span>
          </div>

          <div className="cube-net">
            {FACE_ORDER.map((face) => (
              <div
                key={face}
                className={`face face-${face} ${
                  selectedFace === face ? "face-active" : ""
                }`}
              >
                <span className="face-label">{face}</span>

                <div className="sticker-grid">
                  {cube[face].map((color, index) => (
                    <button
                      key={index}
                      disabled={Boolean(activeMove)}
                      className="cube-sticker"
                      style={{ backgroundColor: color }}
                      onClick={() => {
                        setSelectedFace(face);
                        paintSticker(face, index);
                      }}
                      aria-label={`${FACE_NAMES[face]} sticker ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="cube-status">
            {solved
              ? "All faces are uniform."
              : "Colors changed — cube configuration needs validation."}
          </p>

          <button
            className="secondary-button"
            disabled={Boolean(activeMove)}
            onClick={resetCube}
          >
            Reset to Solved Cube
          </button>
        </div>

        <div className="panel editor-panel">
          <p className="eyebrow">02 / COLOR PALETTE</p>
          <h3>Choose a color</h3>

          <p className="description">
            Selected color:{" "}
            <strong>
              {PALETTE.find(
                (color) => color.value === selectedColor
              )?.name}
            </strong>
          </p>

          <div className="color-palette">
            {PALETTE.map((color) => (
              <button
                key={color.name}
                disabled={Boolean(activeMove)}
                className={`color-option ${
                  selectedColor === color.value ? "selected" : ""
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => setSelectedColor(color.value)}
                title={color.name}
                aria-label={color.name}
              />
            ))}
          </div>

          <div className="divider" />

          <p className="eyebrow">03 / SOLVER</p>
          <h3>{solved ? "Cube looks uniform" : "Cube modified"}</h3>

          <p className="description">
            Validate the cube configuration before connecting the automatic
            solving algorithm.
          </p>

          <div className="validation-panel">
            <h4>
              {validation.valid
                ? "✓ Validation passed"
                : "⚠ Cube needs correction"}
            </h4>

            {validation.valid ? (
              <p>Color counts, face structure, centers, and physical checks passed.</p>
            ) : (
              <ul>
                {validation.errors.map((error, index) => (
                  <li key={`${error}-${index}`}>{error}</li>
                ))}
              </ul>
            )}
          </div>

          
          <button
            className="primary-button"
            disabled={Boolean(activeMove) || isSolving || !validation.valid}
            onClick={handleSolve}
          >
            {isSolving ? "Solving..." : "✦ Solve Cube"}
          </button>

          {solverStatus && (
            <p className="description" role="status">
              {solverStatus}
            </p>
          )}

          {solverError && (
            <p className="description" role="alert">
              {solverError}
            </p>
          )}


          <button
            className="secondary-button"
            disabled={Boolean(activeMove)}
            onClick={restoreCenter}
          >
            Restore Selected Center
          </button>
        </div>
      </section>

      <footer>Built with React · Three.js · Cube State · Algorithms</footer>
    </main>
  );
}

export default App;
