import { useRef, useState } from "react";
import { BaseLayout } from "@/components/Layout/BaseLayout";
import { SettingsPanel } from "@/pages/Editor/components/Settings/SettingsPanel";
import { ToolPanel } from "@/pages/Editor/components/Tools/ToolPanel";
import { LayerPanel } from "@/pages/Editor/components/Layers/LayerPanel";
import { Container } from "@/components/Layout/Container";
import { Content } from "@/components/Layout/Content";
import { PanelContainer } from "@/components/Layout/PanelContainer";
import { CreateCanvasModal } from "@/pages/Editor/components/Modals/CanvasModal";
import { EditorCanvas } from "./components/Canvas/EditorCanvas";
import { Header } from "./components/Layout/Header";

export const EditorPage = () => {
  const [showCanvasModal, setShowCanvasModal] = useState(true);
  const [canvasProps, setCanvasProps] = useState<{
    width?: number;
    height?: number;
    backgroundColor?: string;
  }>();
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCreateCanvas = (
    width: number,
    height: number,
    backgroundColor: string
  ) => {
    setCanvasProps({ width, height, backgroundColor });
    setShowCanvasModal(false);
  };

  const handleChangeBackgroundColor = (color: string) => {
    setCanvasProps((prev) =>
      prev ? { ...prev, backgroundColor: color } : prev
    );
  };

  const handleResetCanvas = () => {
    setShowCanvasModal(true);
  };

  return (
    <BaseLayout>
      <Header onReset={handleResetCanvas} canvasRef={canvasRef} />
      <Container>
        <PanelContainer position="left" width={48}>
          <ToolPanel />
        </PanelContainer>
        <Content>
          <EditorCanvas {...canvasProps} ref={canvasRef} />
        </Content>
        <PanelContainer position="right" width={256} className="p-4">
          <SettingsPanel
            backgroundColor={canvasProps?.backgroundColor || "#FFFFFF"}
            onChangeBackgroundColor={handleChangeBackgroundColor}
          />
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
