"use client";

import styled from "styled-components";

export type TBackgroundItem = {
  url: string;
  id: string;
  name: string;
};

const Container = styled.div<{ $bgURL: string }>`
  width: 80%;
  aspect-ratio: 16 / 9;
  background: ${(props) => `url("${props.$bgURL}")`};
  background-size: cover;
  background-position: center;
  cursor: pointer;
  box-sizing: border-box;
  border: 2px solid transparent;
  &.selected {
    border: 2px solid red;
  }
`;

type Props = {
  details: TBackgroundItem;
  isSelected: boolean;
  onSelect: (item: TBackgroundItem) => void;
};

const BackgroundItem: React.FC<Props> = ({ details, isSelected, onSelect }) => {
  const { id, name, url } = details;

  return (
    <Container
      className={isSelected ? "selected" : ""}
      $bgURL={url}
      onClick={() => onSelect(details)}
    ></Container>
  );
};

export default BackgroundItem;
