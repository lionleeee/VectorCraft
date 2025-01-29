import { IconButtonProps } from "@/types/components/button";

export const IconButton = ({
  icon,
  className = "",
  ...props
}: IconButtonProps) => {
  return (
    <button className={`p-2 hover:bg-gray-200 rounded ${className}`} {...props}>
      {icon}
    </button>
  );
};
