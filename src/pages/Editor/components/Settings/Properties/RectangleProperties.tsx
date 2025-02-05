import { ColorInput } from "@/components/common/Input/ColorInput";
import { NumberInput } from "@/components/common/Input/NumberInput";
import { useEditorStore } from "@/store/useEditorStore";

export const RectangleProperties = () => {
  const { toolSettings, updateToolSettings } = useEditorStore();
  const settings = toolSettings.rectangle;
  return (
    <div className="space-y-4">
      <NumberInput
        label="가로"
        value={settings.width}
        onChange={(value) => updateToolSettings("rectangle", { width: value })}
        min={1}
        max={1000}
      />
      <NumberInput
        label="세로"
        value={settings.height}
        onChange={(value) => updateToolSettings("rectangle", { height: value })}
        min={1}
        max={1000}
      />
      <ColorInput
        label="백그라운드 색상"
        value={settings.fill}
        onChange={(value) => updateToolSettings("rectangle", { fill: value })}
      />
      <ColorInput
        label="테두리 색상"
        value={settings.stroke}
        onChange={(value) => updateToolSettings("rectangle", { stroke: value })}
      />
      <NumberInput
        label="테두리 두께"
        value={settings.strokeWidth}
        onChange={(value) =>
          updateToolSettings("rectangle", { strokeWidth: value })
        }
        min={0}
        max={100}
      />
    </div>
  );
};
