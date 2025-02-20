import { useEffect, useRef } from "react";
import { useShapeStore } from "@/store/useShapeStore";
import { useCanvasStore } from "@/store/useCanvasStore";
import { realtimeManager } from "@/lib/realtime";
import { Shape } from "@/types/shape";
import { useNavigate } from "react-router-dom";

export const useRealtimeChannel = (canvasId: string | undefined) => {
  const { addShape, updateShape, deleteShape, reset } = useShapeStore();
  const { setBackgroundColor } = useCanvasStore();
  const navigate = useNavigate();

  const initializedCanvasRef = useRef<string | null>(null);
  const stateRef = useRef({
    actions: {
      addShape,
      updateShape,
      deleteShape,
      reset,
      setBackgroundColor,
    },
  });

  useEffect(() => {
    if (!canvasId || initializedCanvasRef.current === canvasId) return;

    const state = stateRef.current;
    const initializeRealtime = async () => {
      try {
        const { channel, shapes } = await realtimeManager.initialize(canvasId);
        initializedCanvasRef.current = canvasId;

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
        console.error("실시간 연결 실패:", error);
        alert("실시간 연결 실패");
        navigate("/editor");
      }
    };

    initializeRealtime();

    return () => {
      realtimeManager.disconnect();
    };
  }, [canvasId, navigate]);

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
