import { NumberInputProps } from "@/types/components/input";

export const NumberInput = ({
  label,
  value,
  onChange,
  min,
  max,
}: NumberInputProps) => {
  return (
    <div>
      <label className="block text-sm mb-1">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        className="w-full border rounded px-2 py-1"
      />
    </div>
  );
};
