"use client";

import styled from "styled-components";

const Container = styled.div`
  width: 200px;
  background-color: #1e1e1e;
  position: absolute;
  z-index: 100;
  animation: ElementContextMenuAppear 0.1s ease;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 5px;
  transform-origin: top;
  color: white;
  padding: 5px 0px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column;

  @keyframes ElementContextMenuAppear {
    from {
      transform: scaleY(0);
    }
    to {
      transform: scaleY(1);
    }
  }
`;

const ContextMenuItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 13px;
  padding: 5px 15px;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    background-color: #0099ff;
    color: white;
  }
`;

type Props = {
  x: number;
  y: number;
  deleteElement: () => void;
};

const ElementContextMenu: React.FC<Props> = ({ x, y, deleteElement }) => {
  return (
    <Container
      style={{
        left: x + "px",
        top: y + "px",
      }}
    >
      <ContextMenuItem onClick={deleteElement}>Delete</ContextMenuItem>
      <ContextMenuItem>Copy</ContextMenuItem>
    </Container>
  );
};

export default ElementContextMenu;
