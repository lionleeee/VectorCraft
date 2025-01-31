export interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}
export interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}
