import { Environment, useGLTF } from "@react-three/drei";

export default function Desk() {
  const desk = useGLTF("/desk/scene.gltf");
  return (
    <>
      <mesh position={[-0.3, -0.56, 1]} rotation={[0, -1.57, 0]} scale={0.4}>
        <primitive object={desk.scene}></primitive>
      </mesh>
      <Environment preset="city" />
    </>
  );
}
