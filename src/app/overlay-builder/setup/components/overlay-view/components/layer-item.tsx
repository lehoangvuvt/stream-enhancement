"use client";

import { Element } from "@/app/types/element.types";
import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 35px;
  display: flex;
  font-size: 13px;
  box-sizing: border-box;
  padding-left: 25px;
  font-weight: 500;
  padding-right: 25px;
  display: flex;
  align-items: center;
  border: 1px solid transparent;
  user-select: none;
  justify-content: space-between;
  .options {
    display: flex;
    font-size: 11px;
    color: rgba(0, 0, 0, 0.6);
    cursor: pointer;
    align-items: center;
    gap: 5px;
  }
  &.selected {
    background-color: #e3f2fd;
  }
  &.not-selected {
    &:hover {
      background-color: transparent;
      border: 1px solid #64b5f6;
      .options {
        display: flex;
      }
    }
  }
`;

type Props = {
  element: Element;
  selected: boolean;
  setSelectedElementId: (elementId: string) => void;
  updateElementState: (state: number, elementId: string) => void;
  reorderElement: (elementId: string, type: "up" | "down") => void;
};

const LayerItem: React.FC<Props> = ({
  element,
  selected,
  setSelectedElementId,
  updateElementState,
  reorderElement,
}) => {
  return (
    <Container
      onClick={() => {
        setSelectedElementId(element.id);
      }}
      style={{
        opacity: element.isShow ? 1 : 0.5,
      }}
      className={selected ? "selected" : "not-selected"}
    >
      {element.id}, {element.order}
      <div className="options">
        <button
          onClick={() => {
            if (element.isShow) {
              updateElementState(0, element.id);
            } else {
              updateElementState(1, element.id);
            }
          }}
        >
          {element.isShow ? "Hide" : "Show"}
        </button>
        <button onClick={() => reorderElement(element.id, "down")}>D</button>
        <button onClick={() => reorderElement(element.id, "up")}>U</button>
      </div>
    </Container>
  );
};

export default LayerItem;
