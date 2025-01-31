import { ChildrenProps } from "@/types/common";

export const Container = ({ children }: ChildrenProps) => {
  return <div className="flex flex-1 overflow-hidden">{children}</div>;
};
