import { useRef } from "react";
import { useParams } from "react-router-dom";
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
import { useCanvas } from "@/hooks/useCanvas";

export const EditorPage = () => {
  const { canvasId } = useParams();
  const canvasRef = useRef<HTMLDivElement>(null);
  const {
    isLoading,
    showCanvasModal,
    canvasProps,
    setShowCanvasModal,
    handleCreateCanvas,
    handleChangeBackgroundColor,
    handleResetCanvas,
  } = useCanvas(canvasId);

  if (isLoading && canvasId) {
    return <div>로딩중...</div>;
  }

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
