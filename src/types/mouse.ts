export interface Point {
  x: number;
  y: number;
}

export interface MouseState {
  isDrawing: boolean;
  startPoint: Point | null;
  endPoint: Point | null;
}
