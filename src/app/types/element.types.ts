import { XYCoord } from "react-dnd";

export enum ELEMENT_TYPES {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  SQUARE = "SQUARE",
}

export type TextElement = {
  type: ELEMENT_TYPES.TEXT;
  text: string;
};

export type ImageElement = {
  type: ELEMENT_TYPES.IMAGE;
  url: string;
};

export type SquareElement = {
  type: ELEMENT_TYPES.SQUARE;
};

export enum CURSOR_TOOL_OPTIONS {
  DEFAULT,
  ZONE_SELECT,
}

export type Element = {
  id: string;
  coords: XYCoord | null;
  relativeCoords: XYCoord | null;
  style: React.CSSProperties;
  details: TextElement | ImageElement | SquareElement;
};
