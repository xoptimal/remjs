import React from "react";
import { Button, ColorPicker, Input } from "antd";
import { ChevronDown } from "lucide-react";
import useDebouncedValueHook from "@/core/hooks/useDebouncedValueHook";
import RemDropdown from "@/components/DropDown";

const matchValue = (value: string) =>
  /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(value);

const transform = (key: string, value: string) => {
  return {
    key,
    label: key,
    icon: (
      <div
        className={"w-[12.96px] h-[12.96px] rounded-full"}
        style={{ backgroundColor: value }}
      />
    ),
  };
};
export default function ColorSelect(props: any) {
  const { items = [], tailwindPrefix, defaultColor = "#000000" } = props;

  const [value, setValue] = useDebouncedValueHook({
    tailwindPrefix,
    items,
    matchValue,
  });

  return (
    <Button
      className={"p-0 pr-[14px] w-full flex items-center justify-between"}
    >
      <ColorPicker value={value} onChange={(value, hex) => setValue(hex)}>
        <div className={"flex"}>
          <div
            className={`w-[77px] h-[30px] rounded-l-[6px] border-r-[1px] border-[#d9d9d9]`}
            style={{ backgroundColor: items[value] || value || defaultColor }}
          />
          <Input
            bordered={false}
            value={value}
            onChange={setValue}
            className={"flex-1"}
            placeholder={"选择颜色"}
          />
        </div>
      </ColorPicker>
      <RemDropdown
        items={items}
        tailwindPrefix={tailwindPrefix}
        value={value}
        setValue={setValue}
        transform={transform}
        matchValue={matchValue}
      >
        <ChevronDown className={"cursor-pointer w-[12.96px]"} size={16} />
      </RemDropdown>
    </Button>
  );
}
