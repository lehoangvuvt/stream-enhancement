"use client";

import { useDrag } from "react-dnd";
import styled from "styled-components";

const Container = styled.div`
  width: 40%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  padding: 10px;
  border: 1px dashed black;
  cursor: grab;
`;

const ImageItem = () => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "IMAGE",
    end: (item, monitor) => {
      const dropResult = monitor.getDropResult<{ id: string }>();
      if (item && dropResult) {
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  return <Container ref={drag}>Image</Container>;
};

export default ImageItem;
