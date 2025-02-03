import { RectangleShape } from "@/types/shape";

interface RectangleProps {
  shape: RectangleShape;
}

export const Rectangle = ({ shape }: RectangleProps) => {
  const { x, y, width, height, fill, stroke, strokeWidth, borderRadius } =
    shape;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      rx={borderRadius}
      ry={borderRadius}
    />
  );
};
