import styled from "styled-components";
import { CloseOutlined } from "@ant-design/icons";

const Container = styled.div`
  width: 98%;
  display: flex;
  align-items: center;
  border-radius: 5px;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
`;

const Input = styled.input`
  border-radius: 5px;
  width: 100%;
  height: 42px;
  background-color: #252830;
  border: 1px solid rgba(0, 0, 0, 0.2);
  outline: none;
  padding: 10px 15px;
  box-sizing: border-box;
  color: white;
  font-size: 18px;
  font-weight: 600;
  &::placeholder {
    font-weight: 600;
    color: #868ca0;
  }
`;

type Props = {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

const SearchBar: React.FC<Props> = ({ value, placeholder, onChange }) => {
  return (
    <Container>
      <Input
        type="text"
        placeholder={placeholder ?? "Search..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value?.length > 0 && (
        <button
          type="button"
          onClick={() => onChange("")}
          style={{
            width: "45px",
            height: "100%",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#ffffff",
            fontSize: "20px",
            position: "absolute",
            right: "0px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <CloseOutlined />
        </button>
      )}
    </Container>
  );
};

export default SearchBar;
