import React, { useContext, useEffect, useMemo, useState } from "react";
import { Dropdown } from "antd";
import { ChevronDown } from "lucide-react";
import { checkClassName, checkValue } from "@/hooks/useDebouncedValueHook";
import NodeContext from "@/context";
import { MinusCircleOutlined } from "@ant-design/icons";

const defaultItems: any[] = [
  { type: "divider", key: "divider" },
  {
    key: "remove",
    label: "Remove Style",
    danger: true,
    icon: <MinusCircleOutlined />,
  },
];

export function crateMenuItems(
  items:
    | Record<string, string>
    | { key?: string; label?: string; type?: string }[],
  transform: (
    key: string,
    value: string
  ) => { key: string; label: string | React.ReactNode; icon?: React.ReactNode }
) {
  let arr = [];
  if (Array.isArray(items)) {
    arr = items.map((item) =>
      item.key && item.label && transform
        ? transform(item.key, item.label)
        : item
    );
  } else {
    for (const [key, value] of Object.entries(items)) {
      arr.push(transform?.(key, value) || { key, label: value });
    }
    arr = arr.concat(defaultItems);
  }
  return arr;
}

export default function RemDropdown(props: any) {
  const {
    items = [],
    value,
    setValue,
    tailwindPrefix,
    children,
    transform,
    matchValue,
    onSelect,
  } = props;

  const [selectedKeysState, setSelectedKeys] = useState<string[]>([]);

  const { target, onChange } = useContext(NodeContext);

  const handleSelect = ({ selectedKeys }: { selectedKeys: string[] }) => {
    const key = selectedKeys[0];
    if (key === "remove") {
      let className = value;
      if (matchValue?.(value) || checkValue(value)) {
        className = `${tailwindPrefix}-[${value}]`;
      }
      onChange({ mutuallyExclusives: [className] });
      setValue("");
    } else {
      if (onSelect) {
        onSelect(key);
      } else {
        const mutuallyExclusives = target?.className
          .filter((className) =>
            checkClassName({ className, tailwindPrefix, matchValue })
          )
          .concat(Object.keys(items));
        onChange({ className: key, mutuallyExclusives });
      }
    }
  };

  const menuItems: any[] = useMemo(() => {
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
