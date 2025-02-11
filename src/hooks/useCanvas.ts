import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { nanoid } from "nanoid";
import { useEditorStore } from "@/store/useEditorStore";
import { realtimeManager } from "@/lib/realtime";

interface CanvasProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
}

export const useCanvas = (canvasId: string | undefined) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showCanvasModal, setShowCanvasModal] = useState(!canvasId);
  const [canvasProps, setCanvasProps] = useState<CanvasProps>();
  const navigate = useNavigate();

  useEffect(() => {
    const loadCanvas = async () => {
      if (!canvasId) return;

      try {
        //supabase에서 캔버스 정보 가져오기
        const { data: canvas, error } = await supabase
          .from("canvases")
          .select("*")
          .eq("id", canvasId)
          .single();

        if (error) {
          navigate("/editor");
          return;
        }

        setCanvasProps({
          width: canvas.width,
          height: canvas.height,
          backgroundColor: canvas.background_color,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCanvas();
  }, [canvasId, navigate]);

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

    setCanvasProps({ width, height, backgroundColor });
  };

  //캔버스 배경색 변경
  const handleChangeBackgroundColor = async (color: string) => {
    if (!canvasId) return;

    await supabase
      .from("canvases")
      .update({ background_color: color })
      .eq("id", canvasId);

    setCanvasProps((prev) =>
      prev ? { ...prev, backgroundColor: color } : prev
    );

    // 브로드캐스트는 useRealtimeChannel에서 처리하도록 변경
    realtimeManager.broadcastCanvas({
      type: "updateBackground",
      backgroundColor: color,
    });
  };

  //캔버스 리셋
  const handleResetCanvas = () => {
    useEditorStore.getState().reset();
    setShowCanvasModal(true);
    setCanvasProps(undefined);
  };

  return {
    isLoading,
    showCanvasModal,
    canvasProps,
    setShowCanvasModal,
    handleCreateCanvas,
    handleChangeBackgroundColor,
    handleResetCanvas,
    setCanvasProps,
  };
};
