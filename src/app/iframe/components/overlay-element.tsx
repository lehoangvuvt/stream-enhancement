"use client";

import { XYCoord } from "react-dnd";
import styled from "styled-components";
import { PointerEvent, useEffect, useRef, useState } from "react";
import { ELEMENT_TYPES, Element } from "@/app/types/element.types";

const Container = styled.div`
  position: absolute;
  padding: 5px 8px;
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

type Props = {
  elementItem: Element;
  index: number;
  updateCoords: (newCoords: XYCoord, index: number) => void;
  onClick: () => void;
  selected: boolean;
};

const OverlayElement: React.FC<Props> = ({
  elementItem,
  updateCoords,
  index,
  onClick,
  selected,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [left, setLeft] = useState(0);
  const [top, setTop] = useState(0);
  const [onDrag, setDrag] = useState(false);
  const [isDoubleClick, setDoubleClick] = useState(false);

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
            }}
            onChange={(e) => {}}
            value={elementItem.text}
          />
        );
        break;
      case ELEMENT_TYPES.IMAGE:
        element = <textarea defaultValue={elementItem.url} />;
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
    } else {
      setDrag(false);
    }
  };

  useEffect(() => {
    if (!selected) {
      setDoubleClick(false);
    }
  }, [selected]);

  return (
    <Container
      onDoubleClick={() => setDoubleClick(true)}
      onClick={(e: any) => onClick()}
      onPointerMove={handleMove}
      ref={containerRef}
      style={{
        zIndex: onDrag ? 2 : 1,
        left: left + "%",
        top: top + "%",
        border: isDoubleClick
          ? "1px solid white"
          : selected && !onDrag
          ? "1px dashed white"
          : "none",
      }}
    >
      {renderElementByType()}
    </Container>
  );
};

export default OverlayElement;
