import React from "react";
import { TextField } from "@mui/material";
import useDebouncedValueHook from "@/core/hooks/useDebouncedValueHook";
import RemDropdown from "@/components/DropDown";

type InputItemProps = {
  items?: Record<string, string>;
  placeholder?: string;
  tailwindPrefix: string;
  value?: string;
};

export default function InputItem(props: InputItemProps) {
  const { placeholder, items = [], tailwindPrefix } = props;

  const [value, setValue] = useDebouncedValueHook({
    tailwindPrefix,
    items,
  });

  const endAdornment = (
    <RemDropdown
      items={items}
      value={value}
      setValue={setValue}
      tailwindPrefix={tailwindPrefix}
    />
  );

  return (
    <TextField
      size={"small"}
      label={placeholder}
      className="rem-text-field"
      value={value}
      onInput={setValue}
      InputLabelProps={{
        shrink: value.toString().length > 0,
      }}
      InputProps={{ className: "h-[30px]", endAdornment }}
    ></TextField>
  );
}
