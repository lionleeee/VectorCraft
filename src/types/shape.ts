export type ShapeType = "rectangle" | "circle" | "polygon";

interface BaseShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  rotation: number;
}

export interface RectangleShape extends BaseShape {
  type: "rectangle";
  width: number;
  height: number;
  borderRadius: number;
}

export interface CircleShape extends BaseShape {
  type: "circle";
  radius: number;
  startAngle: number;
  endAngle: number;
}

export interface PolygonShape extends BaseShape {
  type: "polygon";
  radius: number;
  sides: number;
}

export type Shape = RectangleShape | CircleShape | PolygonShape;

export type ShapeStyles = Omit<BaseShape, "id" | "type" | "x" | "y">;

export interface CreateShapeProps {
  type: ShapeType;
  x: number;
  y: number;
  styles: ShapeStyles;
}
