import { initializeRealtimeClient } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect } from "react";

export const useRealtimeChannel = (canvasId: string | undefined) => {
  useEffect(() => {
    if (!canvasId) return;

    const channel: RealtimeChannel = initializeRealtimeClient(canvasId);

    channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        console.log("Connected to realtime channel");
      }
    });

    return () => {
      channel.unsubscribe();
    };
  }, [canvasId]);
};
