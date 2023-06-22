import React, { useContext, useEffect, useMemo, useState } from "react";
import { Dropdown } from "antd";
import { ChevronDown } from "lucide-react";
import { checkClassName, checkValue } from "@/core/hooks/useDebouncedValueHook";
import NodeContext from "@/core/context";
import { MinusCircleOutlined } from "@ant-design/icons";

const defaultItems: any[] = [
  { type: "divider" },
  {
    key: "remove",
    label: "Remove Style",
    danger: true,
    icon: <MinusCircleOutlined />,
  },
];

export function crateMenuItems(
  items: Record<string, string>,
  transform: (
    key: string,
    value: string
  ) => { key: string; label: string | React.ReactNode; icon?: React.ReactNode }
) {
  const arr = [];
  for (const [key, value] of Object.entries(items)) {
    arr.push(transform?.(key, value) || { key, label: value });
  }
  return arr.concat(defaultItems);
}

export default function RemDropdown(props: any) {
  const {
    items,
    value,
    setValue,
    tailwindPrefix,
    children,
    transform,
    matchValue,
  } = props;

  const [selectedKeysState, setSelectedKeys] = useState<string[]>([]);

  const { target, onRemove, onChange } = useContext(NodeContext);

  const handleSelect = ({ selectedKeys }: { selectedKeys: string[] }) => {
    const key = selectedKeys[0];
    if (key === "remove") {
      let className = value;
      if (matchValue?.(value) || checkValue(value)) {
        className = `${tailwindPrefix}-[${value}]`;
      }
      onRemove({ className });
      setValue("");
    } else {
      const mutuallyExclusives = target?.className
        .filter((find) => checkClassName(find, tailwindPrefix, matchValue))
        .concat(Object.keys(items));
      onChange({ className: key, mutuallyExclusives });
    }
  };

  const menuItems = useMemo(() => {
    return crateMenuItems(items, transform);
  }, [items]);

  useEffect(() => {
    setSelectedKeys(
      items[value] && selectedKeysState[0] !== value ? [value] : []
    );
  }, [value]);

  return (
    <Dropdown
      menu={{
        items: menuItems,
        selectable: true,
        onSelect: handleSelect,
        selectedKeys: selectedKeysState,
      }}
    >
      {children || <ChevronDown className={"cursor-pointer"} size={16} />}
    </Dropdown>
  );
}
