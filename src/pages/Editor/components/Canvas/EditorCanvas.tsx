import { useCallback } from "react";
import { CanvasProps } from "@/types/components/canvas";
import { useEditorStore } from "@/store/useEditorStore";
import { Point } from "@/types/mouse";

export const EditorCanvas = ({
  width,
  height,
  backgroundColor,
}: CanvasProps) => {
  const { startDrawing, updateDrawing, endDrawing } = useEditorStore();

  const getCanvasPoint = useCallback((e: React.MouseEvent): Point => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      const point = getCanvasPoint(e);
      startDrawing(point);
    },
    [startDrawing, getCanvasPoint]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const point = getCanvasPoint(e);
      updateDrawing(point);
    },
    [updateDrawing, getCanvasPoint]
  );

  const handleMouseUp = useCallback(() => {
    endDrawing();
  }, [endDrawing]);

  if (!width || !height) {
    return null;
  }

  return (
    <div
      className="relative border border-gray-300"
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* SVG 요소 추가 */}
    </div>
  );
};
