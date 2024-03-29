import useCursor, { CURSOR } from "@/hooks/useCursor";
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
  font-size: 14px;
  width: 12px;
  color: rgba(0, 0, 0, 0.6);
`;

const Input = styled.input`
  width: calc(100% - 12px);
  border: none;
  outline: none;
  background: transparent;
  user-select: none;
  height: 25px;
  font-size: 13px;
`;

type Props = {
  title: string;
  value: number;
  style?: React.CSSProperties;
  decrement: (step: number) => void;
  increment: (step: number) => void;
  onChange: (value: number) => void;
  onMouseRelease?: () => void;
};

const HScrollInput: React.FC<Props> = ({
  title,
  value,
  style,
  decrement,
  increment,
  onChange,
  onMouseRelease,
}) => {
  const { setCursor } = useCursor();
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
    onMouseRelease && onMouseRelease();
  }, [onMouseRelease]);

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
    }

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isHoldLMB, handleMouseUp, handleMouseMove]);

  useEffect(() => {
    if (isHoldLMB) {
      setCursor(CURSOR.E_RESIZE);
    } else {
      setCursor(CURSOR.AUTO);
    }
  }, [isHoldLMB]);

  return (
    <Container
      style={{ ...style, cursor: isHoldLMB ? "e-resize" : "default" }}
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
