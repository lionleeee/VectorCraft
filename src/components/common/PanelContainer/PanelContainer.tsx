export interface PanelContainerProps {
  children: React.ReactNode;
  className?: string;
}
export const PanelContainer = ({
  children,
  className = "",
}: PanelContainerProps) => {
  return (
    <div className={`bg-gray-100 overflow-y-auto ${className}`}>{children}</div>
  );
};
