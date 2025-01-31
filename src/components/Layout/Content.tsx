import { ChildrenProps } from "@/types/common";

export const Content = ({ children }: ChildrenProps) => {
  return <main className="flex-1 overflow-auto p-4">{children}</main>;
};
