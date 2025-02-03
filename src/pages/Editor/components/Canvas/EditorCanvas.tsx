import { useCallback } from "react";
import { CanvasProps } from "@/types/components/canvas";
import { useEditorStore } from "@/store/useEditorStore";
import { Point } from "@/types/mouse";

import { Shape } from "@/types/shape";
import { Circle } from "./shapes/Circle";
import { Polygon } from "./shapes/Polygon";
import { Rectangle } from "./shapes/Rectangle";
import { calculateShapeDimensions } from "@/utils/shapeCalculator";

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
  const {
    shapes,
    selectedTool,
    mouse,
    startDrawing,
    updateDrawing,
    endDrawing,
    addShape,
  } = useEditorStore();

  const getCanvasPoint = useCallback((e: React.MouseEvent): Point => {
    const rect = e.currentTarget.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (selectedTool === "cursor") return;
      const point = getCanvasPoint(e);
      startDrawing(point);
    },
    [startDrawing, getCanvasPoint, selectedTool]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!mouse.isDrawing || selectedTool === "cursor") return;
      const point = getCanvasPoint(e);
      updateDrawing(point);
    },
    [updateDrawing, getCanvasPoint, mouse.isDrawing, selectedTool]
  );

  const handleMouseUp = useCallback(() => {
    if (
      !mouse.isDrawing ||
      !mouse.startPoint ||
      !mouse.endPoint ||
      selectedTool === "cursor"
    ) {
      endDrawing();
      return;
    }

    const dimensions = calculateShapeDimensions({
      startPoint: mouse.startPoint,
      endPoint: mouse.endPoint,
      type: selectedTool,
    });

    addShape({
      type: selectedTool,
      ...dimensions,
      styles: {
        fill: "#000",
        stroke: "#000000",
        strokeWidth: 1,
        rotation: 0,
      },
    });

    endDrawing();
  }, [mouse, selectedTool, addShape, endDrawing]);

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
