import { useRef } from "react";
import Draggable from "react-draggable";

interface WindowProps {
  onClose?: () => void;
  windowTitle?: string;
}

export default function Window({ onClose, windowTitle }: WindowProps) {
const nodeRef = useRef(null);
  return (
    <Draggable scale={0.35} bounds={{top:-150, bottom:280,left:-70, right:430}} handle=".window__header" nodeRef={nodeRef}>
        <div ref={nodeRef}>
      <div className="window">
        <div className="window__header">
          <div className="window__header__title">{windowTitle}</div>
          <div className="window__header__buttons">
            <button className="window__header__button">_</button>
            <button className="window__header__button">[]</button>
            <button className="window__header__button" onClick={onClose}>
              X
            </button>
          </div>
        </div>
        <div className="window__content">
          <p>Hello I am Lloyd</p>
        </div>
      </div>
      </div>
    </Draggable>
  );
}
