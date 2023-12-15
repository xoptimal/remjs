import RemDropdown from "@/components/DropDown";
import NodeContext from "@/context";
import { TextField } from "@mui/material";
import { useDebounce } from "ahooks";
import { useContext, useEffect, useRef, useState } from "react";
import { InputItemProps } from "./index";

export default function InputItemToDom(
  props: InputItemProps & { styleKey: string }
) {
  const { placeholder, itemsTransform, styleKey } = props;

  const { target, onChange } = useContext(NodeContext);
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce(value, { wait: 500 });

  const resetValueRef = useRef(true);

  useEffect(() => {
    console.log("InputItemToDom target", target?.style);
    
    if (target) {
      // @ts-ignore
      setValue(target.style[styleKey] || "");
    } else {
      resetValueRef.current = true;
      setValue("");
    }
  }, [target]);

  const handleInput = (event: any) => {
    setValue(typeof event === "string" ? event : event.target.value);
  };

  const endAdornment = (
    <RemDropdown value={value} setValue={handleInput} {...props} />
  );

  useEffect(() => {

    if (resetValueRef.current) {
      resetValueRef.current = false;
      return;
    }

    // @ts-ignore
    if (target && target.style[styleKey] !== debouncedValue) {
      console.log('xx');
      
      onChange({ style: { [styleKey]: debouncedValue } });
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
