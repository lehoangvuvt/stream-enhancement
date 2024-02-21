"use client";

import { Element } from "@/app/types/element.types";
import { MouseEvent } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 200px;
  background-color: #1e1e1e;
  position: absolute;
  z-index: 100;
  animation: ElementContextMenuAppear 0.1s ease;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 5px;
  transform-origin: top;
  color: white;
  padding: 5px 0px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;

  @keyframes ElementContextMenuAppear {
    from {
      transform: scaleY(0);
    }
    to {
      transform: scaleY(1);
    }
  }
`;

const ContextMenuItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 13px;
  padding: 5px 15px;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    background-color: #0099ff;
    color: white;
  }
  &.disabled {
    &:hover {
      background-color: transparent;
    }
    cursor: not-allowed;
    color: rgba(255, 255, 255, 0.6);
  }
`;

type Props = {
  x: number;
  y: number;
  selectEleId: string;
  deleteElement: () => void;
  copyElement: () => void;
  pasteElement: (cord: { x: number; y: number }) => void;
  copiedElement: Element | null;
};

const ElementContextMenu: React.FC<Props> = ({
  x,
  y,
  selectEleId,
  deleteElement,
  copyElement,
  pasteElement,
  copiedElement,
}) => {
  return (
    <Container
      style={{
        left: x + "px",
        top: y + "px",
      }}
    >
      {selectEleId !== "" && (
        <>
          <ContextMenuItem onClick={deleteElement}>Delete</ContextMenuItem>
          <ContextMenuItem onClick={copyElement}>Copy</ContextMenuItem>
        </>
      )}
      <ContextMenuItem
        className={copiedElement ? "" : "disabled"}
        onClick={(e: MouseEvent) => pasteElement({ x: e.pageX, y: e.pageY })}
      >
        Paste here
      </ContextMenuItem>
    </Container>
  );
};

export default ElementContextMenu;
