interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = ({
  variant = "ghost",
  size = "sm",
  className = "",
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`
        ${variant === "ghost" ? "hover:bg-gray-700" : ""}
        ${size === "sm" ? "text-sm" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
