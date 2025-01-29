import {
  BsCursor,
  BsSquare,
  BsCircle,
  BsTriangle,
  BsTextareaT,
} from "react-icons/bs";
import { IconButton } from "../common/Button/IconButton";
import { PanelContainer } from "../common/PanelContainer/PanelContainer";

export const ToolPanel = () => {
  return (
    <PanelContainer className="w-12  border-r">
      <div className="flex flex-col gap-2 p-1">
        <IconButton icon={<BsCursor className="w-5 h-5" />} title="커서" />
        <IconButton icon={<BsSquare className="w-5 h-5" />} title="사각형" />
        <IconButton icon={<BsCircle className="w-5 h-5" />} title="원형" />
        <IconButton icon={<BsTriangle className="w-5 h-5" />} title="다각형" />
        <IconButton icon={<BsTextareaT className="w-5 h-5" />} title="텍스트" />
      </div>
    </PanelContainer>
  );
};
