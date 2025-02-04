import { Point } from "@/types/mouse";
import { ShapeType } from "@/types/shape";

interface CalculateShapeProps {
  startPoint: Point;
  endPoint: Point;
  type: ShapeType;
}

export const calculateShapeDimensions = ({
  startPoint,
  endPoint,
  type,
}: CalculateShapeProps) => {
  const width = Math.abs(endPoint.x - startPoint.x);
  const height = Math.abs(endPoint.y - startPoint.y);

  switch (type) {
    case "rectangle": {
      const x = Math.min(startPoint.x, endPoint.x);
      const y = Math.min(startPoint.y, endPoint.y);
      return { x, y, width, height };
    }

    case "circle": {
      const radius = Math.sqrt(width * width + height * height) / 2;
      const x = startPoint.x + (endPoint.x - startPoint.x) / 2;
      const y = startPoint.y + (endPoint.y - startPoint.y) / 2;
      return { x, y, radius };
    }

    case "polygon": {
      const x = startPoint.x + (endPoint.x - startPoint.x) / 2;
      const y = startPoint.y + (endPoint.y - startPoint.y) / 2;
      const radius = Math.sqrt(width * width + height * height) / 2;
      return { x, y, radius };
    }

    default:
      throw new Error(`알 수 없는 도형 타입: ${type}`);
  }
};
