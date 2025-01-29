import { BsTrash } from "react-icons/bs";

export const LayerPanel = () => {
  return (
    <div className="h-[220px] bg-gray-100 border-t p-4 overflow-y-auto">
      <div className="text-sm font-bold mb-2">레이어</div>
      <div className="flex items-center bg-white p-2 rounded">
        <span>rect - 1</span>
        <button className="ml-auto">
          <BsTrash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
