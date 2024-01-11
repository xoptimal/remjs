import { useKeyPress } from "ahooks";
import { useState } from "react";

export default function useKeyDown(
  filterKey: string | string[]
): [isKeyDown: boolean, key: string | null] {
  const [key, setKey] = useState<string | null>(null);

  useKeyPress(
    filterKey,
    (event) => {
      if (event.type === "keydown") {
        setKey(event.code.toLocaleLowerCase());
        event.preventDefault();
      } else {
        setKey(null);
      }
    },
    {
      events: ["keydown", "keyup"],
    }
  );

  return [key !== null, key];
}
