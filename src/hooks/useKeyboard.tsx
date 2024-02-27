import { useEffect, useState } from "react";

const useKeyboard = () => {
  const [pressedKies, setPressedKies] = useState<string[]>([]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (pressedKies.includes(e.key)) return;
      setPressedKies((prev) => [...prev, e.key]);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const updatedPressedKies = pressedKies.filter((key) => key !== e.key);
      setPressedKies(updatedPressedKies);
    };

    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [pressedKies]);

  useEffect(() => {
    const handleOnBlur = () => {
      setPressedKies([]);
    };
    window.addEventListener("blur", handleOnBlur);
    return () => window.removeEventListener("blur", handleOnBlur);
  }, []);

  return {
    pressedKies,
    setPressedKies,
  };
};

export default useKeyboard;
