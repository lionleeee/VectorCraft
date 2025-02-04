import { CircleShape } from "@/types/shape";

interface CircleProps {
  shape: CircleShape;
}

export const Circle = ({ shape }: CircleProps) => {
  const { x, y, radius, fill, stroke, strokeWidth } = shape;

  return (
    <circle
      cx={x}
      cy={y}
      r={radius}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
};
