export type ToolType = "cursor" | "rectangle" | "circle" | "polygon" | "text";

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
  sides: number;
}

export interface TextSettings extends BaseToolSettings {
  text: string;
  fontSize: number;
  fontFamily: string;
}

export type ToolSettings =
  | RectangleSettings
  | CircleSettings
  | PolygonSettings
  | TextSettings;
