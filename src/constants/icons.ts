import {
  BsCircle,
  BsCursor,
  BsSquare,
  BsTrash,
  BsTriangle,
} from "react-icons/bs";

export const TOOLS = [
  { id: "cursor", icon: BsCursor, title: "커서" },
  { id: "rectangle", icon: BsSquare, title: "사각형" },
  { id: "circle", icon: BsCircle, title: "원형" },
  { id: "polygon", icon: BsTriangle, title: "다각형" },
  //{ id: "text", icon: BsTextareaT, title: "텍스트" },
] as const;

export const ICONS = {
  delete: BsTrash,
} as const;
