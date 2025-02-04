import { useEditorStore } from "@/store/useEditorStore";
import { calculateShapeDimensions } from "@/utils/shapeCalculator";
import {
  Shape,
  RectangleShape,
  CircleShape,
  PolygonShape,
} from "@/types/shape";

interface PreviewProps {
  renderShape: (shape: Shape) => JSX.Element;
}

export const Preview = ({ renderShape }: PreviewProps) => {
  const { mouse, selectedTool } = useEditorStore();
  const { isDrawing, startPoint, endPoint } = mouse;

  if (!isDrawing || !startPoint || !endPoint || selectedTool === "cursor") {
    return null;
  }

  const dimensions = calculateShapeDimensions({
    startPoint,
    endPoint,
    type: selectedTool,
  });

  const baseShape = {
    id: "preview",
    type: selectedTool,
    fill: "none",
    stroke: "#000000",
    strokeWidth: 1,
    rotation: 0,
  };

  const previewShape =
    {
      rectangle: {
        ...baseShape,
        type: "rectangle" as const,
        borderRadius: 0,
        ...dimensions,
      } as RectangleShape,
      circle: {
        ...baseShape,
        type: "circle" as const,
        ...dimensions,
      } as CircleShape,
      polygon: {
        ...baseShape,
        type: "polygon" as const,
        sides: 3,
        ...dimensions,
      } as PolygonShape,
    }[selectedTool] ?? null;

  if (!previewShape) return null;
  return renderShape(previewShape);
};
