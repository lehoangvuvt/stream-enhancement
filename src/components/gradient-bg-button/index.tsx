import styled from "styled-components";

const Button = styled.button`
  width: 100%;
  height: 52px;
  position: relative;
  background: linear-gradient(to right, #ef5350, #0099ff, #fffc00, #25d366);
  background-position: 50% 0%;
  background-size: 300% 300%;
  padding: 3.5px 3.5px;
  cursor: pointer;
  border-radius: 3px;
  border: none;
  outline: none;
  &:hover {
    animation: movingBG 1.25s ease-in infinite alternate;
    & > div {
      background-color: rgba(255, 255, 255, 0.95);
      color: black;
    }
  }
  @keyframes movingBG {
    0% {
      background-position: 50% 0%;
    }
    25% {
      background-position: 100% 0%;
    }
    50% {
      background-position: 150% 0%;
    }
    75% {
      background-position: 200% 0%;
    }
    100% {
      background-position: 250% 0%;
    }
  }
`;

const Inner = styled.div`
  border-radius: 3px;
  position: relative;
  width: 100%;
  height: 100%;
  background-color: black;
  border: none;
  outline: none;
  color: white;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  transition: all 0.25s ease-in;
`;

type Props = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  onClick: () => void;
};

const GradientBGColor: React.FC<Props> = ({ onClick, children, style }) => {
  return (
    <Button style={style} onClick={onClick}>
      <Inner>{children}</Inner>
    </Button>
  );
};

export default GradientBGColor;
