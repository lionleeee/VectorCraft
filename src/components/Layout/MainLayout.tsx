import { Header } from "./Header";
import { ToolPanel } from "../Tools/ToolPanel";
import { SettingsPanel } from "../Settings/SettingsPanel";
import { LayerPanel } from "../Layers/LayerPanel";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <ToolPanel />
        <main className="flex-1 overflow-auto p-4">{children}</main>
        <SettingsPanel />
      </div>
      <LayerPanel />
    </div>
  );
};
