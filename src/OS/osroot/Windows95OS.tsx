import { useState } from "react";
import "./windows95.css";
import DesktopApp from "./desktopapp";
import Window from "./window";
import aboutMeIcon from "../assets/icons/aboutme.png";
import projectsIcon from "../assets/icons/projectsicon.png";
import experienceIcon from "../assets/icons/experience.png"
import AboutMe from "./applications/aboutMe";
import { Projects } from "./applications/projects";
import Experience from "./applications/experience";

type Windows95OSProps = {
  poweredOn?: boolean;
};

export default function Windows95OS({ poweredOn = false }: Windows95OSProps) {
  const [isAboutMeWindowOpen, setIsAboutMeWindowOpen] = useState(true);
  const [isProjectsWindowOpen, setIsProjectsWindowOpen] = useState(false);
  const [isExperienceWindowOpen, setIsExperienceWindowOpen] = useState(false);
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
  const [ExperienceWindowSize, setExperienceWindowSize] = useState({
    width: 500,
    height: 500,
  });
  const [ProjectsWindowPosition, setProjectsWindowPosition] = useState({
    x: 80,
    y: -180,
  });
  const [ExperienceWindowPosition, setExperienceWindowPosition] = useState({
    x: 80,
    y: -180,
  });
  const [windowOrder, setWindowOrder] = useState<
    Array<"aboutMe" | "projects" | "experience">
  >(["aboutMe"]);




  function bringWindowToFront(windowKey: "aboutMe" | "projects" | "experience") {
    setWindowOrder((prevOrder) => {
      const nextOrder = prevOrder.filter((key) => key !== windowKey);
      return [...nextOrder, windowKey];
    });
  }

  function handleWindowMaximise(windowKey: "aboutMe" | "projects" | "experience") {
    switch (windowKey) {
      case "aboutMe":
        setAboutMeWindowPosition({ x: -20, y: -290 });
        setAboutMeWindowSize((prevSize) =>
          prevSize.width === 500
            ? { width: 800, height: 640 }
            : { width: 500, height: 500 },
        );
        break;
      case "projects":
        setProjectsWindowPosition({ x: -20, y: -290 });
        setProjectsWindowSize((prevSize) =>
          prevSize.width === 500
            ? { width: 800, height: 640 }
            : { width: 500, height: 500 },
        );
        break;
      case "experience":
        setExperienceWindowPosition({ x: -20, y: -290 });
        setExperienceWindowSize((prevSize) =>
          prevSize.width === 500
            ? { width: 800, height: 640 }
            : { width: 500, height: 500 },
        );
        break;
    }
  }

  function handleWindowClose(windowKey: "aboutMe" | "projects" | "experience") {
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
  };

  const visibleWindows = windowOrder
    .filter((windowKey) =>
      windowKey === "aboutMe"
        ? isAboutMeWindowOpen
        : windowKey === "projects"
        ? isProjectsWindowOpen
        : isExperienceWindowOpen,
    )
    .map((windowKey) => ({
      key: windowKey,
      element: windowComponents[windowKey],
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
          
        {visibleWindows.map(({ key, element }) => (
          <div key={key} onMouseDown={() => bringWindowToFront(key)}>
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
