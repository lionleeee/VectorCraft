import { ColorInputProps } from "@/types/components/input";

export const ColorInput = ({ label, value, onChange }: ColorInputProps) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm mb-1">{label}</label>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-8"
      />
    </div>
  );
};
