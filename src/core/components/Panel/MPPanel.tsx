import { Input } from "antd";
import React, { useContext, useMemo } from "react";
import useDebouncedValueHook from "@/core/hooks/useDebouncedValueHook";
import { cn } from "@/lib/utils";
import NodeContext from "@/core/context";
import RemDropdown from "@/components/DropDown";
import { MinusCircleOutlined } from "@ant-design/icons";
import { ChevronDown } from "lucide-react";

function createItems(value: string, type: string) {
  return [
    { label: `Set all to ${type} to ${value}`, key: "add_all" },
    { type: "divider" },
    {
      key: "remove",
      label: "Remove Style",
      danger: true,
      icon: <MinusCircleOutlined />,
    },
    {
      label: `Remove all ${type}`,
      key: "remove_all",
      danger: true,
      icon: <MinusCircleOutlined />,
    },
  ];
}

const defaultValue = "0px";

export const Item = (props: any) => {
  const { tailwindPrefix, onSelect: onSelectProp, className } = props;

  const [value, setValue] = useDebouncedValueHook(props);

  const items = useMemo(() => {
    return createItems(
      value || defaultValue,
      tailwindPrefix.indexOf("m") > -1
        ? "margin"
        : tailwindPrefix.indexOf("p") > -1
        ? "padding"
        : tailwindPrefix.indexOf("border") > -1
        ? "border"
        : "border radius"
    );
  }, [tailwindPrefix, value]);

  return (
    <div className={cn("flex items-center", className)}>
      <Input
        size={"small"}
        value={value}
        bordered={false}
        placeholder={defaultValue}
        onFocus={(event) => {
          event.stopPropagation();
        }}
        onBlur={(event) => {
          event.stopPropagation();
        }}
        className={""}
        style={{
          width: "32px",
          fontSize: "12px",
          flexShrink: 0,
          color: "#333",
          padding: 0,
          textAlign: "center",
        }}
        onInput={(event: any) => setValue(event.target.value)}
      />
      <RemDropdown
        items={items}
        value={value}
        setValue={setValue}
        tailwindPrefix={tailwindPrefix}
        onSelect={(key: string) => onSelectProp(key, value)}
      >
        <ChevronDown className={"cursor-pointer w-[12px]"} size={16} />
      </RemDropdown>
    </div>
  );
};

export default function MPPanel() {
  const { onChange, target } = useContext(NodeContext);

  const handleMarginSelect = (key: string, value: string) => {
    const arr = ["mt-", "mb-", "ml-", "mr-", "m-"];
    switch (key) {
      case "add_all":
        {
          const mutuallyExclusives = target?.className.filter(
            (className) =>
              arr.findIndex((find) => className.indexOf(find) > -1) > -1
          );
          onChange({
            className: [
              `ml-[${value}]`,
              `mt-[${value}]`,
              `mr-[${value}]`,
              `mb-[${value}]`,
            ],
            mutuallyExclusives,
          });
        }
        break;
      case "add_auto":
        break;
      case "remove_all":
        const mutuallyExclusives = target?.className.filter(
          (className) =>
            arr.findIndex((find) => className.indexOf(find) > -1) > -1
        );
        onChange({ mutuallyExclusives });
        break;
    }
  };

  const handlePaddingSelect = (key: string, value: string) => {
    const arr = ["pt-", "pb-", "pl-", "pr-", "p-"];

    switch (key) {
      case "add_all":
        {
          const mutuallyExclusives = target?.className.filter(
            (className) =>
              arr.findIndex((find) => className.indexOf(find) > -1) > -1
          );
          onChange({
            className: [
              `pl-[${value}]`,
              `pt-[${value}]`,
              `pr-[${value}]`,
              `pb-[${value}]`,
            ],
            mutuallyExclusives,
          });
        }
        break;
      case "add_auto":
        break;
      case "remove_all":
        const mutuallyExclusives = target?.className.filter(
          (className) =>
            arr.findIndex((find) => className.indexOf(find) > -1) > -1
        );
        onChange({ mutuallyExclusives });
        break;
    }
  };

  return (
    <div className="bg-[#f8fafb] w-full  border border-inherit rounded-lg p-[4px] relative">
      <div className="h-[24px] font-bold color-black text-xs absolute left-1 top-1 scale-75">
        MARGIN
      </div>
      <div className="flex flex-col items-center box-content">
        <div className="px-[8px] text-center">
          <Item
            tailwindPrefix={"mt"}
            parentTailwindPrefix={"m"}
            onSelect={handleMarginSelect}
          />
        </div>
        <div className="flex items-center w-full">
          <Item
            tailwindPrefix={"ml"}
            parentTailwindPrefix={"m"}
            className={"items-start justify-start"}
            onSelect={handleMarginSelect}
          />
          <div className="flex-1">
            <div className="bg-[#ecf3fa] w-full  border border-inherit rounded-lg p-[4px] relative my-[4px]">
              <div className="h-[24px] font-bold color-black text-xs absolute left-1 top-1 scale-75">
                PADDING
              </div>
              <div className="flex flex-col items-center box-content">
                <Item
                  tailwindPrefix={"pt"}
                  parentTailwindPrefix={"p"}
                  onSelect={handlePaddingSelect}
                />
                <div className="flex items-center justify-center w-full">
                  <Item
                    tailwindPrefix={"pl"}
                    parentTailwindPrefix={"p"}
                    onSelect={handlePaddingSelect}
                  />
                  <div className="bg-white flex-1 flex-shrink-0 h-[56px] border border-inherit rounded-lg my-[4px]" />
                  <Item
                    tailwindPrefix={"pr"}
                    parentTailwindPrefix={"p"}
                    onSelect={handlePaddingSelect}
                  />
                </div>
                <Item
                  tailwindPrefix={"pb"}
                  parentTailwindPrefix={"p"}
                  onSelect={handlePaddingSelect}
                />
              </div>
            </div>
          </div>
          <Item
            tailwindPrefix={"mr"}
            parentTailwindPrefix={"m"}
            onSelect={handleMarginSelect}
          />
        </div>
        <div className="col-span-3">
          <Item
            tailwindPrefix={"mb"}
            parentTailwindPrefix={"m"}
            onSelect={handleMarginSelect}
          />
        </div>
      </div>
    </div>
  );
}
