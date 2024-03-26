import React from "react";
import styled from "styled-components";
import OverlayViewRO from "../overlay-view-ro";
import { Layout } from "@/types/element.types";

type Props = {
  layout: Layout;
  width: string;
  onClick: () => void;
};

const Container = styled.div`
  display: flex;
  flex-flow: column wrap;
  background-color: rgba(0, 0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 5px;
  gap: 10px;

  &:hover {
    transform: translate(2.5px, -2.5px);
    background-color: #252830;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.5);
  }
`;

const LayoutInfo = styled.div`
  width: 100%;
  padding: 5px 10px;
  display: flex;
  flex-flow: column wrap;
  gap: 10px;
  box-sizing: border-box;
  & > div {
    width: 100%;
    font-size: 15px;
    &:nth-child(1) {
      color: #ffffff;
      font-weight: 700;
    }
    &:nth-child(2) {
      font-weight: 400;
      color: rgba(255, 255, 255, 0.5);
    }
    &:nth-child(3) {
      display: flex;
      flex-flow: row wrap;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 5px;
      margin-bottom: 5px;
      div {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        padding: 6px;
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.1s ease;
        &:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }
      }
    }
  }
`;

const TemplateItem: React.FC<Props> = ({ layout, width, onClick }) => {
  return (
    <Container onClick={onClick} style={{ width: width }}>
      <div
        style={{
          width: "100%",
          aspectRatio: 16 / 9,
        }}
      >
        <OverlayViewRO overlayMetadata={layout.overlayMetadata} />
      </div>
      <LayoutInfo>
        <div>{layout.title}</div>
        <div>{layout.authorName}</div>
        <div>
          {layout.tags.map((tag) => (
            <div onClick={() => {}} key={tag}>
              #{tag}
            </div>
          ))}
        </div>
      </LayoutInfo>
    </Container>
  );
};

export default TemplateItem;
