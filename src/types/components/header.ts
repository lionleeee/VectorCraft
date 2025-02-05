import { RefObject } from "react";

export interface HeaderProps {
  onReset: () => void;
  canvasRef: RefObject<HTMLDivElement>;
}
