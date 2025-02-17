import { supabase } from "@/lib/supabase";

interface CreateCanvasData {
  id: string;
  width: number;
  height: number;
  background_color: string;
}

type CanvasUpdateData = Partial<{
  width: number;
  height: number;
  background_color: string;
  title: string;
}>;

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

  async updateCanvas(canvasId: string, updateData: CanvasUpdateData) {
    const { error } = await supabase
      .from("canvases")
      .update(updateData)
      .eq("id", canvasId);

    if (error) {
      throw error;
    }
  },
};
