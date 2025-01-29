import { PanelContainerProps } from "@/types/components/panelContainer";

export const PanelContainer = ({
  children,
  className = "",
}: PanelContainerProps) => {
  return (
    <div className={`bg-gray-100 overflow-y-auto ${className}`}>{children}</div>
  );
};
