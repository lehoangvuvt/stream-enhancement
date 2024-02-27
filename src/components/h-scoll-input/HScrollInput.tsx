import {
  MouseEvent as MouseEventReact,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { XYCoord } from "react-dnd";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  border-width: 2px;
  border-style: solid;
  padding: 0px 10px;
  box-sizing: border-box;
  border-radius: 4px;
  border-color: transparent;
  transition: all 0.1s ease;
  &:hover {
    border-color: rgba(0, 0, 0, 0.05);
  }
  &.holdLMB {
    border-color: rgba(0, 153, 255, 0.4);
    &:hover {
      border-color: rgba(0, 153, 255, 0.4);
    }
  }
  &.selected {
    border-color: rgba(0, 153, 255, 1);
    &:hover {
      border-color: rgba(0, 153, 255, 1);
    }
  }
`;

const Title = styled.div`
  user-select: none;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  user-select: none;
  height: 25px;
`;

type Props = {
  title: string;
  value: number;
  decrement: (step: number) => void;
  increment: (step: number) => void;
  onChange: (value: number) => void;
};

const HScrollInput: React.FC<Props> = ({
  title,
  value,
  decrement,
  increment,
  onChange,
}) => {
  const [isFocus, setFocus] = useState(false);
  const [centerCoords, setCenterCoords] = useState<XYCoord | null>(null);
  const [isHoldLMB, setHoldLMB] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: MouseEventReact) => {
    if (e.button === 0) {
      setCenterCoords({ x: e.pageX, y: e.pageY });
      setHoldLMB(true);
    }
  };

  const handleMouseUp = useCallback(() => {
    setHoldLMB(false);
    setCenterCoords(null);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (titleRef && titleRef.current && centerCoords) {
        setCenterCoords({ x: e.pageX, y: e.pageY });
        if (e.pageX <= centerCoords.x) {
          decrement(1);
        } else {
          increment(1);
        }
      }
    },
    [decrement, increment, centerCoords]
  );

  useEffect(() => {
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  useEffect(() => {
    if (isHoldLMB) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "e-resize !important";
    } else {
      document.body.style.cursor = "default";
    }
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isHoldLMB, handleMouseUp, handleMouseMove]);

  return (
    <Container
      className={isHoldLMB && !isFocus ? "holdLMB" : isFocus ? "selected" : ""}
    >
      <Title
        ref={titleRef}
        style={{
          cursor: "e-resize",
        }}
        onMouseDown={handleMouseDown}
      >
        {title}
      </Title>
      <Input
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        type="number"
        style={{
          cursor: isHoldLMB ? "e-resize" : "default",
        }}
        onChange={(e) => {
          if (e.target.value.trim() === "") {
            onChange(0);
          } else {
            onChange(parseInt(e.target.value));
          }
        }}
        value={parseInt(value.toString())}
      />
    </Container>
  );
};

export default HScrollInput;
