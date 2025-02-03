import { create } from "zustand";
import { Shape } from "@/types/shape";

import { MouseState, Point } from "@/types/mouse";
import { ToolType } from "@/types/components/tools";
import { nanoid } from "nanoid";

interface DragState {
  isDragging: boolean;
  startPoint: Point | null;
  offset: Point | null;
}

interface EditorState {
  shapes: Shape[];
  selectedShapeId: string | null;
  selectedTool: ToolType;
  isDragging: boolean;
  mouse: MouseState;
  drag: DragState;

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
}));
