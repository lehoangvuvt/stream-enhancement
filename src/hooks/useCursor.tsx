export enum CURSOR {
  AUTO = "auto",
  DEAFAULT = "default",
  POINTER = "pointer",
  E_RESIZE = "e-resize",
}

const useCursor = () => {
  const setCursor = (cursor: CURSOR) => {
    document.body.style.cursor = cursor.toString();
  };

  return {
    setCursor,
  };
};

export default useCursor;

