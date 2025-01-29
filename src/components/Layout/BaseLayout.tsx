import { BaseLayoutProps } from "@/types/layout/layout";

export const BaseLayout = ({ children }: BaseLayoutProps) => {
  return <div className="h-screen flex flex-col">{children}</div>;
};
