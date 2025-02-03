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

  let previewShape: Shape;

  switch (selectedTool) {
    case "rectangle":
      previewShape = {
        ...baseShape,
        type: "rectangle",
        borderRadius: 0,
        ...dimensions,
      } as RectangleShape;
      break;

    case "circle":
      previewShape = {
        ...baseShape,
        type: "circle",
        ...dimensions,
      } as CircleShape;
      break;

    case "polygon":
      previewShape = {
        ...baseShape,
        type: "polygon",
        sides: 3,
        ...dimensions,
      } as PolygonShape;
      break;

    default:
      return null;
  }

  return renderShape(previewShape);
};
