import { PanelContainer } from "../common/PanelContainer/PanelContainer";

export const SettingsPanel = () => {
  return (
    <PanelContainer className="w-64  p-4">
      <h2 className="text-lg font-bold mb-4">속성</h2>
      <p className="text-sm text-gray-600">
        속성을 편집하려면 도형을 선택하세요
      </p>
    </PanelContainer>
  );
};
