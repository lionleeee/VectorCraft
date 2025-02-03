import { create } from "zustand";
import { Shape, CreateShapeProps, ShapeType } from "@/types/shape";
import { createShape } from "@/utils/shapeFactory";
import { MouseState, Point } from "@/types/mouse";

interface EditorState {
  shapes: Shape[];
  selectedShapeId: string | null;
  selectedTool: ShapeType | "cursor";
  isDragging: boolean;
  mouse: MouseState;

  addShape: (props: CreateShapeProps) => void;
  updateShape: <T extends Shape>(
    id: string,
    updates: Partial<Omit<T, "id" | "type">>
  ) => void;
  deleteShape: (id: string) => void;
  selectShape: (id: string | null) => void;
  setSelectedTool: (tool: ShapeType | "cursor") => void;
  setIsDragging: (isDragging: boolean) => void;
  startDrawing: (point: Point) => void;
  updateDrawing: (point: Point) => void;
  endDrawing: () => void;
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

  addShape: (props) =>
    set((state) => ({
      shapes: [...state.shapes, createShape(props)],
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
    set({
      selectedTool: tool,
    }),

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
}));
