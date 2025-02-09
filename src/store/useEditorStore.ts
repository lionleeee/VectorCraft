import { create } from "zustand";
import { Shape } from "@/types/shape";

import { MouseState, Point } from "@/types/mouse";
import {
  CircleSettings,
  PolygonSettings,
  RectangleSettings,
  ToolSettings,
  ToolType,
} from "@/types/components/tools";
import { nanoid } from "nanoid";

interface DragState {
  isDragging: boolean;
  startPoint: Point | null;
  offset: Point | null;
}

interface ResizeState {
  isResizing: boolean;
  handle: string | null;
  startPoint: Point | null;
  initialShape: Shape | null;
}

interface EditorState {
  shapes: Shape[];
  selectedShapeId: string | null;
  selectedTool: ToolType;
  isDragging: boolean;
  mouse: MouseState;
  drag: DragState;
  resize: ResizeState;
  toolSettings: ToolSettings;
  updateToolSettings: <T extends keyof ToolSettings>(
    tool: T,
    settings: Partial<ToolSettings[T]>
  ) => void;
  addShape: (shape: Shape) => void;
  updateShape: <T extends Shape>(
    id: string,
    updates: Partial<Omit<T, "id" | "type">>
  ) => void;
  deleteShape: (id: string) => void;
  selectShape: (id: string | null) => void;
  setSelectedTool: (tool: ToolType) => void;
  setIsDragging: (isDragging: boolean) => void;
  startDrawing: (point: Point) => void;
  updateDrawing: (point: Point) => void;
  endDrawing: () => void;
  startDragging: (point: Point, offset: Point) => void;
  updateDragging: (point: Point) => void;
  endDragging: () => void;
  startResize: (handle: string, point: Point, shape: Shape) => void;
  updateResize: (point: Point) => void;
  endResize: () => void;
  reset: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  shapes: [],
  selectedShapeId: null,
  selectedTool: "cursor",
  isDragging: false,
  mouse: {
    isDrawing: false,
    startPoint: null,
    endPoint: null,
  },
  drag: {
    isDragging: false,
    startPoint: null,
    offset: null,
  },
  resize: {
    isResizing: false,
    handle: null,
    startPoint: null,
    initialShape: null,
  },
  toolSettings: {
    rectangle: {
      width: 100,
      height: 100,
      fill: "#000000",
      stroke: "#000000",
      strokeWidth: 1,
      borderRadius: 0,
    } as RectangleSettings,
    circle: {
      radius: 50,
      fill: "#000000",
      stroke: "#000000",
      strokeWidth: 1,
    } as CircleSettings,
    polygon: {
      radius: 50,
      sides: 3,
      fill: "#000000",
      stroke: "#000000",
      strokeWidth: 1,
    } as PolygonSettings,
  },
  updateToolSettings: (tool, settings) =>
    set((state) => ({
      toolSettings: {
        ...state.toolSettings,
        [tool]: {
          ...state.toolSettings[tool],
          ...settings,
        },
      },
    })),
  addShape: (shape) =>
    set((state) => ({
      ...state,
      shapes: [...state.shapes, { ...shape, id: nanoid() }],
    })),

  updateShape: (id, updates) =>
    set((state) => ({
      ...state,
      shapes: state.shapes.map((shape) =>
        shape.id === id
          ? {
              ...shape,
              ...(updates as Partial<Omit<typeof shape, "id" | "type">>),
            }
          : shape
      ),
    })),

  deleteShape: (id) =>
    set((state) => ({
      shapes: state.shapes.filter((shape) => shape.id !== id),
      selectedShapeId:
        state.selectedShapeId === id ? null : state.selectedShapeId,
    })),

  selectShape: (id) =>
    set({
      selectedShapeId: id,
    }),

  setSelectedTool: (tool) =>
    set((state) => ({
      ...state,
      selectedTool: tool,
    })),

  setIsDragging: (isDragging) =>
    set({
      isDragging,
    }),

