import { useEffect, useRef } from "react";
import { useShapeStore } from "@/store/useShapeStore";
import { useCanvasStore } from "@/store/useCanvasStore";
import { realtimeManager } from "@/lib/realtime";
import { Shape } from "@/types/shape";

export const useRealtimeChannel = (canvasId: string | undefined) => {
  const { addShape, updateShape, deleteShape, reset } = useShapeStore();
  const { setBackgroundColor } = useCanvasStore();

  const stateRef = useRef({
    isInitialized: false,
    actions: {
      addShape,
      updateShape,
      deleteShape,
      reset,
      setBackgroundColor,
    },
  });

  useEffect(() => {
    stateRef.current.actions = {
      addShape,
      updateShape,
      deleteShape,
      reset,
      setBackgroundColor,
    };
  }, [addShape, updateShape, deleteShape, reset, setBackgroundColor]);

  useEffect(() => {
    if (!canvasId) return;

    const state = stateRef.current;
    const initializeRealtime = async () => {
      if (state.isInitialized) return;

      try {
        const { channel, shapes } = await realtimeManager.initialize(canvasId);
        state.isInitialized = true;

        const { reset, addShape } = state.actions;
        reset();
        shapes.forEach(addShape);

        channel
          .on("broadcast", { event: "shape" }, ({ payload }) => {
            const { addShape, updateShape, deleteShape } = state.actions;
            switch (payload.type) {
              case "add":
                if (payload.shape) {
                  addShape(payload.shape);
                }
                break;
              case "update":
                if (payload.shape) {
                  updateShape(payload.shape.id, payload.shape);
                }
                break;
              case "delete":
                if (payload.shapeId) {
                  deleteShape(payload.shapeId);
                }
                break;
            }
          })
          .on("broadcast", { event: "canvas" }, ({ payload }) => {
            if (payload.type === "updateBackground") {
              state.actions.setBackgroundColor(payload.backgroundColor);
            }
          })
          .subscribe();
      } catch (error) {
        console.error("초기화 실패:", error);
      }
    };

    initializeRealtime();

    return () => {
      realtimeManager.disconnect();
      state.isInitialized = false;
    };
  }, [canvasId]);

  return {
    broadcastShapeAdd: (shape: Shape) =>
      realtimeManager.broadcastShape({ type: "add", shape }),
    broadcastShapeUpdate: (shape: Shape) =>
      realtimeManager.broadcastShape({ type: "update", shape }),
    broadcastShapeDelete: (shapeId: string) =>
      realtimeManager.broadcastShape({ type: "delete", shapeId }),
    broadcastBackgroundChange: (backgroundColor: string) =>
      realtimeManager.broadcastCanvas({
        type: "updateBackground",
        backgroundColor,
      }),
  };
};
