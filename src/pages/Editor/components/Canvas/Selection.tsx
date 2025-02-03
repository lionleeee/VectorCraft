import { Shape } from "@/types/shape";

interface SelectionProps {
  shape: Shape;
}

export const Selection = ({ shape }: SelectionProps) => {
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

  return (
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
  );
};
