import {
  PresentationControls,
  Environment,
  useGLTF,
  Html,
} from "@react-three/drei";

import Windows95OS from "./OS/src/Windows95OS";

export default function Desktop() {
  const laptop = useGLTF("/retro_computer/untitled.gltf");

  return (
    <PresentationControls
      global
      rotation={[0.13, 0.1, 0]}
      polar={[-0.4, 0.2]}
      azimuth={[-1, 0.75]}
    >
      <mesh position={[0, 0, -2]} scale={8}>
        <primitive object={laptop.scene}>
          <Html
            wrapperClass="laptop"
            position={[-0.039, 0.031, 0.38]}
            transform
            distanceFactor={1}
            scale={[0.101, 0.09, 1]}
            occlude={"blending"}
            rotation-x={-0.07}
          >
            <div>
              <Windows95OS />
            </div>
          </Html>
        </primitive>
      </mesh>
      <Environment preset="city" />
    </PresentationControls>
  );
}
