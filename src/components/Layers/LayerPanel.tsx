import { BsTrash } from "react-icons/bs";
import { IconButton } from "../common/Button/IconButton";
import { PanelContainer } from "../common/PanelContainer/PanelContainer";

export const LayerPanel = () => {
  return (
    <PanelContainer className="h-[220px]  border-t p-4 overflow-y-auto">
      <div className="text-sm font-bold mb-2">레이어</div>
      <div className="flex items-center bg-white p-2 rounded">
        <span>rect - 1</span>
        <IconButton
          className="ml-auto"
          icon={<BsTrash className="w-5 h-5" />}
          title="커서"
        />
      </div>
    </PanelContainer>
  );
};
