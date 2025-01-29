import { Canvas } from "@/components/Canvas/Canvas";
import { BaseLayout } from "@/components/Layout/BaseLayout";
import { Header } from "@/components/Layout/Header";
import { SettingsPanel } from "./components/Settings/SettingsPanel";
import { ToolPanel } from "./components/Tools/ToolPanel";
import { LayerPanel } from "./components/Layers/LayerPanel";
import { Container } from "@/components/Layout/Container";
import { Content } from "@/components/Layout/Content";
import { PanelContainer } from "@/components/Layout/PanelContainer/PanelContainer";

export const EditorPage = () => {
  return (
    <BaseLayout>
      <Header />
      <Container>
        <PanelContainer position="left" width={48}>
          <ToolPanel />
        </PanelContainer>
        <Content>
          <Canvas />
        </Content>
        <PanelContainer position="right" width={256} className="p-4">
          <SettingsPanel />
        </PanelContainer>
      </Container>
      <PanelContainer position="bottom" height={220} className="p-4">
        <LayerPanel />
      </PanelContainer>
    </BaseLayout>
  );
};

export default EditorPage;
