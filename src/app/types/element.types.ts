import { XYCoord } from "react-dnd";

export enum ELEMENT_TYPES {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  SQUARE = "SQUARE",
}

export type TextElement = {
  type: ELEMENT_TYPES.TEXT;
  id: string;
  font_size: number;
  font_color: string;
  font_weight: number;
  opacity: number;
  text: string;
  coords: XYCoord | null;
  rotate: number;
  relativeCoords: XYCoord | null;
};

export type ImageElement = {
  type: ELEMENT_TYPES.IMAGE;
  id: string;
  url: string;
  width: number;
  height: number;
  coords: XYCoord | null;
  relativeCoords: XYCoord | null;
  rotate: number;
  borderRadius: number;
};

export type SquareElement = {
  type: ELEMENT_TYPES.SQUARE;
  id: string;
  backgroundColor: string;
  width: number;
  height: number;
  coords: XYCoord | null;
  relativeCoords: XYCoord | null;
  rotate: number;
  borderRadius: number;
};

export enum CURSOR_TOOL_OPTIONS {
  DEFAULT,
  ZONE_SELECT,
}

export type Element = TextElement | ImageElement | SquareElement;
