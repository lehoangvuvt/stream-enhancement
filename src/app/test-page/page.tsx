'use client'

import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("https://marketplace.canva.com/EAE-DjUuNCg/1/0/1600w/canva-black-and-turquoise-futuristic-twitch-webcam-overlay-template-9JzFgOqnVtw.jpg");
`;

const Element1 = styled.div`
  position: absolute;
  left: 44%;
  top: 39%;
  width: 100px;
  height: 100px;
  border-radius: 39px;
  background-color: #533cdc;
`;

const Element2 = styled.div`
  position: absolute;
  left: 44%;
  top: 69%;
  width: 100px;
  height: 100px;
  border-radius: 0px;
  background-color: #ff0000;
`;

const Element3 = styled.div`
  position: absolute;
  left: 44%;
  top: 11%;
  width: 100px;
  height: 100px;
  border-radius: 13px;
`;

const Element4 = styled.div`
  position: absolute;
  left: 12%;
  top: 34%;
  width: 100px;
  height: 100px;
  border-radius: 39px;
  background-color: #533cdc;
`;

const Element5 = styled.div`
  position: absolute;
  left: 71%;
  top: 34%;
  width: 100px;
  height: 100px;
  border-radius: 39px;
  background-color: #3ee96a;
`;

const MyComponent = () => {
  return (
    <Container>
      <Element1 />
      <Element2 />
      <Element3 />
      <Element4 />
      <Element5 />
    </Container>
  );
};

export default MyComponent;
