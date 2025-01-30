import { useState } from "react";
import { Button } from "@/components/common/Button/Button";
import { CreateCanvasModalProps } from "@/types/components/modal";

export const CreateCanvasModal = ({
  onClose,
  onCreate,
}: CreateCanvasModalProps) => {
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(600);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(width, height, backgroundColor);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[400px]">
        <h2 className="text-lg font-bold mb-4">새 캔버스 만들기</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">가로 (px)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
              min={100}
              max={2000}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">세로 (px)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full border rounded px-2 py-1"
              min={100}
              max={2000}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">배경색</label>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-full h-10"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button onClick={onClose} variant="ghost">
              취소
            </Button>
            <Button type="submit" variant="primary">
              생성
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
