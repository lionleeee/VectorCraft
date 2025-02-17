import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { useCanvasStore } from "@/store/useCanvasStore";
import { useShapeStore } from "@/store/useShapeStore";
import { realtimeManager } from "@/lib/realtime";
import { canvasService } from "@/services/canvasService";

export const useCanvas = (canvasId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showCanvasModal, setShowCanvasModal] = useState(!canvasId);
  const navigate = useNavigate();

  const { setBackgroundColor, setDimensions } = useCanvasStore();
  const { reset: resetShapes } = useShapeStore();

  const storeActionsRef = useRef({
    setBackgroundColor,
    setDimensions,
    navigate,
  });

  useEffect(() => {
    storeActionsRef.current = {
      setBackgroundColor,
      setDimensions,
      navigate,
    };
  }, [setBackgroundColor, setDimensions, navigate]);

  const loadCanvas = useCallback(async () => {
    if (!canvasId) return;

    try {
      const canvas = await canvasService.getCanvas(canvasId);
      storeActionsRef.current.setDimensions(canvas.width, canvas.height);
      storeActionsRef.current.setBackgroundColor(canvas.background_color);
    } catch (error) {
      console.error("요청 실패", error);
      storeActionsRef.current.navigate("/editor");
    } finally {
      setIsLoading(false);
    }
  }, [canvasId]);

  useEffect(() => {
    loadCanvas();
  }, [loadCanvas]);

  const handleCreateCanvas = async (
    width: number,
    height: number,
    backgroundColor: string
  ) => {
    const newCanvasId = nanoid(10);

    try {
      await canvasService.createCanvas({
        id: newCanvasId,
        width,
        height,
        background_color: backgroundColor,
      });

      storeActionsRef.current.navigate(`/editor/${newCanvasId}`);
      setShowCanvasModal(false);
      storeActionsRef.current.setDimensions(width, height);
      storeActionsRef.current.setBackgroundColor(backgroundColor);
    } catch (error) {
      console.error("Failed to create canvas:", error);
    }
  };

  const handleChangeBackgroundColor = async (color: string) => {
    if (!canvasId) return;

    try {
      await canvasService.updateCanvas(canvasId, { background_color: color });
      storeActionsRef.current.setBackgroundColor(color);
      realtimeManager.broadcastCanvas({
        type: "updateBackground",
        backgroundColor: color,
      });
    } catch (error) {
      console.error("Failed to update background color:", error);
    }
  };

  const handleResetCanvas = () => {
    resetShapes();
    setShowCanvasModal(true);
    storeActionsRef.current.setDimensions(0, 0);
    storeActionsRef.current.setBackgroundColor("#FFFFFF");
  };

  return {
    isLoading,
    showCanvasModal,
    setShowCanvasModal,
    handleCreateCanvas,
    handleChangeBackgroundColor,
    handleResetCanvas,
  };
};
