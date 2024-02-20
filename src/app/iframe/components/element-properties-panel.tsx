"use client";

import { ELEMENT_TYPES, Element } from "@/app/types/element.types";
import ColorInput from "@/components/color-input";
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
              style={{ width: "100px", height: "26px", outline: "none" }}
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

  return (
    <Container>
      {selectedElement?.type === ELEMENT_TYPES.TEXT &&
        renderTextElementProperties()}
    </Container>
  );
};

export default ElementPropertiesPanel;
