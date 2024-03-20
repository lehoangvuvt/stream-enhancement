import { OverlayMetadata } from "@/app/overlay-builder/setup/page";
import React from "react";
import styled from "styled-components";
import OverlayViewRO from "../overlay-view-ro";

type Props = {
  overlayMetadata: OverlayMetadata;
  width: string;
  onClick: () => void;
};

const Container = styled.div`
  aspect-ratio: 16/9;
  display: flex;
  flex-flow: column;
  background-color: rgba(0, 0, 0, 0, 0.1);
  overflow: hidden;
  position: relative;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    transform: translate(2.5px, -2.5px);
  }
`;

const TemplateItem: React.FC<Props> = ({ overlayMetadata, width, onClick }) => {
  return (
    <Container onClick={onClick} style={{ width: width }}>
      <OverlayViewRO overlayMetadata={overlayMetadata} />
    </Container>
  );
};

export default TemplateItem;
