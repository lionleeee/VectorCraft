import { ReactNode } from "react";
import { BaseProps, ChildrenProps } from "../common";

export interface BaseLayoutProps {
  children: ReactNode;
}
export interface PanelProps extends BaseProps, ChildrenProps {
  position?: "left" | "right" | "bottom";
  width?: number;
  height?: number;
}
