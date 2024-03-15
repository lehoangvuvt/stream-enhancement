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
    min-height: 25px;
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
  border-color: #ea745b;
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
  updateCoords: (newCoords: XYCoord, eleId: string) => void;
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
    switch (elementItem.details.type) {
      case ELEMENT_TYPES.TEXT:
        element = (
          <textarea
            style={{
              fontSize: elementItem.style.fontSize,
              color: elementItem.style.color,
              opacity: elementItem.style.opacity,
              fontWeight: 200,
            }}
            onChange={(e) => {}}
            value={elementItem.details.text}
          />
        );
        break;
      case ELEMENT_TYPES.IMAGE:
        if (!elementItem.style.width || !elementItem.style.height) return;
        element = (
          <Image
            style={{
              pointerEvents: "none",
              userSelect: "none",
              borderRadius: elementItem.style.borderRadius,
            }}
            width={parseInt(
              elementItem.style.width.toString().replace("px", "")
            )}
            height={parseInt(
              elementItem.style.height.toString().replace("px", "")
            )}
            src={elementItem.details.url}
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
              width: elementItem.style.width,
              height: elementItem.style.height,
              backgroundColor: elementItem.style.backgroundColor ?? "#000000",
              borderRadius: elementItem.style.borderRadius,
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
      updateCoords({ x, y }, elementItem.id);
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

  // const handleResize = (
  //   e: PointerEvent<HTMLDivElement>,
  //   direction:
  //     | "topLeft"
  //     | "top"
  //     | "topRight"
  //     | "right"
  //     | "bottomRight"
  //     | "bottom"
  //     | "bottomLeft"
  //     | "left"
  // ) => {
  //   if (e.pressure > 0 && containerRef && containerRef.current) {
  //     if (elementItem.details.type === ELEMENT_TYPES.IMAGE) {
  //       if (!elementItem.style.width || !elementItem.style.height) return;
  //       let width = parseInt(
  //         elementItem.style.width.toString().replace("px", "")
  //       );
  //       let height = parseInt(
  //         elementItem.style.height.toString().replace("px", "")
  //       );
  //       const containerLeft = containerRef.current.getBoundingClientRect().left;
  //       switch (direction) {
  //         case "left":
  //           if (e.pageX < containerLeft) {
  //             width += containerLeft - e.pageX;
  //           } else {
  //             width -= e.pageX + containerLeft;
  //           }
  //           break;
  //         case "top":
  //           if (e.pageY < containerRef.current.getBoundingClientRect().top) {
  //             height =
  //               elementItem.details.height +
  //               (containerRef.current.getBoundingClientRect().top - e.pageY);
  //           } else {
  //             height =
  //               elementItem.details.height -
  //               (e.pageY - containerRef.current.getBoundingClientRect().top);
  //           }

  //           break;
  //       }

  //       updateElementSize && updateElementSize({ width, height });
  //     }
  //   }
  // };

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
          elementItem.details.type === ELEMENT_TYPES.IMAGE ||
          elementItem.details.type === ELEMENT_TYPES.SQUARE
        ) {
          if (!elementItem.style.width || !elementItem.style.height) return;
          let width = parseInt(
            elementItem.style.width.toString().replace("px", "")
          );
          let height = parseInt(
            elementItem.style.height.toString().replace("px", "")
          );
          switch (resizeDirection) {
            case "left":
              let newX = 0;
              let newY = 0;
              if (e.pageX < containerRef.current.getBoundingClientRect().left) {
                const addedWidth =
                  containerRef.current.getBoundingClientRect().left - e.pageX;
                width += addedWidth;
                if (elementItem.coords) {
                  newX = containerRef.current.getBoundingClientRect().left;
                  containerRef.current.getBoundingClientRect().left -
                    addedWidth;
                  newY = elementItem.coords.y;
                }
              } else {
                width -=
                  e.pageX - containerRef.current.getBoundingClientRect().left;
              }
              updateCoords({ x: newX, y: newY }, elementItem.id);
              updateElementSize && updateElementSize({ width, height });
              break;
            case "top":
              if (e.pageY < containerRef.current.getBoundingClientRect().top) {
                height +=
                  containerRef.current.getBoundingClientRect().top - e.pageY;
              } else {
                height -=
                  e.pageY - containerRef.current.getBoundingClientRect().top;
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
        if (
          Math.abs(
            selectedElement.getBoundingClientRect().y -
              element.getBoundingClientRect().y -
              element.clientHeight
          ) <= offset ||
          Math.abs(
            selectedElement.getBoundingClientRect().y +
              selectedElement.clientHeight -
              element.getBoundingClientRect().y -
              element.clientHeight
          ) <= offset
        ) {
          isCollided = true;
        }
        break;
      case "t":
        if (
          Math.abs(
            selectedElement.getBoundingClientRect().y +
              selectedElement.clientHeight -
              element.getBoundingClientRect().y
          ) <= offset ||
          Math.abs(
            selectedElement.getBoundingClientRect().y -
              element.getBoundingClientRect().y
          ) <= offset
        ) {
          isCollided = true;
        }
        break;
      case "r":
        if (
          Math.abs(
            selectedElement.getBoundingClientRect().x -
              element.getBoundingClientRect().x -
              element.clientWidth
          ) <= offset
        ) {
          isCollided = true;
        } else if (
          Math.abs(
            selectedElement.getBoundingClientRect().x +
              selectedElement.clientWidth -
              element.getBoundingClientRect().x -
              element.clientWidth
          ) <= offset
        ) {
          isCollided = true;
        } else {
          isCollided = false;
        }
        break;
      case "l":
        selectedElementX =
          selectedElement.getBoundingClientRect().x +
          selectedElement.clientWidth;
        if (
          Math.abs(
            selectedElement.getBoundingClientRect().x +
              selectedElement.clientWidth -
              element.getBoundingClientRect().x
          ) <= offset ||
          Math.abs(
            selectedElement.getBoundingClientRect().x -
              element.getBoundingClientRect().x
          ) <= offset
        ) {
          isCollided = true;
        }
        break;
    }
    return isCollided;
  };

  return elementItem.isShow ? (
    <Container
      id={elementItem.id}
      onClick={() => onClick()}
      onContextMenu={handleOpenContextMenu}
      ref={containerRef}
      style={{
        zIndex: elementItem.order + 10,
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
        transform: elementItem.style.transform,
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
  ) : null;
};

export default OverlayElement;
