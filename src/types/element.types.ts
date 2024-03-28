import { XYCoord } from "react-dnd";
import { OverlayMetadata } from "../app/overlay-builder/setup/page";

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
  children?: Element[];
  order: number;
  isShow: boolean;
  details: TextElement | ImageElement | SquareElement;
};

export type Layout = {
  id: number;
  overlayMetadata: OverlayMetadata;
  authorName: string;
  name?: string;
  title: string;
  tags: string[];
  createdAt?: Date
};

export type Layout_API = {
  id: number;
  createdAt: Date;
  updatedAt: Date | null;
  name: string;
  tags: string[]
  metadata: string;
  authorId: number;
  status: 'draft' | 'published'
  author: {
    username: string;
    id: number;
    name: string | null;
  }
};
