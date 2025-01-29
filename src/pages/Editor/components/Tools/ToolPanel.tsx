import { IconButton } from "@/components/common/Button/IconButton";

import { TOOLS } from "@/constants/icons";

export const ToolPanel = () => {
  return (
    <div className="flex flex-col gap-2 p-1">
      {TOOLS.map((tool) => (
        <IconButton
          key={tool.title}
          icon={<tool.icon className="w-5 h-5" />}
          title={tool.title}
        />
      ))}
    </div>
  );
};
