import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

type CameraFollowMouseProps = {
  enabled?: boolean;
  focusTarget?: [number, number, number];
  focusLookAt?: [number, number, number];
};

export default function CameraFollowMouse({ enabled = true, focusTarget, focusLookAt }: CameraFollowMouseProps) {
  const { camera } = useThree();
  const pointerRef = useRef({ x: 0, y: 0 });
  const baseRotationRef = useRef({
    x: camera.rotation.x,
    y: camera.rotation.y,
    z: camera.rotation.z,
  });
  const appliedOffsetRef = useRef({ x: 0, y: 0, z: 0 });
  const focusTargetRef = useRef(new Vector3());
  const focusLookAtRef = useRef(new Vector3());

  useEffect(() => {
    const updatePointer = (event: PointerEvent) => {
      pointerRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointerRef.current.y = -((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("pointermove", updatePointer);

    return () => {
      window.removeEventListener("pointermove", updatePointer);
    };
  }, []);

  // eslint-disable-next-line react-hooks/immutability
  useFrame(() => {
    if (focusTarget) {
      focusTargetRef.current.set(...focusTarget);
      camera.position.lerp(focusTargetRef.current, 0.12);
      if (focusLookAt) {
        focusLookAtRef.current.set(...focusLookAt);
      } else {
        focusLookAtRef.current.set(0, 0, 0);
      }
      camera.lookAt(focusLookAtRef.current);
    }

    if (!enabled) {
      appliedOffsetRef.current.x = 0;
      appliedOffsetRef.current.y = 0;
      appliedOffsetRef.current.z = 0;
      baseRotationRef.current.x = camera.rotation.x;
      baseRotationRef.current.y = camera.rotation.y;
      baseRotationRef.current.z = camera.rotation.z;
      return;
    }

    const pointer = pointerRef.current;
    const baseRotation = baseRotationRef.current;
    const appliedOffset = appliedOffsetRef.current;

    const externalRotationX = camera.rotation.x - appliedOffset.x;
    const externalRotationY = camera.rotation.y - appliedOffset.y;
    const externalRotationZ = camera.rotation.z - appliedOffset.z;

    baseRotation.x += (externalRotationX - baseRotation.x) * 0.5;
    baseRotation.y += (externalRotationY - baseRotation.y) * 0.5;
    baseRotation.z += (externalRotationZ - baseRotation.z) * 0.5;

    appliedOffset.x += (pointer.y * 0.05 - appliedOffset.x) * 0.01;
    appliedOffset.y += (-pointer.x * 0.05 - appliedOffset.y) * 0.01;
    appliedOffset.z += (0 - appliedOffset.z) * 0.1;

    // eslint-disable-next-line react-hooks/immutability
    camera.rotation.x = baseRotation.x + appliedOffset.x;
    camera.rotation.y = baseRotation.y + appliedOffset.y;
    camera.rotation.z = baseRotation.z + appliedOffset.z;
  });

  return null;

}
