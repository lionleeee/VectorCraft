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
import { useParams, useNavigate } from "react-router-dom";
import { nanoid } from "nanoid";
import { useEditorStore } from "@/store/useEditorStore";
import { useRealtimeChannel } from "@/hooks/useRealtimeChannel";

export const EditorPage = () => {
  const { canvasId } = useParams();
  useRealtimeChannel(canvasId);
  const [showCanvasModal, setShowCanvasModal] = useState(!canvasId);
  const [canvasProps, setCanvasProps] = useState<{
    width?: number;
    height?: number;
    backgroundColor?: string;
  }>();
  const canvasRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleCreateCanvas = (
    width: number,
    height: number,
    backgroundColor: string
  ) => {
    const newCanvasId = nanoid(10);
    setCanvasProps({ width, height, backgroundColor });
    setShowCanvasModal(false);
    navigate(`/editor/${newCanvasId}`);
  };

  const handleChangeBackgroundColor = (color: string) => {
    setCanvasProps((prev) =>
      prev ? { ...prev, backgroundColor: color } : prev
    );
  };

  const handleResetCanvas = () => {
    useEditorStore.getState().reset();
    setShowCanvasModal(true);
    setCanvasProps(undefined);
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
