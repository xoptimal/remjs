import { useKeyPress } from "ahooks";
import { useState } from "react";

export default function useKeyDown(filterKey: string | string[]) {
  const [key, setKey] = useState<string | null>(null);

  useKeyPress(
    filterKey,
    (event) => {
      if (event.type === "keydown") {
        setKey(event.code.toLocaleLowerCase());
      } else {
        setKey(null);
      }
    },
    {
      events: ["keydown", "keyup"],
    }
  );

  return { isKeyDown: key !== null, key };
}
