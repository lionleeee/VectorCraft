import { supabase } from "@/lib/supabase";
import { CanvasUpdate } from "@/types/canvas";

interface CreateCanvasData {
  id: string;
  width: number;
  height: number;
  background_color: string;
}

export const canvasService = {
  async getCanvas(canvasId: string) {
    const { data: canvas, error } = await supabase
      .from("canvases")
      .select("*")
      .eq("id", canvasId)
      .single();

    if (error) {
      throw error;
    }

    return canvas;
  },

  async createCanvas(data: CreateCanvasData) {
    const { error } = await supabase.from("canvases").insert(data);

    if (error) {
      throw error;
    }
  },

  async updateCanvas(canvasId: string, updates: Partial<CanvasUpdate>) {
    const { error } = await supabase
      .from("canvases")
      .update(updates)
      .eq("id", canvasId);

    if (error) {
      throw error;
    }
  },

  async updateBackgroundColor(canvasId: string, backgroundColor: string) {
    return this.updateCanvas(canvasId, { background_color: backgroundColor });
  },
};
