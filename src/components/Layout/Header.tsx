import { Button } from "../common/Button/Button";

export const Header = () => {
  return (
    <header className="bg-black text-white px-4 py-2">
      <div className="flex justify-between items-center ">
        <label>VectorCraft</label>
        <div className="flex gap-4 text-sm">
          <Button>설정 내보내기</Button>
          <Button>설정 불러오기</Button>
          <Button>PNG다운로드</Button>
        </div>
      </div>
    </header>
  );
};
