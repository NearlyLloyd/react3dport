
import "./windows95.css";
import DesktopApp from "./desktopapp";
import aboutMeIcon from "../assets/icons/aboutme.png";
export default function Windows95OS() {
  return (
    <div className="windows95OS">
      <div className="windows95OS__screen">
        <DesktopApp name="About Me" icon={aboutMeIcon} onClick={() => alert("About Me clicked!")} />
        <div id="taskbarWrapper">
          <div id="startButton">Start</div>
        </div>
      </div>
    </div>
  );
}