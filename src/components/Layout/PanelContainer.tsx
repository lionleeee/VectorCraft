import { PanelProps } from "@/types/layout/layout";

export const PanelContainer = ({
  position = "left",
  width,
  height,
  children,
  className = "",
}: PanelProps) => {
  const positionStyles = {
    left: "border-r",
    right: "border-l",
    bottom: "border-t",
  };

  return (
    <div
      className={`
        bg-gray-100 
        overflow-y-auto 
        ${positionStyles[position]}
        ${className}
      `}
      style={{
        width: width ? `${width}px` : "auto",
        height: height ? `${height}px` : "auto",
      }}
    >
      {children}
    </div>
  );
};
