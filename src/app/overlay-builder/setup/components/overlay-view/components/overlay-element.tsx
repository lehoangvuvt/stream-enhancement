"use client";

import { XYCoord } from "react-dnd";
import styled from "styled-components";
import { MouseEvent, PointerEvent, useEffect, useRef, useState } from "react";
import { ELEMENT_TYPES, Element } from "@/app/types/element.types";
import Image from "next/image";

const Container = styled.div`
  position: absolute;
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
};

const OverlayElement: React.FC<Props> = ({
  elementItem,
  updateCoords,
  index,
  onClick,
  updateElementSize,
  openContextMenu,
  closeContextMenu,
  selected,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
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
            style={{ pointerEvents: "none", userSelect: "none" }}
            width={elementItem.width}
            height={elementItem.height}
            src="https://cc-prod.scene7.com/is/image/CCProdAuthor/What-is-Stock-Photography_P1_mobile?$pjpeg$&jpegSize=200&wid=720"
            alt="image-item"
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
      const x = e.pageX;
      const y = e.pageY;
      updateCoords({ x, y }, index);
      setDrag(true);
      closeContextMenu();
    } else {
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
      // const x =
      //   containerRef.current.getBoundingClientRect().x +
      //   containerRef.current.offsetWidth;
      // const y = containerRef.current.getBoundingClientRect().y;
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
        if (elementItem.type === ELEMENT_TYPES.IMAGE) {
          let width = elementItem.width;
          let height = elementItem.height;
          switch (resizeDirection) {
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

  return (
    <Container
      onClick={() => onClick()}
      onContextMenu={handleOpenContextMenu}
      ref={containerRef}
      style={{
        zIndex: onDrag ? 2 : 1,
        left: left + "%",
        top: top + "%",
      }}
    >
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
