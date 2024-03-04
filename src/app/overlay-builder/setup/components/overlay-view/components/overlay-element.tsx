"use client";

import { XYCoord } from "react-dnd";
import styled from "styled-components";
import { MouseEvent, PointerEvent, useEffect, useRef, useState } from "react";
import {
  CURSOR_TOOL_OPTIONS,
  ELEMENT_TYPES,
  Element,
} from "@/app/types/element.types";
import Image from "next/image";

const Container = styled.div`
  position: absolute;
  box-sizing: border-box;
  textarea {
    resize: none;
    background-color: transparent;
    border: none;
    outline: none;
    vertical-align: middle;
    text-align: center;
    width: 100%;
    height: 100%;
  }
`;

const BoxWithInterractiveBorder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: transparent;
  border: 2px solid #0099ff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

const ColliedBorder = styled.div<{
  $isCollided_L: boolean;
  $isCollided_R: boolean;
  $isCollided_T: boolean;
  $isCollided_B: boolean;
}>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: transparent;
  border-color: #ffcc80;
  border-style: solid;
  border-bottom-width: ${(props) => (props.$isCollided_B ? "1px" : "0px")};
  border-top-width: ${(props) => (props.$isCollided_T ? "1px" : "0px")};
  border-right-width: ${(props) => (props.$isCollided_R ? "1px" : "0px")};
  border-left-width: ${(props) => (props.$isCollided_L ? "1px" : "0px")};
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
`;

const BaseBorder = styled.div`
  position: absolute;
  width: 8px;
  height: 8px;
  background-color: white;
  border: 1px solid #0099ff;
`;

const BorderTopLeft = styled(BaseBorder)`
  top: 0;
  left: 0;
  transform: translate(-50%, -50%);
  cursor: se-resize;
`;
const BorderTop = styled(BaseBorder)`
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%);
  cursor: n-resize;
`;
const BorderTopRight = styled(BaseBorder)`
  top: 0;
  right: 0;
  transform: translate(50%, -50%);
  cursor: sw-resize;
`;
const BorderRight = styled(BaseBorder)`
  top: 50%;
  right: 0;
  transform: translate(50%, -50%);
  cursor: e-resize;
`;
const BorderBottomRight = styled(BaseBorder)`
  bottom: 0;
  right: 0;
  transform: translate(50%, 50%);
  cursor: nw-resize;
`;
const BorderBottom = styled(BaseBorder)`
  bottom: 0;
  right: 50%;
  transform: translate(50%, 50%);
  cursor: n-resize;
`;
const BorderBottomLeft = styled(BaseBorder)`
  bottom: 0;
  left: 0;
  transform: translate(-50%, 50%);
  cursor: nesw-resize;
`;
const BorderLeft = styled(BaseBorder)`
  bottom: 50%;
  left: 0;
  transform: translate(-50%, 50%);
  cursor: e-resize;
`;
const MoveHandler = styled.div`
  position: relative;
  width: calc(85% - 15px);
  height: calc(85% - 15px);
