import { useRef, type JSX } from "react";
import Draggable from "react-draggable";

interface WindowProps {
  onClose?: () => void;
  windowTitle?: string;
  application?: JSX.Element;
}

export default function Window({ onClose, windowTitle, application }: WindowProps) {
const nodeRef = useRef(null);
  return (
    <Draggable defaultPosition={{x: 80, y: -80}} scale={0.35} bounds={{top:-155, bottom:280,left:-70, right:430}} handle=".window__header" nodeRef={nodeRef}>
        <div ref={nodeRef}>
      <div className="window">
        <div className="window__header">
          <div className="window__header__title">{windowTitle}</div>
          <div className="window__header__buttons">
            <button className="window__header__button" onClick={onClose}>
              <b>X</b>
            </button>
          </div>
        </div>
        <div className="window__content">
          {application}
        </div>
      </div>
      </div>
    </Draggable>
  );
}
