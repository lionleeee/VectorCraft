import { IconButton } from "../common/Button/IconButton";
import { PanelContainer } from "../common/PanelContainer/PanelContainer";
import { TOOLS } from "@/constants/icons";

export const ToolPanel = () => {
  return (
    <PanelContainer className="w-12  border-r">
      <div className="flex flex-col gap-2 p-1">
        {TOOLS.map((tool) => (
          <IconButton
            key={tool.title}
            icon={<tool.icon className="w-5 h-5" />}
            title={tool.title}
          />
        ))}
      </div>
    </PanelContainer>
  );
};
