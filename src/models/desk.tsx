import { Environment, OrbitControls, useGLTF } from "@react-three/drei";

export default function Desk() {
  const desk = useGLTF("/desk/scene.gltf");
  return (
    <>
      <mesh position={[-0.1, -0.75, 0.47]} rotation={[0, 0, 0]} scale={0.64}>
        <primitive object={desk.scene}></primitive>
      </mesh>
      <Environment preset="city" />
    </>
  );
}
