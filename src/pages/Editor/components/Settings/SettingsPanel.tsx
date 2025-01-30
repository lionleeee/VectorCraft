import { SettingsPanelProps } from "@/types/components/settings";

export const SettingsPanel = ({
  backgroundColor,
  onChangeBackgroundColor,
  selectedTool,
}: SettingsPanelProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold">속성</h2>

      <div className="space-y-2">
        <label className="block text-sm mb-1">배경색</label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => onChangeBackgroundColor(e.target.value)}
          className="w-full h-8"
        />
      </div>

      <div className="pt-4">
        <p className="text-sm text-gray-600">
          도형 속성을 편집하려면 도형을 선택하세요
        </p>
      </div>
    </div>
  );
};
