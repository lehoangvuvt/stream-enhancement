"use client";

import { XYCoord, useDrop } from "react-dnd";
import styled from "styled-components";
import OverlayElement from "./components/overlay-element";
import { useEffect, useState } from "react";
import { ELEMENT_TYPES, Element } from "@/app/types/element.types";
import { OverlayMetadata } from "../overlay-builder/setup/page";

const Container = styled.div<{ $ratio: [number, number]; $bgURL: string }>`
  width: 100%;
  height: 100%;
  /* aspect-ratio: ${(props) => props.$ratio[0] / props.$ratio[1]}; */
  background: ${(props) => `url("${props.$bgURL}")`};
  background-size: cover;
  background-position: center;
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
`;

type Props = {
  updateElementCoords: (newCoords: XYCoord, index: number) => void;
  removeElement: (elementId: string) => void;
  addText: (coords: XYCoord | null) => void;
  selectElement: (elementId: string) => void;
};

const Iframe: React.FC<Props> = ({
  updateElementCoords,
  removeElement,
  addText,
  selectElement,
}) => {
  const [selectedEleId, setSelectedEleId] = useState("");
  const [overlayMetadata, setOverlayMetadata] =
    useState<OverlayMetadata | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("layout")) return;
    const overlayMetadata = JSON.parse(
      localStorage.getItem("layout")!
    ) as OverlayMetadata;
    setOverlayMetadata(overlayMetadata);
  }, []);

  return (
    <Container
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          selectElement("");
          setSelectedEleId("");
        }
      }}
      $ratio={overlayMetadata?.background_ratio ?? [0, 0]}
      $bgURL={overlayMetadata?.background_url ?? ""}
    >
      {/* {isActive ? "Release to drop" : "Drag a box here"} */}
      {overlayMetadata?.elements.map((element, i) => (
        <OverlayElement
          updateCoords={(newCoords, index) =>
            updateElementCoords(newCoords, index)
          }
          key={element.id}
          index={i}
          elementItem={element}
          selected={selectedEleId === element.id}
          onClick={() => {
            setSelectedEleId(element.id);
            selectElement(element.id);
          }}
        />
      ))}
    </Container>
  );
};

export default Iframe;
