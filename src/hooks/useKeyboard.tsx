import { ZCOOL_XiaoWei } from "next/font/google";
import { useEffect, useState } from "react";

const useKeyboard = () => {
  const [pressedKies, setPressedKies] = useState<string[]>([]);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (pressedKies.includes(e.key)) return;
      setPressedKies((prev) => [...prev, e.key]);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKies([]);
    };
    document.addEventListener("keydown", handleKeydown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [pressedKies]);

  return {
    pressedKies,
    setPressedKies
  };
};

export default useKeyboard;
