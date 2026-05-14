import { Environment, useGLTF, Html } from "@react-three/drei";

import Windows95OS from "./OS/src/windows95OS";
import { useThree } from "@react-three/fiber";
import gsap from "gsap";
import { useState } from "react";

type DesktopProps = {
  setCanAnimateCamera: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Desktop({ setCanAnimateCamera }: DesktopProps) {
  const laptop = useGLTF("/retro_computer/untitled.gltf");
  const [isCameraMoved, setIsCameraMoved] = useState(false);
  const [isCameraZooming, setIsCameraZooming] = useState(false);
  const { camera } = useThree();

  const moveCamera = () => {
    if (isCameraMoved || isCameraZooming) return;
    setIsCameraZooming(true);
    setCanAnimateCamera(false);
    gsap.to(camera.position, {
      x: -0.043,
      y: 0.04,
      z: 1,
      duration: 1,
      ease: "power2.inOut",
    });
    gsap.to(camera.rotation, {
      x: 0,
      y: 0,
      z: 0,
      duration: 1,
      ease: "power2.inOut",
    });
    gsap.to("mark", {
      backgroundColor: "white",
      duration: 1,
      ease: "power2.inOut",
    });
    
    gsap.delayedCall(1, () => {
      setIsCameraMoved(true);
      setIsCameraZooming(false);
      setCanAnimateCamera(true);
    });
  };
  return (
    <>
      <mesh position={[0, 0, 0.45]} scale={1} onClick={moveCamera}>
        <primitive object={laptop.scene}>
          <Html
            wrapperClass="laptop"
            position={[-0.039, 0.037, 0.38]}
            transform
            distanceFactor={1}
            scale={[0.101, 0.09, 1]}
            occlude={"blending"}
            rotation-x={-0.07}
            pointerEvents={isCameraMoved ? "auto" : "none"}
          >
            <div>
              <Windows95OS poweredOn={isCameraMoved} />
            </div>
          </Html>
        </primitive>
      </mesh>

      <Environment preset="city" />
    </>
  );
}
