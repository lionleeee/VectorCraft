import { create } from "zustand";
import { Shape } from "@/types/shape";
import { supabase } from "@/lib/supabase";
import { Canvas, ShapeRecord } from "@/types/supabase";

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
  canvasId: string | null;
  initializeCanvas: (canvas: Canvas) => void;
  subscribeToChanges: () => void;
  unsubscribeFromChanges: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
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
  addShape: async (shape: Shape) => {
    const { canvasId } = get();
    if (!canvasId) return;

    await supabase.from("shapes").insert({
      canvas_id: canvasId,
      shape_data: shape,
    });
  },
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
  deleteShape: async (id: string) => {
    const { canvasId } = get();
    if (!canvasId) return;

    await supabase
      .from("shapes")
      .update({ deleted_at: new Date().toISOString() })
      .eq("canvas_id", canvasId)
      .eq("shape_data->>id", id);
  },
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
  canvasId: null,
  initializeCanvas: async (canvas: Canvas) => {
    set({
      canvasId: canvas.id,
      width: canvas.width,
      height: canvas.height,
      backgroundColor: canvas.background_color,
    });

    // 캔버스의 모든 도형들을 불러옵니다
    const { data: shapes } = await supabase
      .from("shapes")
      .select("*")
      .eq("canvas_id", canvas.id)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });

    if (shapes) {
      set({ shapes: shapes.map((s) => s.shape_data) });
    }
  },
  subscribeToChanges: () => {
    const { canvasId } = get();
    if (!canvasId) return;

    // 실시간 구독 설정
    const subscription = supabase
      .channel(`canvas:${canvasId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shapes",
          filter: `canvas_id=eq.${canvasId}`,
        },
        async (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;

          switch (eventType) {
            case "INSERT": {
              const shapeRecord = newRecord as ShapeRecord;
              set((state) => ({
                shapes: [...state.shapes, shapeRecord.shape_data],
              }));
              break;
            }
            case "DELETE":
            case "UPDATE": {
              const shapeRecord = oldRecord as ShapeRecord;
              set((state) => ({
                shapes: state.shapes.filter(
                  (s) => s.id !== shapeRecord.shape_data.id
                ),
              }));
              if (eventType === "UPDATE" && newRecord) {
                set((state) => ({
                  shapes: [
                    ...state.shapes,
                    (newRecord as ShapeRecord).shape_data,
                  ],
                }));
              }
              break;
            }
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },
  unsubscribeFromChanges: () => {
    const { canvasId } = get();
    if (!canvasId) return;

    supabase.channel(`canvas:${canvasId}`).unsubscribe();
  },
}));
