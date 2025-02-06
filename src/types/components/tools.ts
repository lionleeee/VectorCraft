import { ShapeType } from "../shape";

export type ToolType = ShapeType | "cursor";

interface BaseToolSettings {
  fill: string;
  stroke: string;
  strokeWidth: number;
}

export interface RectangleSettings extends BaseToolSettings {
  width: number;
  height: number;
}

export interface CircleSettings extends BaseToolSettings {
  radius: number;
}

export interface PolygonSettings extends BaseToolSettings {
  radius: number;
  sides: number;
}

export interface TextSettings extends BaseToolSettings {
  text: string;
  fontSize: number;
  fontFamily: string;
}

export interface ToolSettings {
  rectangle: RectangleSettings;
  circle: CircleSettings;
  polygon: PolygonSettings;
}
