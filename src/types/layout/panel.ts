import { BaseProps, ChildrenProps } from "../common";

export interface PanelProps extends BaseProps, ChildrenProps {
  position?: "left" | "right" | "bottom";
  width?: number;
  height?: number;
}
