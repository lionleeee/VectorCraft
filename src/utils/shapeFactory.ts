import { nanoid } from "nanoid";
import {
  Shape,
  CreateShapeProps,
  RectangleShape,
  CircleShape,
  PolygonShape,
} from "@/types/shape";

const createRectangle = ({
  x,
  y,
  styles,
}: CreateShapeProps): RectangleShape => ({
  id: nanoid(),
  type: "rectangle",
  x,
  y,
  width: 100,
  height: 100,
  borderRadius: 0,
  ...styles,
});

const createCircle = ({ x, y, styles }: CreateShapeProps): CircleShape => ({
  id: nanoid(),
  type: "circle",
  x,
  y,
  radius: 50,
  startAngle: 0,
  endAngle: Math.PI * 2,
  ...styles,
});

const createPolygon = ({ x, y, styles }: CreateShapeProps): PolygonShape => ({
  id: nanoid(),
  type: "polygon",
  x,
  y,
  radius: 50,
  sides: 3,
  ...styles,
});

export const createShape = (props: CreateShapeProps): Shape => {
  switch (props.type) {
    case "rectangle":
      return createRectangle(props);
    case "circle":
      return createCircle(props);
    case "polygon":
      return createPolygon(props);
    default:
      throw new Error(`알수 없는 타입 :  ${props.type}`);
  }
};
