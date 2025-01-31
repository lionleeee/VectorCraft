import { ColorInput } from "@/components/common/Input/ColorInput";
import { NumberInput } from "@/components/common/Input/NumberInput";

export const TextProperties = () => {
  return (
    <div className="space-y-4">
      <NumberInput
        label="글자 크기"
        value={16}
        onChange={() => {}}
        min={8}
        max={200}
      />
      <ColorInput label="글자 색상" value="#000000" onChange={() => {}} />
    </div>
  );
};
