import { IconButtonProps } from "@/types/components/button";

export const IconButton = ({
  icon,
  className = "",
  ...props
}: IconButtonProps) => {
  return (
    <button className={`p-2  rounded ${className}`} {...props}>
      {icon}
    </button>
  );
};
