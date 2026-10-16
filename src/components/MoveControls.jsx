
import "./MoveControls.css";

const MOVES = [
  ["U", "U'", "U2"],
  ["D", "D'", "D2"],
  ["L", "L'", "L2"],
  ["R", "R'", "R2"],
  ["F", "F'", "F2"],
  ["B", "B'", "B2"],
];

export default function MoveControls({
  onMove,
  disabled = false,
  onUndo,
  onReset,
  canUndo = false,
}) {
  return (
    <section className="move-controls">
      <div className="move-controls-heading">
        <h3>Face Turns</h3>
        <p>Choose a move to rotate a cube face.</p>
      </div>

      {MOVES.map((group) => (
        <div className="move-row" key={group[0]}>
          {group.map((move) => (
            <button
              className="move-button"
              key={move}
              type="button"
              disabled={disabled}
              onClick={() => onMove(move)}
              title={`Apply ${move}`}
            >
              {move}
            </button>
          ))}
        </div>
      ))}

      <div className="move-actions">
        <button
          type="button"
          className="secondary-move-button"
          disabled={disabled || !canUndo}
          onClick={onUndo}
        >
          Undo
        </button>

        <button
          type="button"
          className="secondary-move-button"
          disabled={disabled}
          onClick={onReset}
        >
          Reset
        </button>
      </div>
    </section>
  );
}
