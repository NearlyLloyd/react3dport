import { useRef, type JSX } from "react";
import Draggable, {
  type DraggableData,
  type DraggableEvent,
} from "react-draggable";
import { ResizableBox } from "react-resizable";
import "react-resizable/css/styles.css";

interface WindowProps {
  onClose?: () => void;
  onMaximise?: () => void;
  windowSize?: { width: number; height: number };
  windowPosition?: { x: number; y: number };
  windowTitle?: string;
  application?: JSX.Element;
  onFocus?: () => void;
  zIndex?: number;
  onPositionChange?: (position: { x: number; y: number }) => void;
}

export default function Window({
  onClose,
  onMaximise,
  windowSize = { width: 1000, height: 1000 },
  windowPosition = { x: 80, y: -200 },
  windowTitle,
  application,
  onFocus,
  zIndex,
  onPositionChange,
}: WindowProps) {
  const nodeRef = useRef<HTMLDivElement>(null);

  function handleDrag(_event: DraggableEvent, data: DraggableData) {
    onPositionChange?.({ x: data.x, y: data.y });
  }


  return (
      <Draggable
        defaultClassName="window__container"
        position={windowPosition}
        onDrag={handleDrag}
        scale={0.6}
        bounds={{ top: -390, bottom: 850, left: -20, right: 1280}}
        handle=".window__header"
        nodeRef={nodeRef}
        
      >
        <div ref={nodeRef} style={{ zIndex }} onMouseDown={onFocus}>
          <ResizableBox
            className="window__frame"
            resizeHandles={["e", "s", "se"]}
            lockAspectRatio={false}
            handleSize={[20, 20]}
            axis="both"
            width={windowSize.width}
            height={windowSize.height}
            draggableOpts={{ grid: [25, 25] }}
            minConstraints={[400, 400]}
            maxConstraints={[1700, 1356]}
            transformScale={1}
          >
            <div className="window">
              <div className="window__header">
                <div className="window__header__title">{windowTitle}</div>
                <div className="window__header__buttons">
                  <button className="window__header__button" onClick={onMaximise}>
                    <b>[]</b>
                  </button>
                  <button className="window__header__button" onClick={onClose}>
                    <b>X</b>
                  </button>
                </div>
              </div>
              <div className="window__content">{application}</div>
            </div>
          </ResizableBox>
        </div>
      </Draggable>
  );
}
