import { BaseProps } from "../common";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    BaseProps {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    BaseProps {
  icon: React.ReactNode;
  title?: string;
}
