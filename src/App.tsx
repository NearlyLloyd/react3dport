import { Canvas } from "@react-three/fiber";
import Desktop from "./desktop";
import "./App.css";
import Desk from "./desk";
import CameraFollowMouse from "./cameracontrols";
import { useState } from "react";

function App() {
  const [canAnimateCamera, setCanAnimateCamera] = useState(true);

  return (
    <>
    <div className="overlay">
      <div>
      <h1>Lloyd Falltrick</h1>
      <p>Software Engineer</p>
      </div>
    </div>  
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas
        camera={{
          position: [0.8, 0.2, 1.7],
          fov: 60,
          near: 0.01,
          far: 2000,
          rotation: [-0.4, 0.7, 0.3],
        }}
      >
        <Desktop setCanAnimateCamera={setCanAnimateCamera} />

        <Desk />
        <CameraFollowMouse enabled={canAnimateCamera} />
      </Canvas>
    </div>
    </>
  );
}

export default App;