  startDrawing: (point) =>
    set((state) => ({
      ...state,
      mouse: {
        isDrawing: true,
        startPoint: point,
        endPoint: point,
      },
    })),

  updateDrawing: (point) =>
    set((state) => ({
      ...state,
      mouse: {
        ...state.mouse,
        endPoint: point,
      },
    })),

  endDrawing: () =>
    set((state) => ({
      ...state,
      mouse: {
        isDrawing: false,
        startPoint: null,
        endPoint: null,
      },
    })),

  startDragging: (point, offset) =>
    set((state) => ({
      ...state,
      drag: {
        isDragging: true,
        startPoint: point,
        offset,
      },
    })),

  updateDragging: (point) =>
    set((state) => {
      if (
        !state.drag.isDragging ||
        !state.drag.startPoint ||
        !state.drag.offset ||
        !state.selectedShapeId
      ) {
        return state;
      }

      const dx = point.x - state.drag.startPoint.x;
      const dy = point.y - state.drag.startPoint.y;
      const offset = state.drag.offset as Point;

      return {
        ...state,
        shapes: state.shapes.map((shape) =>
          shape.id === state.selectedShapeId
            ? {
                ...shape,
                x: offset.x + dx,
                y: offset.y + dy,
              }
            : shape
        ),
      };
    }),

  endDragging: () =>
    set((state) => ({
      ...state,
      drag: {
        isDragging: false,
        startPoint: null,
        offset: null,
      },
    })),

  startResize: (handle, point, shape) =>
    set((state) => ({
      ...state,
      resize: {
        isResizing: true,
        handle,
        startPoint: point,
        initialShape: shape,
      },
    })),

  updateResize: (point) =>
    set((state) => {
      if (
        !state.resize.isResizing ||
        !state.resize.startPoint ||
        !state.resize.initialShape ||
        !state.selectedShapeId ||
        !state.resize.handle
      ) {
        return state;
      }

      const dx = point.x - state.resize.startPoint.x;
      const dy = point.y - state.resize.startPoint.y;
      const initialShape = state.resize.initialShape;
      const handle = state.resize.handle;

      return {
        ...state,
        shapes: state.shapes.map((shape) => {
          if (shape.id !== state.selectedShapeId) return shape;

          if (shape.type === "rectangle" && initialShape.type === "rectangle") {
            let width = initialShape.width;
            let height = initialShape.height;
            let x = initialShape.x;
            let y = initialShape.y;

            switch (handle) {
              case "se":
                width = Math.max(10, initialShape.width + dx);
                height = Math.max(10, initialShape.height + dy);
                break;
              case "sw":
                width = Math.max(10, initialShape.width - dx);
                height = Math.max(10, initialShape.height + dy);
                x = initialShape.x + dx;
                break;
              case "ne":
                width = Math.max(10, initialShape.width + dx);
                height = Math.max(10, initialShape.height - dy);
                y = initialShape.y + dy;
                break;
              case "nw":
                width = Math.max(10, initialShape.width - dx);
                height = Math.max(10, initialShape.height - dy);
                x = initialShape.x + dx;
                y = initialShape.y + dy;
                break;
            }

            return { ...shape, x, y, width, height };
          }

          if (
            (shape.type === "circle" || shape.type === "polygon") &&
            initialShape.type === shape.type
          ) {
            const radius = Math.max(10, initialShape.radius + Math.max(dx, dy));
            return { ...shape, radius };
          }

          return shape;
        }),
      };
    }),

  endResize: () =>
    set((state) => ({
      ...state,
      resize: {
        isResizing: false,
        handle: null,
        startPoint: null,
        initialShape: null,
      },
    })),

  reset: () =>
    set({
      shapes: [],
      selectedShapeId: null,
      selectedTool: "cursor",
      isDragging: false,
      mouse: {
        isDrawing: false,
        startPoint: null,
        endPoint: null,
      },
      drag: {
        isDragging: false,
        startPoint: null,
        offset: null,
      },
      resize: {
        isResizing: false,
        handle: null,
        startPoint: null,
        initialShape: null,
      },
    }),
}));
