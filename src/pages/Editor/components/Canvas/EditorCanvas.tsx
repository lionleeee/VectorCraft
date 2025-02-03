import { useCallback } from "react";
import { CanvasProps } from "@/types/components/canvas";
import { useEditorStore } from "@/store/useEditorStore";
import { Point } from "@/types/mouse";

import {
  CircleShape,
  PolygonShape,
  RectangleShape,
  Shape,
} from "@/types/shape";
import { Circle } from "./shapes/Circle";
import { Polygon } from "./shapes/Polygon";
import { Rectangle } from "./shapes/Rectangle";
import { calculateShapeDimensions } from "@/utils/shapeCalculator";
import { Preview } from "./Preview";
import { Selection } from "./Selection";
import { isPointInShape } from "@/utils/shapeHelpers";

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
    selectedShapeId,
    mouse,
    startDrawing,
    updateDrawing,
    endDrawing,
    addShape,
    selectShape,
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
      if (selectedTool === "cursor") {
        //1. 마우스 클릭 좌표 확인
        const point = getCanvasPoint(e);
        for (let i = shapes.length - 1; i >= 0; i--) {
          //2. 도형 확인
          if (isPointInShape(point, shapes[i])) {
            //3-1. 도형 찾을 경우
            selectShape(shapes[i].id);
            return;
          }
        }
        //3-2. 도형 못 찾을 경우
        selectShape(null);
        return;
      }

      const point = getCanvasPoint(e);
      startDrawing(point);
    },
    [selectedTool, shapes, selectShape, startDrawing, getCanvasPoint]
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

    const baseShape = {
      type: selectedTool,
      fill: "#000",
      stroke: "#000000",
      strokeWidth: 1,
      rotation: 0,
    };

    let shape: Shape;

    switch (selectedTool) {
      case "rectangle":
        shape = {
          ...baseShape,
          type: "rectangle",
          borderRadius: 0,
          ...dimensions,
        } as RectangleShape;
        break;

      case "circle":
        shape = {
          ...baseShape,
          type: "circle",
          ...dimensions,
        } as CircleShape;
        break;

      case "polygon":
        shape = {
          ...baseShape,
          type: "polygon",
          sides: 3,
          ...dimensions,
        } as PolygonShape;
        break;

      default:
        endDrawing();
        return;
    }

    addShape(shape);
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
        <Preview renderShape={renderShape} />
        {selectedShapeId && (
          <Selection
            shape={shapes.find((shape) => shape.id === selectedShapeId)!}
          />
        )}
      </svg>
    </div>
  );
};
