"use client";

import { useState } from "react";
import { ColorResult, SketchPicker } from "react-color";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.25);
  padding: 6px;
  border-radius: 4px;
  align-items: center;
  background-color: white;
  gap: 5px;
  input {
    font-size: 15px;
    height: 100%;
    border: none;
    outline: none;
    flex: 1;
  }
`;

const TogglePickerBtn = styled.div`
  width: 25px;
  height: 25px;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 2px;
`;

const MyPicker = styled(SketchPicker)`
  position: absolute;
  left: 0;
  top: -5px;
  transform: translateX(calc(-100% - 5px));
  z-index: 10;
`;

type Props = {
  color: string;
  onChange: (color: string) => void;
};

const ColorInput: React.FC<Props> = ({ color, onChange }) => {
  const [isOpenPicker, setOpenPicker] = useState(false);

  return (
    <Container onBlur={() => setOpenPicker(false)}>
      {isOpenPicker && (
        <MyPicker
          color={color}
          onChange={(colorResult: ColorResult) => {
            onChange(colorResult.hex);
          }}
        />
      )}
      <TogglePickerBtn
        onClick={() => setOpenPicker(!isOpenPicker)}
        style={{
          background: color,
        }}
      />
      <input
        maxLength={6}
        type="text"
        value={color.substring(1)}
        onChange={(e) => onChange(`#${e.target.value}`)}
      />
    </Container>
  );
};

export default ColorInput;
