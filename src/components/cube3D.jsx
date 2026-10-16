
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";

const FACE_INFO = {
  U: { axis: 1, sign: 1 },
  R: { axis: 0, sign: 1 },
  F: { axis: 2, sign: 1 },
  D: { axis: 1, sign: -1 },
  L: { axis: 0, sign: -1 },
  B: { axis: 2, sign: -1 },
};

function getStickerIndex(face, x, y, z) {
  let row;
  let col;

  switch (face) {
    case "U":
      row = z + 1;
      col = x + 1;
      break;
    case "R":
      row = 1 - y;
      col = 1 - z;
      break;
    case "F":
      row = 1 - y;
      col = x + 1;
      break;
    case "D":
      row = 1 - z;
      col = x + 1;
      break;
    case "L":
      row = 1 - y;
      col = z + 1;
      break;
    case "B":
      row = 1 - y;
      col = 1 - x;
      break;
    default:
      throw new Error(`Unknown face: ${face}`);
  }

  return row * 3 + col;
}

function Sticker({ face, color }) {
  let position;
  let size;

  switch (face) {
    case "U":
      position = [0, 0.49, 0];
      size = [0.82, 0.035, 0.82];
      break;
    case "D":
      position = [0, -0.49, 0];
      size = [0.82, 0.035, 0.82];
      break;
    case "R":
      position = [0.49, 0, 0];
      size = [0.035, 0.82, 0.82];
      break;
    case "L":
      position = [-0.49, 0, 0];
      size = [0.035, 0.82, 0.82];
      break;
    case "F":
      position = [0, 0, 0.49];
      size = [0.82, 0.82, 0.035];
      break;
    case "B":
      position = [0, 0, -0.49];
      size = [0.82, 0.82, 0.035];
      break;
    default:
      throw new Error(`Unknown face: ${face}`);
  }

  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial
        color={color}
        roughness={0.4}
        metalness={0.05}
      />
    </mesh>
  );
}

function Cubie({ cube, x, y, z }) {
  const stickers = [];

  if (y === 1) stickers.push("U");
  if (y === -1) stickers.push("D");
  if (x === 1) stickers.push("R");
  if (x === -1) stickers.push("L");
  if (z === 1) stickers.push("F");
  if (z === -1) stickers.push("B");

  return (
    <group position={[x * 1.02, y * 1.02, z * 1.02]}>
      <mesh>
        <boxGeometry args={[0.96, 0.96, 0.96]} />
        <meshStandardMaterial
          color="#171923"
          roughness={0.6}
        />
      </mesh>

      {stickers.map((face) => {
        const index = getStickerIndex(face, x, y, z);

        return (
          <Sticker
            key={face}
            face={face}
            color={cube[face][index]}
          />
        );
      })}
    </group>
  );
}

export default function Cube3D({
  cube,
  activeMove,
  onMoveComplete,
}) {
  const rotatingGroup = useRef(null);
  const startedAt = useRef(null);
  const completedMove = useRef(null);

  useEffect(() => {
    startedAt.current = null;
    completedMove.current = null;

    if (rotatingGroup.current) {
      rotatingGroup.current.rotation.set(0, 0, 0);
    }
  }, [activeMove]);

  useFrame(({ clock }) => {
    if (!activeMove || !rotatingGroup.current) return;

    if (startedAt.current === null) {
      startedAt.current = clock.elapsedTime;
    }

    const { axis, sign } = FACE_INFO[activeMove[0]];

    const suffix = activeMove.slice(1);
    const amount = suffix === "2" ? 2 : suffix === "'" ? -1 : 1;

    // Match the rotation direction used by applyMove.js.
    const quarterTurns = -sign * amount;
    const targetAngle = quarterTurns * (Math.PI / 2);

    const duration = 0.35;
    const elapsed = clock.elapsedTime - startedAt.current;
    const progress = Math.min(elapsed / duration, 1);

    // Smooth ease-in/ease-out animation.
    const easedProgress =
      progress * progress * (3 - 2 * progress);

    rotatingGroup.current.rotation.set(0, 0, 0);

    if (axis === 0) {
      rotatingGroup.current.rotation.x =
        targetAngle * easedProgress;
    } else if (axis === 1) {
      rotatingGroup.current.rotation.y =
        targetAngle * easedProgress;
    } else {
      rotatingGroup.current.rotation.z =
        targetAngle * easedProgress;
    }

    if (
      progress >= 1 &&
      completedMove.current !== activeMove
    ) {
      completedMove.current = activeMove;
      onMoveComplete?.(activeMove);
    }
  });

  const stationaryCubies = [];
  const movingCubies = [];

  const moveInfo = activeMove
    ? FACE_INFO[activeMove[0]]
    : null;

  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      for (let z = -1; z <= 1; z++) {
        if (x === 0 && y === 0 && z === 0) continue;

        const cubie = (
          <Cubie
            key={`${x},${y},${z}`}
            cube={cube}
            x={x}
            y={y}
            z={z}
          />
        );

        if (
          moveInfo &&
          [x, y, z][moveInfo.axis] === moveInfo.sign
        ) {
          movingCubies.push(cubie);
        } else {
          stationaryCubies.push(cubie);
        }
      }
    }
  }

  return (
    <group>
      {stationaryCubies}

      <group ref={rotatingGroup}>
        {movingCubies}
      </group>
    </group>
  );
}
