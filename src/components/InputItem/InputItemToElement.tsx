import RemDropdown from "@/components/DropDown";
import NodeContext from "@/context";
import { TextField } from "@mui/material";
import { useDebounce } from "ahooks";
import { useContext, useEffect, useState } from "react";
import { InputItemProps } from "./index";

export default function InputItemToDom(
  props: InputItemProps & { styleKey: string }
) {
  const { placeholder, itemsTransform, styleKey } = props;

  const { target, onChange } = useContext(NodeContext);
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce(value, { wait: 500 });

  useEffect(() => {
    console.log("target 11111111111111", target);
    if(target) {
      // @ts-ignore
    setValue(target.style[styleKey] || "");
    }
  }, [target]);

  const handleInput = (event: any) => {
    setValue(typeof event === "string" ? event : event.target.value);
  };

  const endAdornment = (
    <RemDropdown value={value} setValue={handleInput} {...props} />
  );

  useEffect(() => {
      // @ts-ignore
      if(target && target.style[styleKey] !== debouncedValue) {
        onChange({ style: { [styleKey]: debouncedValue } },);
      }
  }, [debouncedValue]);

  return (
    <TextField
      size={"small"}
      label={placeholder}
      className="rem-text-field"
      value={value}
      onInput={handleInput}
      InputLabelProps={{
        shrink: value.toString().length > 0,
      }}
      InputProps={{ className: "h-[30px]", endAdornment }}
    ></TextField>
  );
}
