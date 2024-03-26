"use client";

import styled from "styled-components";
import { OverlayMetadata } from "@/app/overlay-builder/setup/page";
import OverlayElement from "@/app/overlay-builder/setup/components/overlay-view/components/overlay-element";
import { CURSOR_TOOL_OPTIONS } from "@/types/element.types";
import { useEffect, useRef, useState } from "react";

const Container = styled.div<{ $ratio: [number, number]; $bgURL: string }>`
  width: 100%;
  background-color: white;
  aspect-ratio: 16/9;
  background-image: ${(props) => `url("${props.$bgURL}")`};
  background-size: cover;
  background-position: center;
  overflow: hidden;
  position: relative;
  pointer-events: none;
`;

type Props = {
  overlayMetadata: OverlayMetadata;
};

const OverlayViewRO: React.FC<Props> = ({ overlayMetadata }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ratio, setRatio] = useState(0);

  useEffect(() => {
    if (containerRef && containerRef.current) {
      const parentEle = containerRef.current.parentElement;
      if (!parentEle) return;
      const ratio = parseFloat(
        (parentEle.clientWidth / containerRef.current.clientWidth).toFixed(4)
      );
      setRatio(ratio);
    }
  }, []);
  return (
    <div
      ref={containerRef}
      style={{
        width: "100vw",
        position: "absolute",
        display: "flex",
        transform: `scale(${ratio})`,
        transformOrigin: "left top",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container
        id="drop-zone-element"
        $ratio={[16, 9]}
        $bgURL={overlayMetadata.background_url}
      >
        {overlayMetadata.elements.map((element, i) => (
          <OverlayElement
            updateCoords={() => {}}
            onClick={() => {}}
            selected={false}
            isInSelectZone={false}
            closeContextMenu={() => {}}
            openContextMenu={() => {}}
            currentCursorToolOption={CURSOR_TOOL_OPTIONS.DEFAULT}
            endDragging={() => {}}
            selectedEleId={""}
            startDragging={() => {}}
            updateElementSize={() => {}}
            key={element.id}
            index={i}
            elementItem={element}
          />
        ))}
      </Container>
    </div>
  );
};

export default OverlayViewRO;
