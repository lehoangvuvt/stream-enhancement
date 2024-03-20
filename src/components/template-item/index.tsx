import React from "react";
import styled from "styled-components";
import OverlayViewRO from "../overlay-view-ro";
import { Layout } from "@/app/types/element.types";

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
  gap: 15px;

  &:hover {
    transform: translate(2.5px, -2.5px);
    background-color: #252830;
  }
`;

const LayoutInfo = styled.div`
  width: 100%;
  padding: 5px 10px;
  display: flex;
  flex-flow: column wrap;
  gap: 10px;
  & > div {
    width: 100%;
    font-size: 16px;
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
      div {
        font-size: 12px;
        color: white;
        background-color: rgba(255, 255, 255, 0.2);
        padding: 5px;
        white-space: nowrap;
      }
    }
  }
`;

const TemplateItem: React.FC<Props> = ({ layout, width, onClick }) => {
  return (
    <Container onClick={onClick} style={{ width: width }}>
      <div style={{ width: "100%", aspectRatio: 16 / 9 }}>
        <OverlayViewRO overlayMetadata={layout.overlayMetadata} />
      </div>
      <LayoutInfo>
        <div>{layout.title}</div>
        <div>{layout.authorName}</div>
        <div>
          {layout.tags.map((tag) => (
            <div key={tag}>#{tag}</div>
          ))}
        </div>
      </LayoutInfo>
    </Container>
  );
};

export default TemplateItem;