import { ColorInput } from "@/components/common/Input/ColorInput";
import { NumberInput } from "@/components/common/Input/NumberInput";

export const PolygonProperties = () => {
  return (
    <div className="space-y-4">
      <NumberInput
        label="반지름"
        value={50}
        onChange={() => {}}
        min={1}
        max={1000}
      />
      <NumberInput
        label="변의 개수"
        value={3}
        onChange={() => {}}
        min={3}
        max={12}
      />
      <ColorInput label="백그라운드 색상" value="#000000" onChange={() => {}} />
      <ColorInput label="테두리 색상" value="#000000" onChange={() => {}} />
      <NumberInput
        label="테두리 두께"
        value={1}
        onChange={() => {}}
        min={0}
        max={100}
      />
    </div>
  );
};
