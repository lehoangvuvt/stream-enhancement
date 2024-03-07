"use client";

import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("https://marketplace.canva.com/EAE-DjUuNCg/1/0/1600w/canva-black-and-turquoise-futuristic-twitch-webcam-overlay-template-9JzFgOqnVtw.jpg");
`;

const Element10 = styled.div`
  position: absolute;
  left: 44%;
  top: 39%;
  width: 100px;
  height: 100px;
  border-radius: 0px;
  background-color: #ff0000;
  transform: rotate(0deg);
`;

const Element11 = styled.div`
  position: absolute;
  left: 44%;
  top: 39%;
  width: 100px;
  height: 100px;
  border-radius: 0px;
  background-color: #ff0000;
  transform: rotate(14deg);
`;

const Element12 = styled.div`
  position: absolute;
  left: 44%;
  top: 39%;
  width: 100px;
  height: 100px;
  border-radius: 0px;
  background-color: #ff0000;
  transform: rotate(32deg);
`;

const Element13 = styled.div`
  position: absolute;
  left: 44%;
  top: 39%;
  width: 100px;
  height: 100px;
  border-radius: 0px;
  background-color: #ff0000;
  transform: rotate(48deg);
`;

const Element14 = styled.div`
  position: absolute;
  left: 44%;
  top: 39%;
  width: 100px; 
  height: 100px;
  border-radius: 0px;
  background-color: #ff0000;
  transform: rotate(64deg);
`;

const Element15 = styled.div`
  position: absolute;
  left: 44%;
  top: 39%;
  width: 100px;
  height: 100px;
  border-radius: 0px;
  background-color: #ff0000;
  transform: rotate(75deg);
`;

const MyComponent = () => {
  return (
    <Container>
      <Element10 />
      <Element11 />
      <Element12 />
      <Element13 />
      <Element14 />
      <Element15 />
    </Container>
  );
};

export default MyComponent;
