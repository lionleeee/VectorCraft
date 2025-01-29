import { BsSquare, BsCircle, BsTriangle, BsCursor } from "react-icons/bs";
import { BsTextareaT } from "react-icons/bs";

function App() {
  return (
    <div className="h-screen flex flex-col">
      {/* 상단 네비 */}
      <nav className="bg-black text-white px-4 py-2 text-sm ">
        <div className="flex justify-between items-center">
          <div>SVG Object Web Design</div>
          <div className="flex gap-4 text-sm">
            <button>설정 내보내기</button>
            <button>설정 불러오기</button>
            <button>PNG다운로드</button>
          </div>
        </div>
      </nav>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 왼쪽 도구 패널 */}
        <div className="w-12 bg-gray-100 border-r">
          <div className="flex flex-col gap-2 p-1">
            <button className="p-2 hover:bg-gray-200 rounded" title="커서">
              <BsCursor className="w-5 h-5 " />
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
        </div>

        {/* 중앙 캔버스 영역 */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="w-full h-full bg-white"></div>
        </div>

        {/* 오른쪽 속성 패널 */}
        <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">속성</h2>
          <p className="text-sm text-gray-600">
            속성을 편집하려면 도형을 선택하세요
          </p>
        </div>
      </div>

      {/* 하단 레이어 패널 */}
      <div className="h-[220px] bg-gray-100 border-t p-4 overflow-y-auto">
        <div className="text-sm font-bold mb-2">레이어</div>
        <div className="flex items-center bg-white p-2 rounded">
          <span>rect - 1</span>
          <button className="ml-auto">🗑️</button>
        </div>
      </div>
    </div>
  );
}

export default App;
