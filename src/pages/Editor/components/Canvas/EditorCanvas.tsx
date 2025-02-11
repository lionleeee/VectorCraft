import { forwardRef, useCallback } from "react";
import { CanvasProps } from "@/types/components/canvas";
import { useShapeStore } from "@/store/useShapeStore";
import { useToolStore } from "@/store/useToolStore";
import { Point } from "@/types/mouse";
import { useParams } from "react-router-dom";

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
import { shapeService } from "@/services/shapeService";

export const EditorCanvas = forwardRef<HTMLDivElement, CanvasProps>(
  ({ width, height, backgroundColor }, ref) => {
    const {
      shapes,
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
    } = useShapeStore();

    const { selectedTool, toolSettings } = useToolStore();
    const { canvasId } = useParams();

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

        if (selectedTool === "cursor") {
          for (let i = shapes.length - 1; i >= 0; i--) {
            if (isPointInShape(point, shapes[i])) {
              selectShape(shapes[i].id);
              startDragging(point, { x: shapes[i].x, y: shapes[i].y });
              return;
            }
          }
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
      if (!canvasId) return;

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

      const baseToolSettings = toolSettings[selectedTool];

      const newShape =
        {
          rectangle: {
            ...baseToolSettings,
            type: "rectangle" as const,
            borderRadius: 0,
            ...dimensions,
          } as RectangleShape,
          circle: {
            ...baseToolSettings,
            type: "circle" as const,
            ...dimensions,
          } as CircleShape,
          polygon: {
            ...baseToolSettings,
            type: "polygon" as const,
            ...dimensions,
          } as PolygonShape,
        }[selectedTool] ?? null;

      if (newShape) {
        try {
          shapeService.createShape(canvasId, newShape);
          addShape(newShape);
        } catch (error) {
          console.error("Failed to create shape:", error);
        }
      }
      endDrawing();
    }, [
      canvasId,
      resize.isResizing,
      drag.isDragging,
      endResize,
      endDragging,
      mouse,
      selectedTool,
      toolSettings,
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
        ref={ref}
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
  }
);
