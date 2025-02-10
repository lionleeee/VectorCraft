import { supabase } from "./supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Shape } from "@/types/shape";

type ShapeEvent = {
  type: "add" | "update" | "delete";
  shape?: Shape;
  shapeId?: string;
};

class RealtimeManager {
  private channel: RealtimeChannel | null = null;

  initialize(canvasId: string) {
    if (this.channel) {
      this.channel.unsubscribe();
    }

    this.channel = supabase.channel(`canvas:${canvasId}`, {
      config: {
        broadcast: { self: true },
      },
    });

    return this.channel;
  }

  broadcastShape(event: ShapeEvent) {
    this.channel?.send({
      type: "broadcast",
      event: "shape",
      payload: event,
    });
  }

  getChannel() {
    return this.channel;
  }

  disconnect() {
    this.channel?.unsubscribe();
    this.channel = null;
  }
}

export const realtimeManager = new RealtimeManager();
