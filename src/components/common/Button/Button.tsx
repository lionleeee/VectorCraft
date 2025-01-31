import { ButtonProps } from "@/types/components/button";

export const Button = ({
  variant = "ghost",
  size = "sm",
  className = "",
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`px-2 py-2 rounded-md 
        ${variant === "ghost" ? "hover:bg-[#DDE0E5]" : ""}
        ${size === "sm" ? "text-sm" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
