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

  URL.revokeObjectURL(url);
};

export const importSettings = async (file: File): Promise<Shape[]> => {
  const text = await file.text();
  const settings = JSON.parse(text);

  if (!settings.shapes || !Array.isArray(settings.shapes)) {
    throw new Error("유효하지 않은 설정 파일입니다.");
  }

  return settings.shapes;
};
