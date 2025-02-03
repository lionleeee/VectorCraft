import { Point } from "@/types/mouse";
import { Shape } from "@/types/shape";

export const calculatePolygonPoints = (
  centerX: number,
  centerY: number,
  radius: number,
  sides: number
): string => {
  const points: string[] = [];
  const angleStep = (Math.PI * 2) / sides;

  for (let i = 0; i < sides; i++) {
    const angle = i * angleStep - Math.PI / 2; // -90도에서 시작
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push(`${x},${y}`);
  }

  return points.join(" ");
};

export const isPointInShape = (point: Point, shape: Shape): boolean => {
  switch (shape.type) {
    case "rectangle": {
      return (
        point.x >= shape.x &&
        point.x <= shape.x + shape.width &&
        point.y >= shape.y &&
        point.y <= shape.y + shape.height
      );
    }
    case "circle": {
      const dx = point.x - shape.x;
      const dy = point.y - shape.y;
      return dx * dx + dy * dy <= shape.radius * shape.radius;
    }
    case "polygon": {
      const dx = point.x - shape.x;
      const dy = point.y - shape.y;
      return dx * dx + dy * dy <= shape.radius * shape.radius;
    }
  }
};
