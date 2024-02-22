"use client";

import { XYCoord, useDrop } from "react-dnd";
import styled from "styled-components";
import { OverlayMetadata } from "../../page";
import OverlayElement from "./components/overlay-element";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import {
  CURSOR_TOOL_OPTIONS,
  ELEMENT_TYPES,
  Element,
} from "@/app/types/element.types";
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

const SelectZone = styled.div`
  border: 1px solid rgba(40, 67, 135, 1);
  background-color: rgba(40, 67, 135, 0.5);
  transform-origin: right;
  user-select: none;
  pointer-events: none;
`;

type Props = {
  overlayMetadata: OverlayMetadata;
  updateElementCoords: (newCoords: XYCoord, elementId: string) => void;
  removeElement: (elementId: string) => void;
  copyElement: (elementId: string) => void;
  addText: (coords: XYCoord | null) => void;
  addImage: (coords: XYCoord | null) => void;
  selectElement: (elementId: string) => void;
  updateElementSize: (
    newSize: { width: number; height: number },
    elementId: string
  ) => void;
  exportContainerRef: any;
  pasteElement: (cord: { x: number; y: number }) => void;
  copiedElement: Element | null;
  currentCursorToolOption: CURSOR_TOOL_OPTIONS;
};

const OverlayView: React.FC<Props> = ({
  overlayMetadata,
  updateElementCoords,
  removeElement,
  copyElement,
  pasteElement,
  addText,
  addImage,
  selectElement,
  updateElementSize,
  exportContainerRef,
  copiedElement,
  currentCursorToolOption,
}) => {
  const [selectedEleId, setSelectedEleId] = useState("");
  const [inSelectZoneIds, setInSelectZoneIds] = useState<string[]>([]);
  const [isOpenContextMenu, setOpenContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const { background_ratio, background_url } = overlayMetadata;
  const [isPress, setIsPress] = useState(false);
  const [startCoord, setStartCoord] = useState<{ x: number; y: number } | null>(
    null
  );
  const [endCord, setEndCoord] = useState<{ x: number; y: number } | null>(
    null
  );
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

  const handleMouseDown = (e: MouseEvent) => {
    if (currentCursorToolOption === CURSOR_TOOL_OPTIONS.ZONE_SELECT) {
      setIsPress(true);
      if (!startCoord) {
        setStartCoord({ x: e.pageX, y: e.pageY });
      }
      setEndCoord({ x: e.pageX, y: e.pageY });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (
      isPress &&
      currentCursorToolOption === CURSOR_TOOL_OPTIONS.ZONE_SELECT
    ) {
      setEndCoord({ x: e.pageX, y: e.pageY });
    }
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (currentCursorToolOption === CURSOR_TOOL_OPTIONS.ZONE_SELECT) {
      setIsPress(false);
      setStartCoord(null);
      setEndCoord(null);
    }
  };

  const checkIfInside = (
    ele: Element,
    startX: number,
    endX: number,
    minX: number,
    maxX: number,
    maxY: number,
    minY: number
  ) => {
    if (!ele.coords) return false;
    const eleX = ele.coords.x;
    const eleY = ele.coords?.y;
    const eleWith = document.getElementById(ele.id)!.offsetWidth;
    const eleHeight = document.getElementById(ele.id)!.offsetHeight;
    if (startX !== endX) {
      let isInsideX = false;
      let isInsideY = false;
      if (eleX - eleWith / 2 >= minX) {
        isInsideX = eleX - eleWith / 2 < maxX;
      } else {
        isInsideX = eleX + eleWith / 2 > minX;
      }
      if (eleY - eleHeight / 2 >= minY) {
        isInsideY = eleY - eleHeight / 2 < maxY;
      } else {
        isInsideY = eleY + eleHeight / 2 > minY;
      }
      return isInsideX && isInsideY;
    }
  };

  useEffect(() => {
    if (
      isPress &&
      startCoord &&
      endCord &&
      currentCursorToolOption === CURSOR_TOOL_OPTIONS.ZONE_SELECT
    ) {
      const startX = startCoord.x;
      const startY = startCoord.y;
      const endX = endCord.x;
      const endY = endCord.y;
      const minX = startX < endX ? startX : endX;
      const maxX = startX < endX ? endX : startX;
      const minY = startY < endY ? startY : endY;
      const maxY = startY < endY ? endY : startY;
      let inSelectZoneIds: string[] = [];
      overlayMetadata.elements.forEach((ele) => {
        const isInside = checkIfInside(
          ele,
          startX,
          endX,
          minX,
          maxX,
          maxY,
          minY
        );
        if (isInside) {
          inSelectZoneIds.push(ele.id);
        }
      });

      setInSelectZoneIds(inSelectZoneIds);
    }
  }, [isPress, startCoord, endCord, currentCursorToolOption, overlayMetadata]);

  return (
    <div
      onContextMenu={(e: MouseEvent) => {
        if (selectedEleId !== "") {
          setSelectedEleId("");
        }
        setContextMenuPos({ x: e.pageX, y: e.pageY });
        setOpenContextMenu(true);
      }}
      style={{
        width: "90%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      ref={exportContainerRef}
    >
      {isPress && startCoord && endCord && (
        <SelectZone
          style={{
            position: "absolute",
            top:
              startCoord.y < endCord.y ? `${startCoord.y}px` : `${endCord.y}px`,
            left:
              startCoord.x < endCord.x ? `${startCoord.x}px` : `${endCord.x}px`,
            width: `${Math.abs(startCoord.x - endCord.x)}px`,
            height: `${Math.abs(startCoord.y - endCord.y)}px`,
            zIndex: 10,
          }}
        />
      )}
      <Container
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseDown={handleMouseDown}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            if (currentCursorToolOption === CURSOR_TOOL_OPTIONS.DEFAULT) {
              setInSelectZoneIds([]);
            }
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
            currentCursorToolOption={currentCursorToolOption}
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
            isInSelectZone={inSelectZoneIds.includes(element.id)}
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
          selectEleId={selectedEleId}
          copiedElement={copiedElement}
          pasteElement={(coord) => pasteElement(coord)}
          copyElement={() => {
            setSelectedEleId("");
            setContextMenuPos({ x: 0, y: 0 });
            setOpenContextMenu(false);
            copyElement(selectedEleId);
          }}
          deleteElement={() => {
            removeElement(selectedEleId);
          }}
          key={selectedEleId}
          x={contextMenuPos.x}
          y={contextMenuPos.y}
        />
      )}
    </div>
  );
};

export default OverlayView;
