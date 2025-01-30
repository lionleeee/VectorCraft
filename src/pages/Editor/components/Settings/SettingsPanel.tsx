import { SettingsPanelProps } from "@/types/components/settings";
import { ColorInput } from "@/components/common/Input/ColorInput";
import { TextProperties } from "./Properties/TextProperties";
import { CircleProperties } from "./Properties/CircleProperties";
import { RectangleProperties } from "./Properties/RectangleProperties";
import { CursorProperties } from "./Properties/CursorProperties";
import { PolygonProperties } from "./Properties/PolygonProperties";

export const SettingsPanel = ({
  backgroundColor,
  onChangeBackgroundColor,
  selectedTool,
}: SettingsPanelProps) => {
  const renderToolSettings = () => {
    switch (selectedTool) {
      case "cursor":
        return <CursorProperties />;
      case "rectangle":
        return <RectangleProperties />;
      case "circle":
        return <CircleProperties />;
      case "polygon":
        return <PolygonProperties />;
      case "text":
        return <TextProperties />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">속성</h2>

      {selectedTool === "cursor" && (
        <div className="space-y-2">
          <ColorInput
            label="배경색"
            value={backgroundColor}
            onChange={onChangeBackgroundColor}
          />
        </div>
      )}

      {renderToolSettings()}
    </div>
  );
};
