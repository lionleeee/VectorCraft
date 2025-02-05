import { Shape } from "@/types/shape";

export const exportSettings = (shapes: Shape[]) => {
  const settings = {
    shapes: shapes,
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(settings, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "vectorcraft-settings.json";
  link.click();
};
