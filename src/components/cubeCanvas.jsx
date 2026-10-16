
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Cube3D from "./cube3D";

export default function CubeCanvas({
  cube,
  activeMove,
  onMoveComplete,
}) {
  return (
    <div className="cube-canvas">
      <Canvas
        camera={{
          position: [4.5, 4, 5.5],
          fov: 38,
        }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#191a20"]} />

        <ambientLight intensity={1.5} />

        <directionalLight
          position={[5, 7, 5]}
          intensity={2}
        />

        <directionalLight
          position={[-4, 2, -4]}
          intensity={0.8}
        />

        <Cube3D
          cube={cube}
          activeMove={activeMove}
          onMoveComplete={onMoveComplete}
        />

        <OrbitControls
          enableDamping
          enablePan={false}
          minDistance={4}
          maxDistance={10}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI - 0.15}
        />
      </Canvas>
    </div>
  );
}
