"use client";

import { Element } from "@/app/types/element.types";
import styled from "styled-components";
import LayerItem from "./layer-item";

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
  margin-top: -20px;
`;

type Props = {
  elements: Element[];
  selectedElementId: string | null;
  setSelectedElementId: (elementId: string) => void;
  updateElementState: (state: number, elementId: string) => void;
  reorderElement: (elementId: string, type: "up" | "down") => void;
};

const Layers: React.FC<Props> = ({
  elements,
  selectedElementId,
  setSelectedElementId,
  updateElementState,
  reorderElement,
}) => {
  return (
    <Container>
      {elements.map((element) => (
        <LayerItem
          reorderElement={reorderElement}
          updateElementState={updateElementState}
          selected={selectedElementId === element.id}
          setSelectedElementId={setSelectedElementId}
          key={element.id}
          element={element}
        />
      ))}
    </Container>
  );
};

export default Layers;
