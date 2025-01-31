export interface CreateCanvasModalProps {
  onClose: () => void;
  onCreate: (width: number, height: number, backgroundColor: string) => void;
}
