import { useState } from "react";
import "./windows95.css";
import DesktopApp from "./desktopapp";
import Window from "./window";
import aboutMeIcon from "../assets/icons/aboutme.png";
import projectsIcon from "../assets/icons/projectsicon.png";
import AboutMe from "./applications/aboutMe";
import { Projects } from "./applications/projects";

type Windows95OSProps = {
  poweredOn?: boolean;
};

export default function Windows95OS({ poweredOn = false }: Windows95OSProps) {
  const [isAboutMeWindowOpen, setIsAboutMeWindowOpen] = useState(true);
  const [isProjectsWindowOpen, setIsProjectsWindowOpen] = useState(false);
  const [AboutMeWindowSize, setAboutMeWindowSize] = useState({
    width: 500,
    height: 500,
  });
  const [AboutMeWindowPosition, setAboutMeWindowPosition] = useState({
    x: 80,
    y: -180,
  });
  const [ProjectsWindowSize, setProjectsWindowSize] = useState({
    width: 500,
    height: 500,
  });
  const [ProjectsWindowPosition, setProjectsWindowPosition] = useState({
    x: 80,
    y: -180,
  });
  const [focusedWindow, setFocusedWindow] = useState<
    "aboutMe" | "projects" | null
  >("aboutMe");




  function handleWindowMaximise(windowKey: "aboutMe" | "projects") {
    switch (windowKey) {
      case "aboutMe":
        setAboutMeWindowPosition({ x: -20, y: -200 });
        setAboutMeWindowSize((prevSize) =>
          prevSize.width === 500
            ? { width: 800, height: 640 }
            : { width: 500, height: 500 },
        );
        break;
      case "projects":
        setProjectsWindowPosition({ x: -20, y: -200 });
        setProjectsWindowSize((prevSize) =>
          prevSize.width === 500
            ? { width: 800, height: 640 }
            : { width: 500, height: 500 },
        );
        break;
    }
  }
  function handleWindowClose(windowKey: "aboutMe" | "projects") {
    if (windowKey === "aboutMe") {
      setIsAboutMeWindowOpen(false);
      setFocusedWindow(isProjectsWindowOpen ? "projects" : null);
    } else if (windowKey === "projects") {
      setIsProjectsWindowOpen(false);
      setFocusedWindow(isAboutMeWindowOpen ? "aboutMe" : null);
    }
  }
  const windows = [
    isAboutMeWindowOpen
      ? {
          key: "aboutMe" as const,
          element: (
            <Window
              application={<AboutMe />}
              windowTitle="AboutMe.exe"
              onClose={() => handleWindowClose("aboutMe")}
              onMaximise={() => handleWindowMaximise("aboutMe")}
              onFocus={() => setFocusedWindow("aboutMe")}
              zIndex={focusedWindow === "aboutMe" ? 2 : 1}
              windowSize={AboutMeWindowSize}
              windowPosition={AboutMeWindowPosition}
              onPositionChange={setAboutMeWindowPosition}
            />
          ),
        }
      : null,
    isProjectsWindowOpen
      ? {
          key: "projects" as const,
          element: (
            <Window
              application={<Projects />}
              windowTitle="Projects.exe"
              onClose={() => handleWindowClose("projects")}
              onMaximise={() => handleWindowMaximise("projects")}
              onFocus={() => setFocusedWindow("projects")}
              zIndex={focusedWindow === "projects" ? 2 : 1}
              windowSize={ProjectsWindowSize}
              windowPosition={ProjectsWindowPosition}
              onPositionChange={setProjectsWindowPosition}
            />
          ),
        }
      : null,
  ].filter(
    (windowConfig): windowConfig is NonNullable<typeof windowConfig> =>
      windowConfig !== null,
  );
  const sortedWindows = [...windows].sort((left, right) => {
    if (left.key === focusedWindow && right.key !== focusedWindow) return 1;
    if (right.key === focusedWindow && left.key !== focusedWindow) return -1;
    return 0;
  });

  return (
    <div className={`windows95OS ${poweredOn ? "is-on" : "is-off"}`}>
      <div className="windows95OS__screen">
        <DesktopApp
          name="AboutMe.exe"
          icon={aboutMeIcon}
          onClick={() => {
            setIsAboutMeWindowOpen(true);
            setFocusedWindow("aboutMe");
          }}
        />

        <DesktopApp
          name="Projects.exe"
          icon={projectsIcon}
          onClick={() => {
            setIsProjectsWindowOpen(true);
            setFocusedWindow("projects");
          }}
        />

        {sortedWindows.map(({ key, element }) => (
          <div key={key} onMouseDown={() => setFocusedWindow(key)}>
            {element}
          </div>
        ))}

        <div id="taskbarWrapper">
          <div id="startButton">Start</div>
        </div>
      </div>
    </div>
  );
}
