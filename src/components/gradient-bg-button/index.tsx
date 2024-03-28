import styled from "styled-components";

const Button = styled.button`
  width: 100%;
  padding: 20px 30px;
  background-image: linear-gradient(
    to right,
    #00c299,
    #d5cc73,
    #00c299,
    #d5cc73
  );
  background-size: 300% 300%;
  background-position: 0% 100%;
  font-size: 16px;
  font-weight: 600;
  border: none;
  outline: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  filter: brightness(100%);
  transition: padding 0.25s ease;
  &:disabled {
    filter: brightness(50%);
    cursor: not-allowed;
    &:hover {
      animation: none;
      padding: 20px 30px;
    }
  }
  &:hover {
    animation: LoginButtonHover 1s ease 0s;
    padding: 20px 20px;
    @keyframes LoginButtonHover {
      from {
        background-position: 0% 100%;
      }
      to {
        background-position: 100% 100%;
      }
    }
  }
`;

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

const GradientBgButton: React.FC<Props> = ({
  children,
  onClick,
  disabled = false,
}) => {
  return (
    <Button disabled={disabled} onClick={onClick}>
      {children}
    </Button>
  );
};

export default GradientBgButton;
