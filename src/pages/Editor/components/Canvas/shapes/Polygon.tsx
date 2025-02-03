import { PolygonShape } from "@/types/shape";
import { calculatePolygonPoints } from "@/utils/shapeHelpers";

interface PolygonProps {
  shape: PolygonShape;
}

export const Polygon = ({ shape }: PolygonProps) => {
  const { x, y, radius, sides, fill, stroke, strokeWidth } = shape;
  const points = calculatePolygonPoints(x, y, radius, sides);

  return (
    <polygon
      points={points}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
    />
  );
};
