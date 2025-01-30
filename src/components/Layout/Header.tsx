import { Button } from "../common/Button/Button";
import { HeaderProps } from "@/types/components/header";

export const Header = ({ onReset }: HeaderProps) => {
  return (
    <header className="bg-[#F1F2F4]  px-4 py-2 border-b border-gray-300">
      <div className="flex justify-between items-center ">
        <div className="flex items-center gap-4">
          <label className="text-lg ">VectorCraft</label>
          <Button onClick={onReset}>초기화</Button>
        </div>

        <div className="flex gap-4 text-sm">
          <Button>설정 내보내기</Button>
          <Button>설정 불러오기</Button>
          <Button>PNG다운로드</Button>
        </div>
      </div>
    </header>
  );
};
