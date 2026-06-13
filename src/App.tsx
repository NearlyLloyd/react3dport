import { Canvas } from "@react-three/fiber";
import Desktop from "./models/desktop";
import "./App.css";
import Desk from "./models/desk";
// import RubiksCube from "./RubiksCube";
import { useEffect, useState } from "react";
import CameraFollowMouse from "./cameracontrols";

function App() {
  const [canAnimateCamera, setCanAnimateCamera] = useState(true);
  const [cubeFocused] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Detect mobile devices
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobileAgent = /mobile|android|iphone|ipad|ipod|webos|blackberry|windows phone/.test(userAgent);
      const isSmallScreen = window.matchMedia("(max-width: 768px)").matches;
      setIsMobile(isMobileAgent || isSmallScreen);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      const fadeDelay = window.setTimeout(() => setIsFadingOut(true), 300);
      const hideDelay = window.setTimeout(() => setShowLoadingScreen(false), 900);
      return () => {
        window.clearTimeout(fadeDelay);
        window.clearTimeout(hideDelay);
      };
    }
  }, [loadProgress]);

  if (isMobile) {
    return (
      <div className="mobile-fallback">
        <div className="mobile-content">
          <div className="mobile-header">
            <h1><mark>Lloyd Falltrick</mark></h1>
            <p><mark>Software Engineer</mark></p>
          </div>
          <div className="mobile-info">
            <p>Welcome to my portfolio! The interactive 3D experience is optimized for desktop browsers.</p>
            <p>Please visit this site on a desktop device to explore the full interactive experience.</p>
          </div>

          {/* About Me Section */}
          <div className="mobile-section">
            <button
              className="mobile-section-toggle"
              onClick={() => setExpandedSection(expandedSection === "about" ? null : "about")}
            >
              <span>About Me</span>
              <span className={`toggle-icon ${expandedSection === "about" ? "open" : ""}`}>▼</span>
            </button>
            {expandedSection === "about" && (
              <div className="mobile-section-content">
                <p>
                  I am a Brighton based software engineer enrolled in a Computer Science degree at university. I have industry experience with React, TypeScript, Node.js and Cloud Services like Azure alongside AI workflows.
                </p>
                <p>
                  I have a passion for game development and experience with game engines and graphics programming. I like to participate in hackathons and local coding events.
                </p>
                <p>
                  <strong>Skills:</strong> React, TypeScript, Node.js, Azure, Game Development, Unity, C#
                </p>
              </div>
            )}
          </div>

          {/* Projects Section */}
          <div className="mobile-section">
            <button
              className="mobile-section-toggle"
              onClick={() => setExpandedSection(expandedSection === "projects" ? null : "projects")}
            >
              <span>Projects</span>
              <span className={`toggle-icon ${expandedSection === "projects" ? "open" : ""}`}>▼</span>
            </button>
            {expandedSection === "projects" && (
              <div className="mobile-section-content">
                <div className="mobile-project">
                  <h3>3D SPA Portfolio</h3>
                  <p><strong>React, Three.js, TypeScript</strong></p>
                  <p>A single-page application featuring a 3D environment with interactive elements.</p>
                </div>
                <div className="mobile-project">
                  <h3>Cluster Analysis for ML Models</h3>
                  <p><strong>Python, Scikit-learn, Matplotlib</strong></p>
                  <p>Implemented cluster analysis to group similar data points with PCA visualization.</p>
                </div>
                <div className="mobile-project">
                  <h3>VNA Search Engine</h3>
                  <p><strong>REST API Frontend</strong></p>
                  <p>SAYT functionality and filtered responses for optimal user experience.</p>
                </div>
                <div className="mobile-project">
                  <h3>Game Prototypes</h3>
                  <p><strong>Unity, C#, HLSL, ShaderGraph</strong></p>
                  <p>Multiple game prototypes including SurvivalAspects and Voxel Dungeon Crawler.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overlay">
        <div>
          <h1><mark>Lloyd Falltrick</mark></h1>
          <p><mark>Software Engineer</mark></p>
        </div>
      </div>

      {showLoadingScreen && (
        <div className={`loading-screen${isFadingOut ? " fade-out" : ""}`}>
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
          <CameraFollowMouse
            enabled={canAnimateCamera && !cubeFocused}
            focusTarget={cubeFocused ? [0.45, 0.6, 0.55] : undefined}
            focusLookAt={cubeFocused ? [0.45, 0.35, 0.18] : undefined}
          />
          {/* <RubiksCube focused={cubeFocused} onToggleFocus={setCubeFocused} /> */}
        </Canvas>
      </div>
    </>
  );
}

export default App;
