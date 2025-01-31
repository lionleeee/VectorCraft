import { ToolType } from "./tools";

export interface SettingsPanelProps {
  backgroundColor: string;
  onChangeBackgroundColor: (color: string) => void;
  selectedTool: ToolType | null;
}
