import { Canvas } from "@react-three/fiber";
import Desktop from "./desktop";
import "./App.css";

function App() {
  return (
    <div style={{width: "100vw", height: "100vh" }}>
      <Canvas
        camera={{
          position: [0, 0, 4],
          fov: 60,
          near: 0.1,
          far: 2000,
        }}
      >
        <Desktop />
      </Canvas>
    </div>
  );
}

export default App;
