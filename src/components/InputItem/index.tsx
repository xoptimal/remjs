import React from "react";
import { TextField } from "@mui/material";
import useDebouncedValueHook from "@/core/hooks/useDebouncedValueHook";
import RemDropdown from "@/components/DropDown";

type InputItemProps = {
  items?: Record<string, string>;
  placeholder?: string;
  tailwindPrefix: string;
  value?: string;
  itemsTransform?: (key: string, label: string) => any;
  matchValue?: (key: string, label: string) => any;
};

export default function InputItem(props: InputItemProps) {
  const { placeholder, itemsTransform } = props;

  const [value, setValue] = useDebouncedValueHook(props);

  const endAdornment = (
    <RemDropdown
      value={value}
      setValue={setValue}
      transform={itemsTransform}
      {...props}
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
