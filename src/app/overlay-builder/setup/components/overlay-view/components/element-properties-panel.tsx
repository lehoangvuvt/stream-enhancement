"use client";

import { ELEMENT_TYPES, Element } from "@/types/element.types";
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
    if (selectedElement?.details.type !== ELEMENT_TYPES.TEXT) return null;
    return (
      <>
        <PropertyContainer>
          <PropertyHeader>Nội dung</PropertyHeader>
          <PropertyValue>
            <input
              value={selectedElement.details.text}
              onChange={(e) => {
                const updatedElement = Object.assign({}, selectedElement);
                if (updatedElement.details.type === ELEMENT_TYPES.TEXT) {
                  updatedElement.details.text = e.target.value;
                  updateElement(updatedElement);
                }
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
              value={
                selectedElement.style.fontSize
                  ? parseInt(
                      selectedElement.style.fontSize
                        .toString()
                        .replace("px", "")
                    )
                  : 10
              }
              onChange={(e) => {
                const updatedElement = Object.assign({}, selectedElement);
                if (updatedElement.details.type === ELEMENT_TYPES.TEXT) {
                  updatedElement.style.fontSize = e.target.value + "px";
                  updateElement(updatedElement);
                }
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
              color={selectedElement.style.color ?? "#000000"}
              onChange={(color) => {
                const updatedElement = Object.assign({}, selectedElement);
                if (updatedElement.details.type === ELEMENT_TYPES.TEXT) {
                  updatedElement.style.color = color;
                  updateElement(updatedElement);
                }
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
      selectedElement?.details.type !== ELEMENT_TYPES.IMAGE &&
      selectedElement?.details.type !== ELEMENT_TYPES.SQUARE
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
                if (
                  updatedElement.details.type === ELEMENT_TYPES.IMAGE ||
                  updatedElement.details.type === ELEMENT_TYPES.SQUARE
                ) {
                  if (!updatedElement.style.width) return;
                  const currentWidth = parseInt(
                    updatedElement.style.width.toString().replace("px", "")
                  );
                  const updatedWidth = currentWidth - step;
                  updatedElement.style.width = updatedWidth + "px";
                  updateElement(updatedElement);
                }
              }}
              increment={(step) => {
                const updatedElement = structuredClone(selectedElement);
                if (
                  updatedElement.details.type === ELEMENT_TYPES.IMAGE ||
                  updatedElement.details.type === ELEMENT_TYPES.SQUARE
                ) {
                  if (!updatedElement.style.width) return;
                  const currentWidth = parseInt(
                    updatedElement.style.width.toString().replace("px", "")
                  );
                  const updatedWidth = currentWidth + step;
                  updatedElement.style.width = updatedWidth + "px";
                  updateElement(updatedElement);
                }
              }}
              onChange={(value) => {
                const updatedElement = structuredClone(selectedElement);
                if (
                  updatedElement.details.type === ELEMENT_TYPES.IMAGE ||
                  updatedElement.details.type === ELEMENT_TYPES.SQUARE
                ) {
                  updatedElement.style.width = value + "px";
                  updateElement(updatedElement);
                }
              }}
              value={
                selectedElement.style.width
                  ? parseInt(
                      selectedElement.style.width.toString().replace("px", "")
                    )
                  : 0
              }
            />
          </PropertyContainer>
          <PropertyContainer style={{ width: "50%" }}>
            <HScrollInput
              title="H"
              decrement={(step) => {
                const updatedElement = structuredClone(selectedElement);
                if (
                  updatedElement.details.type === ELEMENT_TYPES.IMAGE ||
                  updatedElement.details.type === ELEMENT_TYPES.SQUARE
                ) {
                  if (!updatedElement.style.height) return;
                  const currentHeight = parseInt(
                    updatedElement.style.height.toString().replace("px", "")
                  );
                  const updatedHeight = currentHeight - step;
                  updatedElement.style.height = updatedHeight + "px";
                  updateElement(updatedElement);
                }
              }}
              increment={(step) => {
                const updatedElement = structuredClone(selectedElement);
                if (
                  updatedElement.details.type === ELEMENT_TYPES.IMAGE ||
                  updatedElement.details.type === ELEMENT_TYPES.SQUARE
                ) {
                  if (!updatedElement.style.height) return;
                  const currentHeight = parseInt(
                    updatedElement.style.height.toString().replace("px", "")
                  );
                  const updatedHeight = currentHeight + step;
                  updatedElement.style.height = updatedHeight + "px";
                  updateElement(updatedElement);
                }
              }}
              onChange={(value) => {
                const updatedElement = structuredClone(selectedElement);
                if (
                  updatedElement.details.type === ELEMENT_TYPES.IMAGE ||
                  updatedElement.details.type === ELEMENT_TYPES.SQUARE
                ) {
                  updatedElement.style.height = value + "px";
                  updateElement(updatedElement);
                }
              }}
              value={
                selectedElement.style.height
                  ? parseInt(
                      selectedElement.style.height.toString().replace("px", "")
                    )
                  : 0
              }
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
                if (!updatedElement.style.transform) return;
                const currentRotate = parseInt(
                  updatedElement.style.transform
                    .toString()
                    .split("(")[1]
                    .replace("deg", "")
                    .replace(")", "")
                );
                const updatedRotate = currentRotate - step;
                updatedElement.style.transform = `rotate(${updatedRotate}deg)`;
                updateElement(updatedElement);
              }}
              increment={(step) => {
                const updatedElement = structuredClone(selectedElement);
                if (!updatedElement.style.transform) return;
                const currentRotate = parseInt(
                  updatedElement.style.transform
                    .toString()
                    .split("(")[1]
                    .replace("deg", "")
                    .replace(")", "")
                );
                const updatedRotate = currentRotate + step;
                updatedElement.style.transform = `rotate(${updatedRotate}deg)`;
                updateElement(updatedElement);
              }}
              onChange={(value) => {
                const updatedElement = structuredClone(selectedElement);
                updatedElement.style.transform = `rotate(${value}deg)`;
                updateElement(updatedElement);
              }}
              value={
                selectedElement.style.transform
                  ? parseInt(
                      selectedElement.style.transform
                        .toString()
                        .split("(")[1]
                        .replace("deg", "")
                        .replace(")", "")
                    )
                  : 0
              }
            />
          </PropertyContainer>
          <PropertyContainer style={{ width: "50%" }}>
            <HScrollInput
              title="B"
              decrement={(step) => {
                const updatedElement = structuredClone(selectedElement);
                if (updatedElement.details.type !== ELEMENT_TYPES.TEXT) {
                  console.log(updatedElement.style);
                  if (!updatedElement.style.borderRadius) return;
                  const currentRadius = parseInt(
                    updatedElement.style.borderRadius
                      .toString()
                      .replace("px", "")
                  );

                  const updatedRadius = currentRadius - step;
                  updatedElement.style.borderRadius = updatedRadius + "px";
                  updateElement(updatedElement);
                }
              }}
              increment={(step) => {
                const updatedElement = structuredClone(selectedElement);
                if (updatedElement.details.type !== ELEMENT_TYPES.TEXT) {
                  if (!updatedElement.style.borderRadius) return;
                  const currentRadius = parseInt(
                    updatedElement.style.borderRadius
                      .toString()
                      .replace("px", "")
                  );
                  const updatedRadius = currentRadius + step;
                  updatedElement.style.borderRadius = updatedRadius + "px";
                  updateElement(updatedElement);
                }
              }}
              onChange={(value) => {
                const updatedElement = structuredClone(selectedElement);
                if (updatedElement.details.type !== ELEMENT_TYPES.TEXT) {
                  updatedElement.style.borderRadius = value + "px";
                  updateElement(updatedElement);
                }
              }}
              value={
                selectedElement.style.borderRadius
                  ? parseInt(
                      selectedElement.style.borderRadius
                        .toString()
                        .replace("px", "")
                    )
                  : 0
              }
            />
          </PropertyContainer>
        </div>
        {selectedElement.details.type === ELEMENT_TYPES.SQUARE && (
          <>
            <PropertyContainer>
              <PropertyHeader>Màu nền</PropertyHeader>
              <PropertyValue>
                <ColorInput
                  color={selectedElement.style.backgroundColor ?? "#000000"}
                  onChange={(color) => {
                    const updatedElement = Object.assign({}, selectedElement);
                    if (updatedElement.details.type === ELEMENT_TYPES.SQUARE) {
                      updatedElement.style.backgroundColor = color;
                      updateElement(updatedElement);
                    }
                  }}
                />
              </PropertyValue>
            </PropertyContainer>
          </>
        )}
        {selectedElement.details.type === ELEMENT_TYPES.IMAGE && (
          <PropertyContainer>
            <PropertyHeader>Hình ảnh</PropertyHeader>
            <PropertyValue>
              <input
                value={selectedElement.details.url}
                onChange={(e) => {
                  const updatedElement = Object.assign({}, selectedElement);
                  if (updatedElement.details.type === ELEMENT_TYPES.IMAGE) {
                    updatedElement.details.url = e.target.value;
                    updateElement(updatedElement);
                  }
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
      {selectedElement?.details.type === ELEMENT_TYPES.TEXT &&
        renderTextElementProperties()}
      {(selectedElement?.details.type === ELEMENT_TYPES.IMAGE ||
        selectedElement?.details.type === ELEMENT_TYPES.SQUARE) &&
        renderImgElementProperties()}
    </Container>
  );
};

export default ElementPropertiesPanel;
