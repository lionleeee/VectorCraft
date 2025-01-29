import {
  BsCursor,
  BsSquare,
  BsCircle,
  BsTriangle,
  BsTextareaT,
} from "react-icons/bs";

export const ToolPanel = () => {
  return (
    <aside className="w-12 bg-gray-100 border-r">
      <div className="flex flex-col gap-2 p-1">
        <button className="p-2 hover:bg-gray-200 rounded" title="커서">
          <BsCursor className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-200 rounded" title="사각형">
          <BsSquare className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-200 rounded" title="원형">
          <BsCircle className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-200 rounded" title="다각형">
          <BsTriangle className="w-5 h-5" />
        </button>
        <button className="p-2 hover:bg-gray-200 rounded" title="텍스트">
          <BsTextareaT className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};
