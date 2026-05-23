import { useState } from "react";
import "./windows95.css";
import DesktopApp from "./desktopapp";
import Window from "./window";
import aboutMeIcon from "../assets/icons/aboutme.png";
import projectsIcon from "../assets/icons/projectsicon.png";
import experienceIcon from "../assets/icons/experience.png";
import paintIcon from "../assets/icons/paint.png";
import AboutMe from "./applications/aboutMe";
import { Projects } from "./applications/projects";
import Experience from "./applications/experience";
import { Paint } from "./applications/paint";

type Windows95OSProps = {
  poweredOn?: boolean;
  moveCameraBack?: () => void;
};

export default function Windows95OS({ poweredOn = false, moveCameraBack }: Windows95OSProps) {
  const [isAboutMeWindowOpen, setIsAboutMeWindowOpen] = useState(true);
  const [isProjectsWindowOpen, setIsProjectsWindowOpen] = useState(false);
  const [isExperienceWindowOpen, setIsExperienceWindowOpen] = useState(false);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [isPaintWindowOpen, setIsPaintWindowOpen] = useState(false);
  const [PaintWindowSize, setPaintWindowSize] = useState({
    width: 1000,
    height: 1000,
  });
  const [PaintWindowPosition, setPaintWindowPosition] = useState({
    x: 440,
    y: -100,
  });
  const [AboutMeWindowSize, setAboutMeWindowSize] = useState({
    width: 1000,
    height: 1000,
  });
  const [AboutMeWindowPosition, setAboutMeWindowPosition] = useState({
    x: 350,
    y: -220,
  });
  const [ProjectsWindowSize, setProjectsWindowSize] = useState({
    width: 1000,
    height: 1000,
  });
  const [ExperienceWindowSize, setExperienceWindowSize] = useState({
    width: 1000,
    height: 1000,
  });
  const [ProjectsWindowPosition, setProjectsWindowPosition] = useState({
    x: 380,
    y: -180,
  });
  const [ExperienceWindowPosition, setExperienceWindowPosition] = useState({
    x: 410,
    y: -140,
  });
  const [windowOrder, setWindowOrder] = useState<
    Array<"aboutMe" | "projects" | "experience" | "paint">
  >(["aboutMe"]);




  function bringWindowToFront(windowKey: "aboutMe" | "projects" | "experience" | "paint") {
    setWindowOrder((prevOrder) => {
      const nextOrder = prevOrder.filter((key) => key !== windowKey);
      return [...nextOrder, windowKey];
    });
  }

  function handleWindowMaximise(windowKey: "aboutMe" | "projects" | "experience" | "paint") {
    switch (windowKey) {
      case "aboutMe":
        setAboutMeWindowPosition({ x: -20, y: -520 });
        setAboutMeWindowSize((prevSize) =>
          prevSize.width === 1000
            ? { width: 1700, height: 1356 }
            : { width: 1000, height: 1000 },
        );
        break;
      case "projects":
        setProjectsWindowPosition({ x: -20, y: -520 });
        setProjectsWindowSize((prevSize) =>
          prevSize.width === 1000
            ? { width: 1700, height: 1356 }
            : { width: 1000, height: 1000 },
        );
        break;
      case "experience":
        setExperienceWindowPosition({ x: -20, y: -520 });
        setExperienceWindowSize((prevSize) =>
          prevSize.width === 1000
            ? { width: 1700, height: 1356 }
            : { width: 1000, height: 1000 },
        );
        break;
      case "paint":
        setPaintWindowPosition({ x: -20, y: -520 });
        setPaintWindowSize((prevSize) =>
          prevSize.width === 1000
            ? { width: 1700, height: 1356 }
            : { width: 1000, height: 1000 },
        );
        break;
    }
  }

  function handleWindowClose(windowKey: "aboutMe" | "projects" | "experience" | "paint") {
    switch (windowKey) {
      case "aboutMe":
        setIsAboutMeWindowOpen(false);
        break;
      case "projects":
        setIsProjectsWindowOpen(false);
        break;
      case "experience":
        setIsExperienceWindowOpen(false);
        break;
      case "paint":
        setIsPaintWindowOpen(false);
        break;
    }

    setWindowOrder((prevOrder) => prevOrder.filter((key) => key !== windowKey));
  }

  const windowComponents = {
    aboutMe: (
      <Window
        application={<AboutMe />}
        windowTitle="AboutMe.exe"
        onClose={() => handleWindowClose("aboutMe")}
        onMaximise={() => handleWindowMaximise("aboutMe")}
        onFocus={() => bringWindowToFront("aboutMe")}
        zIndex={windowOrder.indexOf("aboutMe") + 1}
        windowSize={AboutMeWindowSize}
        windowPosition={AboutMeWindowPosition}
        onPositionChange={setAboutMeWindowPosition}
      />
    ),
    projects: (
      <Window
        application={<Projects />}
        windowTitle="Projects.exe"
        onClose={() => handleWindowClose("projects")}
        onMaximise={() => handleWindowMaximise("projects")}
        onFocus={() => bringWindowToFront("projects")}
        zIndex={windowOrder.indexOf("projects") + 1}
        windowSize={ProjectsWindowSize}
        windowPosition={ProjectsWindowPosition}
        onPositionChange={setProjectsWindowPosition}
      />
    ),
    experience: (
      <Window
        application={<Experience />}
        windowTitle="Experience.exe"
        onClose={() => handleWindowClose("experience")}
        onMaximise={() => handleWindowMaximise("experience")}
        onFocus={() => bringWindowToFront("experience")}
        zIndex={windowOrder.indexOf("experience") + 1}
        windowSize={ExperienceWindowSize}
        windowPosition={ExperienceWindowPosition}
        onPositionChange={setExperienceWindowPosition}
      />
    ),
    paint: (
      <Window
        application={<Paint />}
        windowTitle="Paint.exe"
        onClose={() => handleWindowClose("paint")}
        onMaximise={() => handleWindowMaximise("paint")}
        onFocus={() => bringWindowToFront("paint")}
        zIndex={windowOrder.indexOf("paint") + 1}
        windowSize={PaintWindowSize}
        windowPosition={PaintWindowPosition}
        onPositionChange={setPaintWindowPosition}
      />
    )
  };

  const visibleWindows = windowOrder
    .filter((windowKey) => {
      switch (windowKey) {
        case "aboutMe":
          return isAboutMeWindowOpen;
        case "projects":
          return isProjectsWindowOpen;
        case "experience":
          return isExperienceWindowOpen;
        case "paint":
          return isPaintWindowOpen;
        default:
          return false;
      }
    }
    )
    .map((windowKey) => ({
      key: windowKey,
      element: windowComponents[windowKey],
      icon:
        windowKey === "aboutMe"
          ? aboutMeIcon
          : windowKey === "projects"
            ? projectsIcon
            : windowKey === "experience"
              ? experienceIcon
              : paintIcon,
    }));

  return (
    <div className={`windows95OS ${poweredOn ? "is-on" : "is-off"}`}>
      <div className="windows95OS__screen">
        <DesktopApp
          name="AboutMe.exe"
          icon={aboutMeIcon}
          onClick={() => {
            setIsAboutMeWindowOpen(true);
            bringWindowToFront("aboutMe");
          }}
        />

        <DesktopApp
          name="Projects.exe"
          icon={projectsIcon}
          onClick={() => {
            setIsProjectsWindowOpen(true);
            bringWindowToFront("projects");
          }}
        />

        <DesktopApp
          name="Experience"
          icon={experienceIcon}
          onClick={() => {
            setIsExperienceWindowOpen(true);
            bringWindowToFront("experience");
          }} />
        <DesktopApp
          name="paint"
          icon={paintIcon}
          onClick={() => {
            setIsPaintWindowOpen(true);
            bringWindowToFront("paint");
          }}
        />

        {visibleWindows.map(({ key, element }) => (
          <div key={key} onMouseDown={() => bringWindowToFront(key)}>
            {element}
          </div>
        ))}
        {isStartMenuOpen && (
          <div id="startMenu">
            <div style={{ backgroundColor: "red" }} className="startMenuItem" onClick={() => { setIsStartMenuOpen(false); moveCameraBack?.(); }}>
              Log out
            </div>
          </div>
        )}

        <div id="taskbarWrapper">
          <div id="systemTray">
            <div id="startButton" onClick={() => { setIsStartMenuOpen(!isStartMenuOpen); }}>
              Start
            </div>
            {visibleWindows.map((i) => (
              <div onClick={() => bringWindowToFront(i.key)} className="tray-item">
                <img width="24" height="24" src={i.icon} alt={i.key} style={{ marginRight: "5px" }} />
                {i.key}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
