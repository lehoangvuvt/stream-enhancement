"use client";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-flow: column;
`;

export default function OverlayBuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container>
      <DndProvider backend={HTML5Backend}>{children}</DndProvider>
    </Container>
  );
}
