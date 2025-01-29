interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
}

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
