import { Shape } from "@/types/shape";
import { Point } from "@/types/mouse";

interface SelectionProps {
  shape: Shape;
  onStartResize: (handle: string, point: Point) => void;
}

const HANDLE_SIZE = 8;
const ROTATE_HANDLE_OFFSET = 20;

export const Selection = ({ shape, onStartResize }: SelectionProps) => {
  const getBoundingBox = () => {
    switch (shape.type) {
      case "rectangle":
        return {
          x: shape.x,
          y: shape.y,
          width: shape.width,
          height: shape.height,
        };
      case "circle":
      case "polygon": {
        const size = shape.radius * 2;
        return {
          x: shape.x - shape.radius,
          y: shape.y - shape.radius,
          width: size,
          height: size,
        };
      }
    }
  };

  const box = getBoundingBox();

  const handleMouseDown = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    // SVG 요소의 좌표계로 변환
    const svg = e.currentTarget.closest("svg");
    if (!svg) return;

    const svgRect = svg.getBoundingClientRect();
    const point = {
      x: e.clientX - svgRect.left,
      y: e.clientY - svgRect.top,
    };
    onStartResize(handle, point);
  };

  const handleRotateMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const renderHandle = (position: string, x: number, y: number) => (
    <rect
      x={x - HANDLE_SIZE / 2}
      y={y - HANDLE_SIZE / 2}
      width={HANDLE_SIZE}
      height={HANDLE_SIZE}
      fill="white"
      stroke="#0B7FFF"
      strokeWidth={1}
      style={{ cursor: `${position}-resize` }}
      onMouseDown={(e) => handleMouseDown(e, position)}
    />
  );

  return (
    <g>
      <rect
        x={box.x - 1}
        y={box.y - 1}
        width={box.width + 2}
        height={box.height + 2}
        fill="none"
        stroke="#0B7FFF"
        strokeWidth={1}
        strokeDasharray="4 4"
        pointerEvents="none"
      />
      {renderHandle("nw", box.x, box.y)}
      {renderHandle("ne", box.x + box.width, box.y)}
      {renderHandle("se", box.x + box.width, box.y + box.height)}
      {renderHandle("sw", box.x, box.y + box.height)}

      <line
        x1={box.x + box.width / 2}
        y1={box.y}
        x2={box.x + box.width / 2}
        y2={box.y - ROTATE_HANDLE_OFFSET}
        stroke="#0B7FFF"
        strokeWidth={1}
      />
      <circle
        cx={box.x + box.width / 2}
        cy={box.y - ROTATE_HANDLE_OFFSET}
        r={4}
        fill="white"
        stroke="#0B7FFF"
        strokeWidth={1}
        style={{ cursor: "grab" }}
        onMouseDown={handleRotateMouseDown}
      />
    </g>
  );
};
