import { Environment, useGLTF, Html} from "@react-three/drei";

import Windows95OS from "../OS/osroot/Windows95OS";
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
      x: -0.0,
      y: -0.07,
      z: 0.3,
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


  function moveCameraBack() {
    if (!isCameraMoved || isCameraZooming) return;
    
    setIsCameraZooming(true);
    setCanAnimateCamera(false);
    gsap.to(camera.position, {
      x: 0.8,
      y: 0.2,
      z: 1.3,
      duration: 1,
      ease: "power2.inOut",
    });
    gsap.to(camera.rotation, {
      x: -0.4,
      y: 0.7,
      z: 0.3,
      duration: 1,
      ease: "power2.inOut",
    });
    gsap.to("mark", {
      backgroundColor: "black",
      duration: 1,
      ease: "power2.inOut",
    });
    gsap.delayedCall(1, () => {
      setIsCameraMoved(false);
      setIsCameraZooming(false);
      setCanAnimateCamera(true);
    });
  };
  return (
    <>

      <mesh position={[-0, -0.08, 0.1]} scale={1} onClick={moveCamera}>
        <primitive object={laptop.scene}>

        </primitive>
        <Html
          className="laptop"
          transform
          position={[0, -0.002, 0]}
          distanceFactor={0.005}
          scale={[9.5, 9.1, 50]}
          occlude={"blending"}
          rotation-x={-0.07}
          pointerEvents={isCameraMoved ? "auto" : "none"}
        >
          <div>
            <Windows95OS poweredOn={isCameraMoved} moveCameraBack={moveCameraBack} />
          </div>
        </Html>
      </mesh>


      <Environment preset="city" />
    </>
  );
}
