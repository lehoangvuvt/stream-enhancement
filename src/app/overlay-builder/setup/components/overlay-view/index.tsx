"use client";

import { XYCoord, useDrop } from "react-dnd";
import styled from "styled-components";
import { OverlayMetadata } from "../../page";
import OverlayElement from "./components/overlay-element";
import {
  MouseEvent as MouseEventReact,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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

const CenterLine = styled.div`
  width: 1px;
  height: 100%;
  position: absolute;
  z-index: 50;
  background-color: #ffcc80;
  transform: translateX(-50%);
  left: 50%;
  user-select: none;
  pointer-events: none;
`;

const MiddleLine = styled.div`
  height: 1px;
  width: 100%;
  position: absolute;
  z-index: 50;
  background-color: #ffcc80;
  transform: translateY(-50%);
  left: 0;
  top: 50%;
  user-select: none;
  pointer-events: none;
`;

type Props = {
  overlayMetadata: OverlayMetadata;
  updateElementCoords: (newCoords: XYCoord, elementId: string) => void;
  removeElement: (elementId: string) => void;
  copyElement: (elementId: string) => void;
  addText: (coords: XYCoord | null, relativeCoords: XYCoord | null) => void;
  addImage: (coords: XYCoord | null, relativeCoords: XYCoord | null) => void;
  addSquare: (coords: XYCoord | null, relativeCoords: XYCoord | null) => void;
  selectElement: (elementId: string) => void;
  updateElementSize: (
    newSize: { width: number; height: number },
    elementId: string
  ) => void;
  exportContainerRef: any;
  pasteElement: (cord: { x: number; y: number }) => void;
  pasteMultipleElements: (cord: { x: number; y: number }) => void;
  copiedElement: Element | null;
  copiedElements: Element[];
  currentCursorToolOption: CURSOR_TOOL_OPTIONS;
  inSelectZoneIds: string[];
  setInSelectZoneIds: (ids: string[]) => void;
  setCopyType: (type: "copy" | "cut") => void;
};

const OverlayView: React.FC<Props> = ({
  overlayMetadata,
  updateElementCoords,
  removeElement,
  copyElement,
  pasteElement,
  pasteMultipleElements,
  addText,
  addImage,
  addSquare,
  selectElement,
  updateElementSize,
  exportContainerRef,
  copiedElement,
  copiedElements,
  currentCursorToolOption,
  inSelectZoneIds,
  setInSelectZoneIds,
  setCopyType,
}) => {
  const centerLineRef = useRef<HTMLDivElement>(null);
  const middleLineRef = useRef<HTMLDivElement>(null);
  const [selectedEleId, setSelectedEleId] = useState("");
  const [isOpenContextMenu, setOpenContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const { background_ratio, background_url } = overlayMetadata;
  const [isPress, setIsPress] = useState(false);
  const [isDraggingElement, setDraggingElement] = useState(false);
  const [isCenter, setCenter] = useState(false);
  const [isMiddle, setMiddle] = useState(false);
  const [startCoord, setStartCoord] = useState<{ x: number; y: number } | null>(
    null
  );
  const [endCord, setEndCoord] = useState<{ x: number; y: number } | null>(
    null
  );
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: ["TEXT", "IMAGE", "SQUARE"],
    drop: (item, monitor) => {
      const type = monitor.getItemType();
      const clientOffset = monitor.getClientOffset();
      const dropElement = document.getElementById("drop-zone-element");
      const relativeCoords: XYCoord = {
        x: 0,
        y: 0,
      };
      if (clientOffset && dropElement) {
        relativeCoords.x =
          clientOffset.x - dropElement.getBoundingClientRect().x;
        relativeCoords.y =
          clientOffset.y - dropElement.getBoundingClientRect().y;
      }
      switch (type) {
        case "TEXT":
          addText(monitor.getClientOffset(), relativeCoords);
          break;
        case "IMAGE":
          relativeCoords.x -= 50;
          relativeCoords.y -= 50;
          addImage(monitor.getClientOffset(), relativeCoords);
          break;
        case "SQUARE":
          relativeCoords.x -= 50;
          relativeCoords.y -= 50;
          addSquare(monitor.getClientOffset(), relativeCoords);
          break;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;

  const handleMouseDown = (e: MouseEventReact) => {
    if (currentCursorToolOption === CURSOR_TOOL_OPTIONS.ZONE_SELECT) {
      setIsPress(true);
      if (!startCoord) {
        setStartCoord({ x: e.pageX, y: e.pageY });
      }
      setEndCoord({ x: e.pageX, y: e.pageY });
    }
  };

  const handleMouseMove = (e: MouseEventReact) => {
    if (
      isPress &&
      currentCursorToolOption === CURSOR_TOOL_OPTIONS.ZONE_SELECT
    ) {
      setEndCoord({ x: e.pageX, y: e.pageY });
    }
  };

  const handleMouseUp = (e: MouseEventReact) => {
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

  const handleMouseMove2 = useCallback(
    (e: MouseEvent) => {
      if (
        centerLineRef?.current &&
        middleLineRef?.current &&
        isDraggingElement
      ) {
        const offset = 10;
        const centerLineX = centerLineRef.current.getBoundingClientRect().x;
        const centerLineWidth = centerLineRef.current.clientWidth;
        const middleLineY = centerLineRef.current.getBoundingClientRect().y;
        const middleLineHeight = centerLineRef.current.clientHeight;
        const centerPointX = centerLineX + centerLineWidth / 2;
        const middlePointY = middleLineY + middleLineHeight / 2;
        const isCenter = Math.abs(e.pageX - centerPointX) <= offset;
        const isMiddle = Math.abs(e.pageY - middlePointY) <= offset;
        const x = isCenter ? centerPointX : e.pageX;
        const y = isMiddle ? middlePointY : e.pageY;
        setCenter(isCenter);
        setMiddle(isMiddle);
        updateElementCoords({ x, y }, selectedEleId);
      }
    },
    [isDraggingElement, selectedEleId, updateElementCoords]
  );

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove2);
    return () => document.removeEventListener("mousemove", handleMouseMove2);
  }, [isDraggingElement, handleMouseMove2]);

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
  }, [
    isPress,
    startCoord,
    endCord,
    currentCursorToolOption,
    overlayMetadata,
    setInSelectZoneIds,
  ]);

  const cutElement = () => {
    setSelectedEleId("");
    setContextMenuPos({ x: 0, y: 0 });
    setOpenContextMenu(false);
    setCopyType("cut");
    copyElement(selectedEleId);
    removeElement(selectedEleId);
  };

  return (
    <div
      onContextMenu={(e: MouseEventReact) => {
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
        id="drop-zone-element"
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
        <CenterLine style={{ opacity: isCenter ? 1 : 0 }} ref={centerLineRef} />
        <MiddleLine style={{ opacity: isMiddle ? 1 : 0 }} ref={middleLineRef} />
        {overlayMetadata.elements.map((element, i) => (
          <OverlayElement
            selectedEleId={selectedEleId}
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
              if (
                element.type === ELEMENT_TYPES.IMAGE ||
                element.type === ELEMENT_TYPES.SQUARE
              ) {
                updateElementSize(newSize, element.id);
              }
            }}
            startDragging={() => setDraggingElement(true)}
            endDragging={() => {
              setCenter(false);
              setMiddle(false);
              setDraggingElement(false);
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
          copiedElements={copiedElements}
          pasteElement={(coord) => pasteElement(coord)}
          pasteMultipleElements={(coord) => pasteMultipleElements(coord)}
          copyElement={() => {
            setSelectedEleId("");
            setContextMenuPos({ x: 0, y: 0 });
            setOpenContextMenu(false);
            setCopyType("copy");
            copyElement(selectedEleId);
          }}
          cutElement={cutElement}
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
