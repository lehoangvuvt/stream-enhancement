"use client";

import { XYCoord, useDrop } from "react-dnd";
import styled from "styled-components";
import { OverlayMetadata } from "../../page";
import OverlayElement from "./components/overlay-element";
import { useEffect, useState } from "react";
import { ELEMENT_TYPES } from "@/app/types/element.types";
import ElementContextMenu from "./components/element-context-menu";

const Container = styled.div<{ $ratio: [number, number]; $bgURL: string }>`
  width: 100%;
  background-color: white;
  aspect-ratio: ${(props) => props.$ratio[0] / props.$ratio[1]};
  background-image: ${(props) => `url("${props.$bgURL}")`};
  background-size: cover;
  background-position: center;
  overflow: hidden;
  position: relative;
`;

type Props = {
  overlayMetadata: OverlayMetadata;
  updateElementCoords: (newCoords: XYCoord, elementId: string) => void;
  removeElement: (elementId: string) => void;
  addText: (coords: XYCoord | null) => void;
  addImage: (coords: XYCoord | null) => void;
  selectElement: (elementId: string) => void;
  updateElementSize: (
    newSize: { width: number; height: number },
    elementId: string
  ) => void;
  exportContainerRef: any;
};

const OverlayView: React.FC<Props> = ({
  overlayMetadata,
  updateElementCoords,
  removeElement,
  addText,
  addImage,
  selectElement,
  updateElementSize,
  exportContainerRef,
}) => {
  const [selectedEleId, setSelectedEleId] = useState("");
  const [isOpenContextMenu, setOpenContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const { background_ratio, background_url } = overlayMetadata;
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ["TEXT", "IMAGE"],
    drop: (item, monitor) => {
      const type = monitor.getItemType();
      switch (type) {
        case "TEXT":
          addText(monitor.getClientOffset());
          break;
        case "IMAGE":
          addImage(monitor.getClientOffset());
          break;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;

  const handleOnKeyDown = (e: KeyboardEvent) => {
    // if (e.key === "Delete" && selectedEleId !== "") {
    //   removeElement(selectedEleId);
    // }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleOnKeyDown);
    return () => window.removeEventListener("keydown", handleOnKeyDown);
  }, []);

  return (
    <div
      style={{
        width: "90%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      ref={exportContainerRef}
    >
      <Container
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            selectElement("");
            setSelectedEleId("");
            setOpenContextMenu(false);
          }
        }}
        ref={drop}
        $ratio={background_ratio}
        $bgURL={background_url}
      >
        {/* {isActive ? "Release to drop" : "Drag a box here"} */}
        {overlayMetadata.elements.map((element, i) => (
          <OverlayElement
            closeContextMenu={() => {
              setOpenContextMenu(false);
            }}
            openContextMenu={(pos, element) => {
              setContextMenuPos({ x: pos.x, y: pos.y });
              setOpenContextMenu(true);
              setSelectedEleId(element.id);
              selectElement(element.id);
            }}
            updateCoords={(newCoords, index) =>
              updateElementCoords(newCoords, element.id)
            }
            key={element.id}
            index={i}
            elementItem={element}
            selected={selectedEleId === element.id}
            updateElementSize={(newSize) => {
              if (element.type === ELEMENT_TYPES.IMAGE) {
                updateElementSize(newSize, element.id);
              }
            }}
            onClick={() => {
              setSelectedEleId(element.id);
              selectElement(element.id);
            }}
          />
        ))}
      </Container>

      {isOpenContextMenu && (
        <ElementContextMenu
          deleteElement={() => {
            removeElement(selectedEleId);
          }}
          key={contextMenuPos.x + "/" + contextMenuPos.y}
          x={contextMenuPos.x}
          y={contextMenuPos.y}
        />
      )}
    </div>
  );
};

export default OverlayView;