`;

type ResizeDirection =
  | "topLeft"
  | "top"
  | "topRight"
  | "right"
  | "bottomRight"
  | "bottom"
  | "bottomLeft"
  | "left";

type Props = {
  elementItem: Element;
  index: number;
  updateCoords: (newCoords: XYCoord, index: number) => void;
  updateElementSize?: (newSize: { width: number; height: number }) => void;
  onClick: () => void;
  selected: boolean;
  openContextMenu: (
    position: { x: number; y: number },
    element: Element
  ) => void;
  closeContextMenu: () => void;
  isInSelectZone: boolean;
  currentCursorToolOption: CURSOR_TOOL_OPTIONS;
  startDragging: () => void;
  endDragging: () => void;
  selectedEleId: string;
};

const OverlayElement: React.FC<Props> = ({
  elementItem,
  updateCoords,
  index,
  onClick,
  updateElementSize,
  openContextMenu,
  closeContextMenu,
  isInSelectZone,
  selected,
  currentCursorToolOption,
  startDragging,
  endDragging,
  selectedEleId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(-100);
  const [top, setTop] = useState(-100);
  const [onDrag, setDrag] = useState(false);
  const [isDoubleClick, setDoubleClick] = useState(false);
  const [mousePress, setMousePress] = useState(false);
  const [resizeDirection, setResizeDirection] =
    useState<ResizeDirection | null>(null);

  const renderElementByType = () => {
    let element: React.ReactNode = null;
    switch (elementItem.type) {
      case ELEMENT_TYPES.TEXT:
        element = (
          <textarea
            style={{
              fontSize: elementItem.font_size + "px",
              color: elementItem.font_color,
              opacity: elementItem.opacity,
              fontWeight: 200,
            }}
            onChange={(e) => {}}
            value={elementItem.text}
          />
        );
        break;
      case ELEMENT_TYPES.IMAGE:
        element = (
          <Image
            style={{
              pointerEvents: "none",
              userSelect: "none",
              borderRadius: elementItem.borderRadius + "px",
            }}
            width={elementItem.width}
            height={elementItem.height}
            src={
              elementItem.url?.length > 0
                ? elementItem.url
                : "https://cc-prod.scene7.com/is/image/CCProdAuthor/What-is-Stock-Photography_P1_mobile?$pjpeg$&jpegSize=200&wid=720"
            }
            alt="image-item"
          />
        );
        break;
      case ELEMENT_TYPES.SQUARE:
        element = (
          <div
            style={{
              pointerEvents: "none",
              userSelect: "none",
              width: `${elementItem.width}px`,
              height: `${elementItem.height}px`,
              backgroundColor: elementItem.backgroundColor,
              borderRadius: `${elementItem.borderRadius}px`,
            }}
          />
        );
        break;
    }
    return element;
  };

  useEffect(() => {
    if (
      containerRef &&
      containerRef.current &&
      elementItem.coords &&
      !isDoubleClick
    ) {
      const coords = elementItem.coords;
      const parentOffsetLeft =
        containerRef.current.parentElement?.offsetLeft ?? 0;
      const parentOffsetTop =
        containerRef.current.parentElement?.offsetTop ?? 0;
      const parentWith = containerRef.current.parentElement?.offsetWidth ?? 0;
      const parentHeight =
        containerRef.current.parentElement?.offsetHeight ?? 0;

      const width = containerRef.current.offsetWidth / 2;
      const height = containerRef.current.offsetHeight / 2;

      const leftInPercentage =
        ((coords.x - parentOffsetLeft - width) / parentWith) * 100;
      const topInPercentage =
        ((coords.y - parentOffsetTop - height) / parentHeight) * 100;

      setLeft(leftInPercentage);
      setTop(topInPercentage);
    }
  }, [elementItem.coords, isDoubleClick]);

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pressure > 0 && containerRef && containerRef.current) {
      onClick();
      startDragging();
      const x = e.pageX;
      const y = e.pageY;
      updateCoords({ x, y }, index);
      setDrag(true);
      closeContextMenu();
    } else {
      endDragging();
      setDrag(false);
    }
  };

  useEffect(() => {
    if (!selected) {
      setDoubleClick(false);
    }
  }, [selected]);

  const handleOpenContextMenu = (e: MouseEvent) => {
    if (containerRef && containerRef.current) {
      const position = { x: e.pageX, y: e.pageY };
      openContextMenu(position, elementItem);
    }
  };

  const handleResize = (
    e: PointerEvent<HTMLDivElement>,
    direction:
      | "topLeft"
      | "top"
      | "topRight"
      | "right"
      | "bottomRight"
      | "bottom"
      | "bottomLeft"
      | "left"
  ) => {
    if (e.pressure > 0 && containerRef && containerRef.current) {
      if (elementItem.type === ELEMENT_TYPES.IMAGE) {
        let width = elementItem.width;
        let height = elementItem.height;
        switch (direction) {
          case "left":
            if (e.pageX < containerRef.current.getBoundingClientRect().left) {
              width =
                elementItem.width +
                (containerRef.current.getBoundingClientRect().left - e.pageX);
            } else {
              width =
                elementItem.width -
                (e.pageX - containerRef.current.getBoundingClientRect().left);
            }

            break;
          case "top":
            if (e.pageY < containerRef.current.getBoundingClientRect().top) {
              height =
                elementItem.height +
                (containerRef.current.getBoundingClientRect().top - e.pageY);
            } else {
              height =
                elementItem.height -
                (e.pageY - containerRef.current.getBoundingClientRect().top);
            }

            break;
        }

        updateElementSize && updateElementSize({ width, height });
      }
    }
  };

  const onMouseDown = (e: PointerEvent<HTMLDivElement>) => {
    console.log(1);
  };

  const onMouseUp = (e: PointerEvent<HTMLDivElement>) => {
    console.log(2);
  };

  const handleMouseRelease = (e: any) => {
    if (resizeDirection) {
      if (containerRef && containerRef.current) {
        if (
          elementItem.type === ELEMENT_TYPES.IMAGE ||
          elementItem.type === ELEMENT_TYPES.SQUARE
        ) {
          let width = elementItem.width;
          let height = elementItem.height;
          switch (resizeDirection) {
            case "left":
              let newX = 0;
              let newY = 0;
              if (e.pageX < containerRef.current.getBoundingClientRect().left) {
                const addedWidth =
                  containerRef.current.getBoundingClientRect().left - e.pageX;
                width = elementItem.width + addedWidth;
                if (elementItem.coords) {
                  newX = containerRef.current.getBoundingClientRect().left;
                  containerRef.current.getBoundingClientRect().left -
                    addedWidth;
                  newY = elementItem.coords.y;
                }
              } else {
                width =
                  elementItem.width -
                  (e.pageX - containerRef.current.getBoundingClientRect().left);
              }
              updateCoords({ x: newX, y: newY }, index);
              updateElementSize && updateElementSize({ width, height });
              break;
            case "top":
              if (e.pageY < containerRef.current.getBoundingClientRect().top) {
                height =
                  elementItem.height +
                  (containerRef.current.getBoundingClientRect().top - e.pageY);
              } else {
                height =
                  elementItem.height -
                  (e.pageY - containerRef.current.getBoundingClientRect().top);
              }
              updateElementSize && updateElementSize({ width, height });
              break;
          }
        }
      }
    }
    setMousePress(false);
    setResizeDirection(null);
  };

  useEffect(() => {
    if (mousePress) {
      window.addEventListener("mouseup", handleMouseRelease);
    }
    return () => window.removeEventListener("mouseup", handleMouseRelease);
  }, [mousePress]);

  const checkCollision = (direction: "l" | "r" | "t" | "b") => {
    if (selectedEleId === "" || !elementItem.coords) return false;
    const selectedElement = document.getElementById(selectedEleId);
    const element = document.getElementById(elementItem.id);
    if (!selectedElement || !element) return false;
    const offset = 1;
    let selectedElementX = 0;
    let selectedElementY = 0;
    let isCollided = false;
    switch (direction) {
      case "b":
        selectedElementY = selectedElement.getBoundingClientRect().y;
        if (
          Math.abs(
            selectedElementY -
              element.getBoundingClientRect().y -
              element.clientHeight
          ) <= offset
        ) {
          isCollided = true;
        }
        break;
      case "t":
        selectedElementY =
          selectedElement.getBoundingClientRect().y +
          selectedElement.clientHeight;
        if (
          Math.abs(selectedElementY - element.getBoundingClientRect().y) <=
          offset
        ) {
          isCollided = true;
        }
        break;
      case "r":
        selectedElementX = selectedElement.getBoundingClientRect().x;
        if (
          Math.abs(
            selectedElementX -
              element.getBoundingClientRect().x -
              element.clientWidth
          ) <= offset
        ) {
          isCollided = true;
        }
        break;
      case "l":
        selectedElementX =
          selectedElement.getBoundingClientRect().x +
          selectedElement.clientWidth;
        if (
          Math.abs(selectedElementX - element.getBoundingClientRect().x) <=
          offset
        ) {
          isCollided = true;
        }
        break;
    }
    return isCollided;
  };

  return (
    <Container
      id={elementItem.id}
      onClick={() => onClick()}
      onContextMenu={handleOpenContextMenu}
      ref={containerRef}
      style={{
        zIndex: onDrag ? 2 : 1,
        left: left + "%",
        top: top + "%",
        border: isInSelectZone ? "1px dashed red" : "none",
        pointerEvents:
          currentCursorToolOption !== CURSOR_TOOL_OPTIONS.ZONE_SELECT
            ? "all"
            : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        rotate: elementItem.rotate + "deg",
      }}
    >
      <ColliedBorder
        $isCollided_L={
          selectedEleId !== elementItem.id ? checkCollision("l") : false
        }
        $isCollided_R={
          selectedEleId !== elementItem.id ? checkCollision("r") : false
        }
        $isCollided_T={
          selectedEleId !== elementItem.id ? checkCollision("t") : false
        }
        $isCollided_B={
          selectedEleId !== elementItem.id ? checkCollision("b") : false
        }
      />
      {selected && (
        <BoxWithInterractiveBorder>
          <BorderTopLeft />
          <BorderTop
            onMouseDown={(e) => {
              setResizeDirection("top");
              setMousePress(true);
            }}
          />
          <BorderTopRight />
          <BorderRight />
          <BorderBottomRight />
          <BorderBottom />
          <BorderBottomLeft />
          <BorderLeft
            onMouseDown={(e) => {
              setResizeDirection("left");
              setMousePress(true);
            }}
          />
          <MoveHandler
            style={{
              cursor: onDrag ? "grabbing" : "grab",
              pointerEvents:
                currentCursorToolOption !== CURSOR_TOOL_OPTIONS.ZONE_SELECT
                  ? "all"
                  : "none",
            }}
            onDoubleClick={() => setDoubleClick(true)}
            onClick={(e: any) => onClick()}
            onPointerMove={handleMove}
          />
        </BoxWithInterractiveBorder>
      )}

      {renderElementByType()}
    </Container>
  );
};

export default OverlayElement;
