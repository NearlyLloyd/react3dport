import { Canvas } from "@react-three/fiber";
import Desktop from "./models/desktop";
import "./App.css";
import Desk from "./models/desk";
import CameraFollowMouse from "./cameracontrols";
import { useEffect, useState } from "react";

function App() {
  const [canAnimateCamera, setCanAnimateCamera] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setLoadProgress(prev => {
        if (prev >= 100) return 100;
        const increment = prev < 30 ? 4 : prev < 70 ? 2 : 1;
        return Math.min(100, prev + increment);
      });
    }, 45);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loadProgress >= 100) {
      const timeout = window.setTimeout(() => setIsLoading(false), 500);
      return () => window.clearTimeout(timeout);
    }
  }, [loadProgress]);

  return (
    <>
      <div className="overlay">
        <div>
          <h1><mark>Lloyd Falltrick</mark></h1>
          <p><mark>Software Engineer</mark></p>
        </div>
      </div>

      {isLoading && (
        <div className="loading-screen">
          <div className="loading-window">
            <div className="loading-window__titlebar">
              <span>Lloyd's Portfolio</span>
            </div>
            <div className="loading-window__body">
              <p className="loading-headline">Starting Portfolio</p>
              <p>Please wait while your system is being prepared...</p>
              <div className="progress-box">
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${loadProgress}%` }} />
                </div>
                <div className="progress-label">Loading... {loadProgress}%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="three-container">
        <Canvas
          style={{ width: "100%", height: "100%" }}
          camera={{
            position: [0.8, 0.2, 1.3],
            fov: 60,
            near: 0.01,
            far: 2000,
            rotation: [-0.4, 0.7, 0.3],
          }
          }
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
