import { useMemo, useRef, useState } from "react";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { MeshStandardMaterial, type Group } from "three";

const faceColors = {
  U: "#ffffff",
  D: "#ffff00",
  F: "#ff0000",
  B: "#ff8000",
  R: "#0000ff",
  L: "#00ff00",
  blank: "#111111",
};

const axisMaterialIndex = (x: number, y: number, z: number): Array<keyof typeof faceColors> => [
  x === 1 ? "R" : "blank",
  x === -1 ? "L" : "blank",
  y === 1 ? "U" : "blank",
  y === -1 ? "D" : "blank",
  z === 1 ? "F" : "blank",
  z === -1 ? "B" : "blank",
];

function Cubelet({ position, coords, onClick }: { position: [number, number, number]; coords: [number, number, number]; onClick: (event: ThreeEvent<MouseEvent>) => void; }) {
  const materials = useMemo(() => {
    return axisMaterialIndex(coords[0], coords[1], coords[2]).map((key) => {
      return new MeshStandardMaterial({
        color: faceColors[key],
        roughness: 0.4,
        metalness: 0.1,
      });
    });
  }, [coords]);

  return (
    <mesh position={position} onClick={(event) => { event.stopPropagation(); onClick(event); }} castShadow receiveShadow material={materials}>
      <boxGeometry args={[0.05, 0.05, 0.05]} />
    </mesh>
  );
}

type RubiksCubeProps = {
  focused: boolean;
  onToggleFocus: (focused: boolean) => void;
};

export default function RubiksCube({ focused, onToggleFocus }: RubiksCubeProps) {
  const cubeRef = useRef<Group>(null);
  const [dragging, setDragging] = useState(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const cubes = useMemo(() => {
    const positions: Array<{ position: [number, number, number]; coords: [number, number, number] }> = [];
    const step = 0.06;
    const coords = [-1, 0, 1] as const;

    for (const x of coords) {
      for (const y of coords) {
        for (const z of coords) {
          positions.push({ position: [x * step, y * step, z * step], coords: [x, y, z] });
        }
      }
    }

    return positions;
  }, []);

  useFrame((_, delta) => {
    if (!cubeRef.current) return;

    const targetY = focused ? 0.45 : 0.18;
    const targetScale = focused ? 0.45 : 0.25;
    cubeRef.current.position.y += (targetY - cubeRef.current.position.y) * 0.12;
    const scaleValue = cubeRef.current.scale.x + (targetScale - cubeRef.current.scale.x) * 0.12;
    cubeRef.current.scale.set(scaleValue, scaleValue, scaleValue);

    if (!dragging && !focused) {
      cubeRef.current.rotation.y += delta * 0.5;
      cubeRef.current.rotation.x += delta * 0.08;
    }
  });

  const handleCubeClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onToggleFocus(!focused);
  };

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setDragging(true);
    lastPointer.current = { x: event.clientX, y: event.clientY };
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!dragging || !cubeRef.current) return;
    const deltaX = event.clientX - lastPointer.current.x;
    const deltaY = event.clientY - lastPointer.current.y;
    lastPointer.current = { x: event.clientX, y: event.clientY };
    cubeRef.current.rotation.y += deltaX * 0.006;
    cubeRef.current.rotation.x += deltaY * 0.006;
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setDragging(false);
  };

  return (
    <group position={[0.45, -0.30, 0.18]}>
      <ambientLight intensity={0.45} />
      <directionalLight intensity={1.1} position={[2, 3, 1.5]} />
      <group
        ref={cubeRef}
        scale={[0.25, 0.25, 0.25]}
        onClick={handleCubeClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => setDragging(false)}
      >
        {cubes.map(({ position, coords }) => (
          <Cubelet
            key={`${coords[0]}-${coords[1]}-${coords[2]}`}
            position={position}
            coords={coords}
            onClick={handleCubeClick}
          />
        ))}
      </group>
    </group>
  );
}
