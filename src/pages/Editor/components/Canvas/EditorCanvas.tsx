import { useCallback } from "react";
import { CanvasProps } from "@/types/components/canvas";
import { useEditorStore } from "@/store/useEditorStore";
import { Point } from "@/types/mouse";

import { Shape } from "@/types/shape";
import { Circle } from "./shapes/Circle";
import { Polygon } from "./shapes/Polygon";
import { Rectangle } from "./shapes/Rectangle";

const ShapeComponents: Record<
  Shape["type"],
  React.ComponentType<{ shape: Shape }>
> = {
  rectangle: Rectangle as React.ComponentType<{ shape: Shape }>,
  circle: Circle as React.ComponentType<{ shape: Shape }>,
  polygon: Polygon as React.ComponentType<{ shape: Shape }>,
};

export const EditorCanvas = ({
  width,
  height,
  backgroundColor,
}: CanvasProps) => {
  const { shapes, startDrawing, updateDrawing, endDrawing } = useEditorStore();

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

  const renderShape = (shape: Shape) => {
    const Component = ShapeComponents[shape.type];
    return <Component key={shape.id} shape={shape} />;
  };

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
      <svg width={width} height={height}>
        {shapes.map(renderShape)}
      </svg>
    </div>
  );
};
