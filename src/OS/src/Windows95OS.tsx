
import { useState } from "react";
import "./windows95.css";
import DesktopApp from "./desktopapp";
import Window from "./window";
import aboutMeIcon from "../assets/icons/aboutme.png";

export default function Windows95OS() {
  const [isAboutMeWindowOpen, setIsAboutMeWindowOpen] = useState(false);

  return (
    <div className="windows95OS">
      <div className="windows95OS__screen">
        <DesktopApp
          name="About Me"
          icon={aboutMeIcon}
          onClick={() => setIsAboutMeWindowOpen(true)}
        />
        {isAboutMeWindowOpen ? <Window windowTitle="About Me" onClose={() => setIsAboutMeWindowOpen(false)} /> : null}
        <div id="taskbarWrapper">
          <div id="startButton">Start</div>
        </div>
      </div>
    </div>
  );
}