"use client";

import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 800px;
  aspect-ratio: 16/9;
  background: red;
`;

const Element1 = styled.div`
  position: absolute;
  left: 49%;
  top: 44%;
  width: 100px;
  height: 100px;
  border-radius: 0px;
  background-color: #f0ea5a;
  transform: rotate(0deg);
`;

const Element2 = styled.div`
  position: absolute;
  left: 49%;
  top: 44%;
  width: 100px;
  height: 100px;
  border-radius: 0px;
  background-color: #ff0000;
  transform: rotate(45deg);
`;

const Element3 = styled.div`
  position: absolute;
  left: 49%;
  top: 44%;
  width: 100px;
  height: 100px;
  border-radius: 0px;
  background-color: #00ff53;
  transform: rotate(70deg);
`;

const Element4 = styled.div`
  position: absolute;
  left: 49%;
  top: 44%;
  width: 100px;
  height: 100px;
  border-radius: 0px;
  background-color: #2d00ff;
  transform: rotate(-70deg);
`;

const MyComponent = () => {
  return (
    <Container>
      <Element1 />
      <Element2 />
      <Element3 />
      <Element4 />
    </Container>
  );
};

export default MyComponent;
