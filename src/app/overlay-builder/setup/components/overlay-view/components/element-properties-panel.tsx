"use client";

import { ELEMENT_TYPES, Element } from "@/app/types/element.types";
import ColorInput from "@/components/color-input";
import HScrollInput from "@/components/h-scoll-input/HScrollInput";
import { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  padding: 15px 15px;
  box-sizing: border-box;
`;

const PropertyContainer = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column;
  margin-bottom: 15px;
`;

const PropertyHeader = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column;
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.6);
`;

const PropertyValue = styled.div`
  width: 100%;
  font-size: 15px;
`;

const PropertyValueTabs = styled.div`
  width: 100%;
  display: flex;
  display: flex;
  border-radius: 5px;
  margin-top: 5px;
  overflow: hidden;
`;

const PropertyValueTab = styled.div`
  flex: 1;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 15px;
`;

type Props = {
  selectedElement: Element | null;
  updateElement: (updatedElement: Element) => void;
};

const ElementPropertiesPanel: React.FC<Props> = ({
  selectedElement,
  updateElement,
}) => {
  const renderTextElementProperties = () => {
    if (selectedElement?.type !== ELEMENT_TYPES.TEXT) return null;
    return (
      <>
        <PropertyContainer>
          <PropertyHeader>Nội dung</PropertyHeader>
          <PropertyValue>
            <input
              value={selectedElement.text}
              onChange={(e) => {
                const updatedElement = Object.assign({}, selectedElement);
                updatedElement.text = e.target.value;
                updateElement(updatedElement);
              }}
              style={{
                outline: "none",
                width: "90%",
                padding: "10px",
                border: "1px solid rgba(0,0,0,0.25)",
                borderRadius: "4px",
              }}
            />
          </PropertyValue>
        </PropertyContainer>
        <PropertyContainer>
          <PropertyHeader>Kích thước chữ</PropertyHeader>
          <PropertyValue>
            <select
              style={{ width: "50px", height: "26px", outline: "none" }}
              value={selectedElement.font_size}
              onChange={(e) => {
                const updatedElement = Object.assign({}, selectedElement);
                updatedElement.font_size = parseInt(e.target.value);
                updateElement(updatedElement);
              }}
            >
              {Array(51)
                .fill("")
                .map((_, index) => (
                  <option key={index} value={index + 10}>
                    {index + 10}
                  </option>
                ))}
            </select>{" "}
            px
          </PropertyValue>
        </PropertyContainer>
        <PropertyContainer>
          <PropertyHeader>Màu sắc</PropertyHeader>
          <PropertyValue>
            <ColorInput
              color={selectedElement.font_color}
              onChange={(color) => {
                const updatedElement = Object.assign({}, selectedElement);
                updatedElement.font_color = color;
                updateElement(updatedElement);
              }}
            />
          </PropertyValue>
        </PropertyContainer>
        <PropertyContainer>
          <PropertyHeader>Độ đậm</PropertyHeader>
          <PropertyValue>
            <PropertyValueTabs>
              <PropertyValueTab>Thường</PropertyValueTab>
              <PropertyValueTab>Đậm</PropertyValueTab>
              <PropertyValueTab>Rất đậm</PropertyValueTab>
            </PropertyValueTabs>
          </PropertyValue>
        </PropertyContainer>
      </>
    );
  };

  const renderImgElementProperties = () => {
    if (
      selectedElement?.type !== ELEMENT_TYPES.IMAGE &&
      selectedElement?.type !== ELEMENT_TYPES.SQUARE
    )
      return null;
    return (
      <>
        <div style={{ width: "100%", display: "flex", flexFlow: "row wrap" }}>
          <PropertyContainer style={{ width: "50%" }}>
            <HScrollInput
              title="W"
              decrement={(step) => {
                const updatedElement = structuredClone(selectedElement);
                updatedElement.width = updatedElement.width - step;
                updateElement(updatedElement);
              }}
              increment={(step) => {
                const updatedElement = structuredClone(selectedElement);
                updatedElement.width += step;
                updateElement(updatedElement);
              }}
              onChange={(value) => {
                const updatedElement = structuredClone(selectedElement);
                updatedElement.width = value;
                updateElement(updatedElement);
              }}
              value={selectedElement.width}
            />
          </PropertyContainer>
          <PropertyContainer style={{ width: "50%" }}>
            <HScrollInput
              title="H"
              decrement={(step) => {
                const updatedElement = structuredClone(selectedElement);
                updatedElement.height = updatedElement.height - step;
                updateElement(updatedElement);
              }}
              increment={(step) => {
                const updatedElement = structuredClone(selectedElement);
                updatedElement.height += step;
                updateElement(updatedElement);
              }}
              onChange={(value) => {
                const updatedElement = structuredClone(selectedElement);
                updatedElement.height = value;
                updateElement(updatedElement);
              }}
              value={selectedElement.height}
            />
          </PropertyContainer>
          <PropertyContainer style={{ width: "50%" }}>
            <HScrollInput
              title="X"
              decrement={(step) => {
                const updatedElement = structuredClone(selectedElement);
                if (
                  updatedElement.relativeCoords?.hasOwnProperty("x") &&
                  updatedElement.coords?.hasOwnProperty("x")
                ) {
                  updatedElement.coords.x -= step;
                  updatedElement.relativeCoords.x -= step;
                  updateElement(updatedElement);
                }
              }}
              increment={(step) => {
                const updatedElement = structuredClone(selectedElement);
                if (
                  updatedElement.relativeCoords?.hasOwnProperty("x") &&
                  updatedElement.coords?.hasOwnProperty("x")
                ) {
                  updatedElement.coords.x += step;
                  updatedElement.relativeCoords.x += step;
                  updateElement(updatedElement);
                }
              }}
              onChange={(value) => {
                const updatedElement = structuredClone(selectedElement);
                if (
                  updatedElement.relativeCoords?.hasOwnProperty("x") &&
                  updatedElement.coords?.hasOwnProperty("x")
                ) {
                  let diff = 0;
                  if (value <= updatedElement.relativeCoords.x) {
                    diff = updatedElement.relativeCoords.x - value;
                    updatedElement.relativeCoords.x = value;
                    updatedElement.coords.x -= diff;
                  } else {
                    diff = value - updatedElement.relativeCoords.x;
                    updatedElement.relativeCoords.x = value;
                    updatedElement.coords.x += diff;
                  }
                  updateElement(updatedElement);
                }
              }}
              value={selectedElement.relativeCoords?.x ?? 0}
            />
          </PropertyContainer>
          <PropertyContainer style={{ width: "50%" }}>
            <HScrollInput
              title="Y"
              decrement={(step) => {
                const updatedElement = structuredClone(selectedElement);
                if (
                  updatedElement.relativeCoords?.y &&
                  updatedElement.coords?.y
                ) {
                  updatedElement.coords.y -= step;
                  updatedElement.relativeCoords.y -= step;
                  updateElement(updatedElement);
                }
              }}
              increment={(step) => {
                const updatedElement = structuredClone(selectedElement);
                if (
                  updatedElement.relativeCoords?.y &&
                  updatedElement.coords?.y
                ) {
                  updatedElement.coords.y += step;
                  updatedElement.relativeCoords.y += step;
                  updateElement(updatedElement);
                }
              }}
              onChange={(value) => {
                const updatedElement = structuredClone(selectedElement);
                if (
                  updatedElement.relativeCoords?.hasOwnProperty("y") &&
                  updatedElement.coords?.hasOwnProperty("y")
                ) {
                  let diff = 0;
                  if (value <= updatedElement.relativeCoords.y) {
                    diff = updatedElement.relativeCoords.y - value;
                    updatedElement.relativeCoords.y = value;
                    updatedElement.coords.y -= diff;
                  } else {
                    diff = value - updatedElement.relativeCoords.y;
                    updatedElement.relativeCoords.y = value;
                    updatedElement.coords.y += diff;
                  }
                  updateElement(updatedElement);
                }
              }}
              value={selectedElement.relativeCoords?.y ?? 0}
            />
          </PropertyContainer>
          <PropertyContainer style={{ width: "50%" }}>
            <HScrollInput
              title="R"
              decrement={(step) => {
                const updatedElement = structuredClone(selectedElement);
                updatedElement.rotate -= step;
                updateElement(updatedElement);
              }}
              increment={(step) => {
                const updatedElement = structuredClone(selectedElement);
                updatedElement.rotate += step;
                updateElement(updatedElement);
              }}
              onChange={(value) => {
                const updatedElement = structuredClone(selectedElement);
                updatedElement.rotate = value;
                updateElement(updatedElement);
              }}
              value={selectedElement.rotate}
            />
          </PropertyContainer>
          <PropertyContainer style={{ width: "50%" }}>
            <HScrollInput
              title="B"
              decrement={(step) => {
                const updatedElement = structuredClone(selectedElement);
                updatedElement.borderRadius -= step;
                updateElement(updatedElement);
              }}
              increment={(step) => {
                const updatedElement = structuredClone(selectedElement);
                updatedElement.borderRadius += step;
                updateElement(updatedElement);
              }}
              onChange={(value) => {
                const updatedElement = structuredClone(selectedElement);
                updatedElement.borderRadius = value;
                updateElement(updatedElement);
              }}
              value={selectedElement.borderRadius}
            />
          </PropertyContainer>
        </div>
        {selectedElement.type === ELEMENT_TYPES.SQUARE && (
          <>
            <PropertyContainer>
              <PropertyHeader>Màu nền</PropertyHeader>
              <PropertyValue>
                <ColorInput
                  color={selectedElement.backgroundColor}
                  onChange={(color) => {
                    const updatedElement = Object.assign({}, selectedElement);
                    updatedElement.backgroundColor = color;
                    updateElement(updatedElement);
                  }}
                />
              </PropertyValue>
            </PropertyContainer>
          </>
        )}
        {selectedElement.type === ELEMENT_TYPES.IMAGE && (
          <PropertyContainer>
            <PropertyHeader>Hình ảnh</PropertyHeader>
            <PropertyValue>
              <input
                value={selectedElement.url}
                onChange={(e) => {
                  const updatedElement = Object.assign({}, selectedElement);
                  updatedElement.url = e.target.value;
                  updateElement(updatedElement);
                }}
              />
            </PropertyValue>
          </PropertyContainer>
        )}
      </>
    );
  };

  return (
    <Container>
      {selectedElement?.type === ELEMENT_TYPES.TEXT &&
        renderTextElementProperties()}
      {(selectedElement?.type === ELEMENT_TYPES.IMAGE ||
        selectedElement?.type === ELEMENT_TYPES.SQUARE) &&
        renderImgElementProperties()}
    </Container>
  );
};

export default ElementPropertiesPanel;
