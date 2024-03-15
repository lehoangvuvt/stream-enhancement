"use client";

import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("");
`;

const Element1 = styled.div`
  position: absolute;
  left: 46%;
  top: 31%;
  width: 100px;
  height: 100px;
  border-radius: 0px;
  background-color: #ff0000;
  transform: rotate(0deg);
`;

const Element2 = styled.div`
  position: absolute;
  left: 44%;
  top: 29%;
  width: 100px;
  height: 100px;
  border-radius: 0px;
  background-color: #ff0000;
  transform: rotate(0deg);
`;

const Element3 = styled.div`
  position: absolute;
  left: 48%;
  top: 34%;
  width: 100px;
  height: 100px;
  border-radius: 0px;
  background-color: #ff0000;
  transform: rotate(0deg);
`;

const Element4 = styled.div`
  position: absolute;
  left: 50%;
  top: 36%;
  width: 100px;
  height: 100px;
  border-radius: 0px;
  background-color: #ff0000;
  transform: rotate(0deg);
`;

const Element5 = styled.div`
  position: absolute;
  left: 51%;
  top: 39%;
  width: 100px;
  height: 100px;
  border-radius: 0px;
  background-color: #ff0000;
  transform: rotate(0deg);
`;

const Element6 = styled.div`
  position: absolute;
  left: 54%;
  top: 42%;
  width: 100px;
  height: 100px;
  border-radius: 0px;
  background-color: #ff0000;
  transform: rotate(0deg);
`;

const MyComponent = () => {
  return (
    <Container>
      <Element1 />
      <Element2 />
      <Element3 />
      <Element4 />
      <Element5 />
      <Element6 />
    </Container>
  );
};

export default MyComponent;
