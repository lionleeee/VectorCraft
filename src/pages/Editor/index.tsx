import { useState } from "react";
import { Canvas } from "@/components/Canvas/Canvas";
import { BaseLayout } from "@/components/Layout/BaseLayout";
import { Header } from "@/components/Layout/Header";
import { SettingsPanel } from "./components/Settings/SettingsPanel";
import { ToolPanel } from "./components/Tools/ToolPanel";
import { LayerPanel } from "./components/Layers/LayerPanel";
import { Container } from "@/components/Layout/Container";
import { Content } from "@/components/Layout/Content";
import { PanelContainer } from "@/components/Layout/PanelContainer";
import { CreateCanvasModal } from "./components/Modals/CanvasModal";

export const EditorPage = () => {
  const [showCanvasModal, setShowCanvasModal] = useState(true);
  const [canvasProps, setCanvasProps] = useState<{
    width?: number;
    height?: number;
    backgroundColor?: string;
  }>();

  const handleCreateCanvas = (
    width: number,
    height: number,
    backgroundColor: string
  ) => {
    setCanvasProps({ width, height, backgroundColor });
    setShowCanvasModal(false);
  };

  const handleResetCanvas = () => {
    setShowCanvasModal(true);
  };

  return (
    <BaseLayout>
      <Header onReset={handleResetCanvas} />
      <Container>
        <PanelContainer position="left" width={48}>
          <ToolPanel />
        </PanelContainer>
        <Content>
          <Canvas {...canvasProps} />
        </Content>
        <PanelContainer position="right" width={256} className="p-4">
          <SettingsPanel />
        </PanelContainer>
      </Container>
      <PanelContainer position="bottom" height={220} className="p-4">
        <LayerPanel />
      </PanelContainer>

      {showCanvasModal && (
        <CreateCanvasModal
          onClose={() => setShowCanvasModal(false)}
          onCreate={handleCreateCanvas}
        />
      )}
    </BaseLayout>
  );
};

export default EditorPage;
