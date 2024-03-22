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
  width: 800px;
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

const TopLine = styled.div`
  width: 100%;
  height: 1px;
  position: absolute;
  z-index: 50;
  background-color: #ea745b;
  left: 0;
  user-select: none;
  pointer-events: none;
`;

const LeftLine = styled.div`
  width: 1px;
  height: 100%;
  position: absolute;
  z-index: 50;
  background-color: #ea745b;
  left: 0px;
  user-select: none;
  pointer-events: none;
`;

const BottomLine = styled.div`
  width: 100%;
  height: 1px;
  bottom: 0;
  position: absolute;
  z-index: 50;
  background-color: #ea745b;
  left: 0px;
  user-select: none;
  pointer-events: none;
`;

const RightLine = styled.div`
  width: 1px;
  height: 100%;
  top: 0;
  position: absolute;
  z-index: 50;
  background-color: #ea745b;
  right: 0px;
  user-select: none;
  pointer-events: none;
`;

const CenterLine = styled.div`
  width: 1px;
  height: 100%;
  position: absolute;
  z-index: 50;
  background-color: #ea745b;
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
  background-color: #ea745b;
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
  pasteElement: (
    coord: { x: number; y: number },
    relativeCoord: { x: number; y: number }
  ) => void;
  pasteMultipleElements: (cord: { x: number; y: number }) => void;
  copiedElement: Element | null;
  copiedElements: Element[];
  currentCursorToolOption: CURSOR_TOOL_OPTIONS;
  inSelectZoneIds: string[];
  setInSelectZoneIds: (ids: string[]) => void;
  setCopyType: (type: "copy" | "cut") => void;
  selectedEleId: string | null;
  setSelectedEleId: (elementId: string) => void;
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
  selectedEleId,
  setSelectedEleId,
}) => {
  const topLineRef = useRef<HTMLDivElement>(null);
  const leftLineRef = useRef<HTMLDivElement>(null);
  const rightLineRef = useRef<HTMLDivElement>(null);
  const bottomLineRef = useRef<HTMLDivElement>(null);
  const centerLineRef = useRef<HTMLDivElement>(null);
  const middleLineRef = useRef<HTMLDivElement>(null);
  const [isOpenContextMenu, setOpenContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const { background_ratio, background_url } = overlayMetadata;
  const [isPress, setIsPress] = useState(false);
  const [isDraggingElement, setDraggingElement] = useState(false);
  const [isTop, setTop] = useState(false);
  const [isLeft, setLeft] = useState(false);
  const [isCenter, setCenter] = useState(false);
  const [isMiddle, setMiddle] = useState(false);
  const [isBottom, setBottom] = useState(false);
  const [isRight, setRight] = useState(false);
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
        topLineRef?.current &&
        leftLineRef?.current &&
        centerLineRef?.current &&
        middleLineRef?.current &&
        bottomLineRef?.current &&
        rightLineRef?.current &&
        isDraggingElement
      ) {
        if (selectedEleId && selectedEleId !== "") {
          const element = document.getElementById(selectedEleId);
          if (!element) return;
          const offset = 10;
          const topLineY = topLineRef.current.getBoundingClientRect().y;
          const bottomLineY = bottomLineRef.current.getBoundingClientRect().y;
          const leftLineX = leftLineRef.current.getBoundingClientRect().x;
          const rightLineX = rightLineRef.current.getBoundingClientRect().x;
          const centerLineX = centerLineRef.current.getBoundingClientRect().x;
          const centerLineWidth = centerLineRef.current.clientWidth;
          const middleLineY = centerLineRef.current.getBoundingClientRect().y;
          const middleLineHeight = centerLineRef.current.clientHeight;
          const centerPointX = centerLineX + centerLineWidth / 2;
          const middlePointY = middleLineY + middleLineHeight / 2;
          const isTop =
            Math.abs(element.getBoundingClientRect().y - topLineY + 1) <= 2;
          const isBottom =
            Math.abs(
              element.getBoundingClientRect().y +
                element.clientHeight -
                bottomLineY -
                1
            ) <= 2;
          const isLeft =
            Math.abs(element.getBoundingClientRect().x - leftLineX + 1) <= 2;
          const isRight =
            Math.abs(
              element.getBoundingClientRect().x +
                element.clientWidth -
                rightLineX -
                1
            ) <= 2;
          const isCenter = Math.abs(e.pageX - centerPointX) <= offset;
          const isMiddle = Math.abs(e.pageY - middlePointY) <= offset;
          let x = e.pageX;
          if (isCenter) {
            x = centerPointX;
          }
          const y = isMiddle ? middlePointY : e.pageY;
          setCenter(isCenter);
          setMiddle(isMiddle);
          setTop(isTop);
          setLeft(isLeft);
          setBottom(isBottom);
          setRight(isRight);
          updateElementCoords({ x, y }, selectedEleId);
        }
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
    if (!selectedEleId || selectedEleId === "") return;
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
        <TopLine style={{ opacity: isTop ? 1 : 0 }} ref={topLineRef} />
        <LeftLine style={{ opacity: isLeft ? 1 : 0 }} ref={leftLineRef} />
        <BottomLine style={{ opacity: isBottom ? 1 : 0 }} ref={bottomLineRef} />
        <RightLine style={{ opacity: isRight ? 1 : 0 }} ref={rightLineRef} />
        <CenterLine style={{ opacity: isCenter ? 1 : 0 }} ref={centerLineRef} />
        <MiddleLine style={{ opacity: isMiddle ? 1 : 0 }} ref={middleLineRef} />
        {overlayMetadata.elements.map((element, i) => (
          <OverlayElement
            selectedEleId={selectedEleId ?? ""}
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
            updateCoords={(newCoords, eleId) =>
              updateElementCoords(newCoords, eleId)
            }
            key={element.id}
            index={i}
            elementItem={element}
            selected={selectedEleId === element.id}
            isInSelectZone={inSelectZoneIds.includes(element.id)}
            updateElementSize={(newSize) => {
              if (
                element.details.type === ELEMENT_TYPES.IMAGE ||
                element.details.type === ELEMENT_TYPES.SQUARE
              ) {
                updateElementSize(newSize, element.id);
              }
            }}
            startDragging={() => setDraggingElement(true)}
            endDragging={() => {
              setCenter(false);
              setMiddle(false);
              setLeft(false);
              setRight(false);
              setTop(false);
              setBottom(false);
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
          selectEleId={selectedEleId ?? ""}
          copiedElement={copiedElement}
          copiedElements={copiedElements}
          pasteElement={(coord) => {
            const containerEle = document.getElementById("drop-zone-element");
            if (
              !containerEle ||
              !copiedElement ||
              !copiedElement.style.width ||
              !copiedElement.style.height
            )
              return;
            const containerX = containerEle.getBoundingClientRect().x;
            const containerY = containerEle.getBoundingClientRect().y;
            const relativeCoord = {
              x:
                coord.x -
                containerX -
                parseInt(
                  copiedElement.style.width.toString().replace("px", "")
                ) /
                  2,
              y:
                coord.y -
                containerY -
                parseInt(
                  copiedElement.style.height.toString().replace("px", "")
                ) /
                  2,
            };
            pasteElement(coord, relativeCoord);
          }}
          pasteMultipleElements={(coord) => pasteMultipleElements(coord)}
          copyElement={() => {
            if (!selectedEleId || selectedEleId === "") return;
            setSelectedEleId("");
            setContextMenuPos({ x: 0, y: 0 });
            setOpenContextMenu(false);
            setCopyType("copy");
            copyElement(selectedEleId);
          }}
          cutElement={cutElement}
          deleteElement={() => {
            if (!selectedEleId || selectedEleId === "") return;
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
