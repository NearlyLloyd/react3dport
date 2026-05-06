
import { useState } from "react";
import "./windows95.css";
import DesktopApp from "./desktopapp";
import Window from "./window";
import aboutMeIcon from "../assets/icons/aboutme.png";
import AboutMe from "./applications/aboutMe";

export default function Windows95OS() {
  const [isAboutMeWindowOpen, setIsAboutMeWindowOpen] = useState(true);
  return (
    <div className="windows95OS">
      <div className="windows95OS__screen">
        <DesktopApp
          name="AboutMe.exe"
          icon={aboutMeIcon}
          onClick={() => setIsAboutMeWindowOpen(true)}
        />
        {isAboutMeWindowOpen ? <Window application={<AboutMe/>} windowTitle="AboutMe.exe" onClose={() => setIsAboutMeWindowOpen(false)} /> : null}
        <div id="taskbarWrapper">
          <div id="startButton">Start</div>
        </div>
      </div>
    </div>
  );
}