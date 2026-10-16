# Rubik's Cube Solver

An interactive 3D Rubik's Cube solver built with React, Vite, and
Three.js. Explore the cube, edit sticker colors, perform face turns,
validate cube configurations, and calculate a solution.

## Features

-   **Interactive 3D cube** --- rotate the camera with drag controls and
    inspect the cube from different angles.
-   **Sticker editor** --- edit the six faces using a color palette.
-   **Face-turn controls** --- apply standard moves (`U`, `D`, `L`, `R`,
    `F`, `B`), inverse turns, and double turns.
-   **Animated moves** --- watch face layers rotate.
-   **Cube validation** --- check sticker colors, face structure,
    centers, and physical legality.
-   **Move history and undo** --- review and reverse recent moves.
-   **Automatic solving** --- calculate and animate a solution for a
    valid cube state.
-   **Automated tests** --- test cube validation, move operations, and
    solver compatibility.

## Tech stack

-   React
-   Vite
-   Three.js
-   React Three Fiber
-   Drei
-   cubejs
-   Vitest

## Getting started

### Requirements

-   Node.js and npm
-   Git

### Install dependencies

Clone the repository and enter the project directory:

``` bash
git clone https://github.com/pavanrepani/rubiks-cube-solver.git
cd rubiks-cube-solver
npm install
```

### Run the development server

``` bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

### Run tests

``` bash
npm run test:run
```

### Build for production

``` bash
npm run build
```

If a command is not defined in `package.json`, check the available
scripts with:

``` bash
npm run
```

## How to use

1.  Start the app and inspect the cube in the 3D preview.
2.  Use the face-turn buttons to scramble the cube.
3.  Use the editor and palette when you need to configure sticker colors
    manually.
4.  Check the validation panel. The solver requires a valid cube
    configuration.
5.  Select **Solve Cube** and wait for the solution moves to play.
6.  Use undo or reset to return to an earlier state or the solved cube.

## Move notation

  -----------------------------------------------------------------------
  Notation                            Meaning
  ----------------------------------- -----------------------------------
  `R`, `L`, `U`, `D`, `F`, `B`        Clockwise quarter-turn of the named
                                      face

  `R'`, `U'`, etc.                    Counterclockwise quarter-turn

  `R2`, `F2`, etc.                    Half-turn (180 degrees)
  -----------------------------------------------------------------------

Clockwise is interpreted while looking directly at the face being
turned.

## Project structure

``` text
src/
  components/   # 3D cube, canvas, and move controls
  cube/         # Cube state, move engine, and validation
  solver/       # cubejs solver integration
  tests/        # Automated tests
  App.jsx       # Main application UI
```

## Solver notes

The solver uses `cubejs` and expects a physically valid 3×3 cube
configuration. The first solve may take longer while solver tables
initialize. If you change the move engine or facelet mapping, run the
tests and verify that the solver's output returns the logical cube to
the solved state.

## Future improvements

-   Pause and resume solution playback
-   Step forward and backward through a solution
-   Generate random scrambles
-   Add a solve timer and move counter
-   Deploy a public demo

## Contributing

Issues and pull requests are welcome. Before submitting changes, run the
project tests:

``` bash
npm run test:run
```

## License

No license has been specified yet. Add a license file if you want to
grant others explicit permission to reuse or distribute this project.
