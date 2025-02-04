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

import { calculateShapeDimensions } from "@/utils/shapeCalculator";
import { Preview } from "./Preview";
import { Selection } from "./Selection";
import { isPointInShape, shapeComponentsMapper } from "@/utils/shapeHelpers";

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
    drag,
    resize,
    startDrawing,
    updateDrawing,
    endDrawing,
    addShape,
    selectShape,
    startDragging,
    updateDragging,
    endDragging,
    startResize,
    updateResize,
    endResize,
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
      //1. 마우스 클릭 좌표 확인
      const point = getCanvasPoint(e);
      if (selectedTool === "cursor") {
        //2. 도형 확인
        for (let i = shapes.length - 1; i >= 0; i--) {
          if (isPointInShape(point, shapes[i])) {
            //3-1. 도형 찾을 경우
            selectShape(shapes[i].id);
            // 드래그 시작
            startDragging(point, { x: shapes[i].x, y: shapes[i].y });
            return;
          }
        }
        //3-2. 도형 못 찾을 경우
        selectShape(null);
        return;
      }

      startDrawing(point);
    },
    [
      selectedTool,
      shapes,
      selectShape,
      startDrawing,
      getCanvasPoint,
      startDragging,
    ]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const point = getCanvasPoint(e);

      if (selectedTool === "cursor") {
        if (resize.isResizing) {
          updateResize(point);
          return;
        }
        if (drag.isDragging) {
          updateDragging(point);
          return;
        }
        return;
      }

      if (!mouse.isDrawing) return;
      updateDrawing(point);
    },
    [
      selectedTool,
      mouse.isDrawing,
      drag.isDragging,
      resize.isResizing,
      updateDrawing,
      updateDragging,
      updateResize,
      getCanvasPoint,
    ]
  );

  const handleMouseUp = useCallback(() => {
    if (resize.isResizing) {
      endResize();
      return;
    }
    if (drag.isDragging) {
      endDragging();
      return;
    }

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

    const newShape =
      {
        rectangle: {
          ...baseShape,
          type: "rectangle" as const,
          borderRadius: 0,
          ...dimensions,
        } as RectangleShape,
        circle: {
          ...baseShape,
          type: "circle" as const,
          ...dimensions,
        } as CircleShape,
        polygon: {
          ...baseShape,
          type: "polygon" as const,
          sides: 3,
          ...dimensions,
        } as PolygonShape,
      }[selectedTool] ?? null;

    if (newShape) addShape(newShape);
    endDrawing();
  }, [
    resize.isResizing,
    drag.isDragging,
    endResize,
    endDragging,
    mouse,
    selectedTool,
    addShape,
    endDrawing,
  ]);

  const handleStartResize = useCallback(
    (handle: string, point: Point) => {
      const selectedShape = shapes.find(
        (shape) => shape.id === selectedShapeId
      );
      if (!selectedShape) return;
      startResize(handle, point, selectedShape);
    },
    [shapes, selectedShapeId, startResize]
  );

  const renderShape = (shape: Shape) => {
    const Component = shapeComponentsMapper[shape.type];
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
            onStartResize={handleStartResize}
          />
        )}
      </svg>
    </div>
  );
};
