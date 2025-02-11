import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { nanoid } from "nanoid";
import { useEditorStore } from "@/store/useEditorStore";
import { realtimeManager } from "@/lib/realtime";

export const useCanvas = (canvasId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showCanvasModal, setShowCanvasModal] = useState(!canvasId);
  const [width, setWidth] = useState<number>();
  const [height, setHeight] = useState<number>();
  const navigate = useNavigate();
  const { setBackgroundColor } = useEditorStore();

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

        setWidth(canvas.width);
        setHeight(canvas.height);
        setBackgroundColor(canvas.background_color);
      } finally {
        setIsLoading(false);
      }
    };

    loadCanvas();
  }, [canvasId, navigate, setBackgroundColor]);

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

    setWidth(width);
    setHeight(height);
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
    useEditorStore.getState().reset();
    setShowCanvasModal(true);
    setWidth(undefined);
    setHeight(undefined);
  };

  return {
    isLoading,
    showCanvasModal,
    width,
    height,
    setShowCanvasModal,
    handleCreateCanvas,
    handleChangeBackgroundColor,
    handleResetCanvas,
  };
};
