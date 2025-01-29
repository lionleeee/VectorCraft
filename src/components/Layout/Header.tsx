export const Header = () => {
  return (
    <header className="bg-black text-white px-4 py-2">
      <div className="flex justify-between items-center ">
        <label>VectorCraft</label>
        <div className="flex gap-4 text-sm">
          <button>설정 내보내기</button>
          <button>설정 불러오기</button>
          <button>PNG다운로드</button>
        </div>
      </div>
    </header>
  );
};
