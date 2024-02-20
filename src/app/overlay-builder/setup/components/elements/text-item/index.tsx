"use client";

import { useDrag } from "react-dnd";
import styled from "styled-components";

const Container = styled.div`
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  padding: 10px;
  border: 1px dashed black;
  cursor: grab;
`;

const TextItem = () => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TEXT",
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

  return <Container ref={drag}>Text</Container>;
};

export default TextItem;
