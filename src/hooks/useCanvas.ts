import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { nanoid } from "nanoid";
import { useCanvasStore } from "@/store/useCanvasStore";
import { useShapeStore } from "@/store/useShapeStore";
import { realtimeManager } from "@/lib/realtime";

export const useCanvas = (canvasId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showCanvasModal, setShowCanvasModal] = useState(!canvasId);
  const navigate = useNavigate();

  const { setBackgroundColor, setDimensions } = useCanvasStore();
  const { reset: resetShapes } = useShapeStore();

  useEffect(() => {
    const loadCanvas = async () => {
      if (!canvasId) return;

      try {
        const { data: canvas, error } = await supabase
          .from("canvases")
          .select("*")
          .eq("id", canvasId)
          .single();

        if (error) {
          navigate("/editor");
          return;
        }

        setDimensions(canvas.width, canvas.height);
        setBackgroundColor(canvas.background_color);
      } finally {
        setIsLoading(false);
      }
    };

    loadCanvas();
  }, [canvasId, navigate, setBackgroundColor, setDimensions]);

  //캔버스 생성
  const handleCreateCanvas = async (
    width: number,
    height: number,
    backgroundColor: string
  ) => {
    const newCanvasId = nanoid(10);

    navigate(`/editor/${newCanvasId}`);
    setShowCanvasModal(false);

    await supabase.from("canvases").insert({
      id: newCanvasId,
      width,
      height,
      background_color: backgroundColor,
    });

    setDimensions(width, height);
    setBackgroundColor(backgroundColor);
  };

  //캔버스 배경색 변경
  const handleChangeBackgroundColor = async (color: string) => {
    if (!canvasId) return;

    await supabase
      .from("canvases")
      .update({ background_color: color })
      .eq("id", canvasId);

    setBackgroundColor(color);

    realtimeManager.broadcastCanvas({
      type: "updateBackground",
      backgroundColor: color,
    });
  };

  //캔버스 리셋
  const handleResetCanvas = () => {
    resetShapes();
    setShowCanvasModal(true);
    setDimensions(0, 0);
    setBackgroundColor("#FFFFFF");
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
