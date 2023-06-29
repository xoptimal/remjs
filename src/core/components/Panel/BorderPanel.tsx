import React, { useContext } from "react";
import { Col, Row } from "antd";
import InputItem from "@/components/InputItem";
import theme, { createColorItems } from "@/core/utils/theme";
import { Item } from "@/core/components/Panel/MPPanel";
import ColorSelect from "@/components/ColorSelect";
import NodeContext from "@/core/context";

const defaultStyle = `w-5 h-5 shadow-sm ring-1 ring-slate-900/5 border-indigo-500`;

const tailwindPrefix = "border";

export default function BorderPanel() {
  const { onChange, target } = useContext(NodeContext);

  const handleSelect = (key: string, value: string) => {
    const arr = ["border-t", "border-r", "border-b", "border-l"];

    switch (key) {
      case "add_all":
        {
          onChange({
            className: [
              `border-l-[${value}]`,
              `border-t-[${value}]`,
              `border-r-[${value}]`,
              `border-b-[${value}]`,
            ],
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

  const handleRadiusSelect = (key: string, value: string) => {
    const arr = ["rounded-tl", "rounded-tr", "rounded-bl", "rounded-br"];

    switch (key) {
      case "add_all":
        {
          onChange({
            className: [
              `rounded-tl-[${value}]`,
              `rounded-tr-[${value}]`,
              `rounded-bl-[${value}]`,
              `rounded-br-[${value}]`,
            ],
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
    <Row gutter={[12, 12]}>
      <Col span={24}>
        <InputItem
          placeholder={"Border Style"}
          items={theme.borderItems}
          tailwindPrefix={"border"}
          matchValue={() => false}
          itemsTransform={(key, label) => ({
            key,
            label,
            icon: <div className={`${defaultStyle} border-2 ${key}`} />,
          })}
        />
      </Col>
      <Col span={24}>
        <ColorSelect
          items={createColorItems(tailwindPrefix)}
          tailwindPrefix={tailwindPrefix}
        />
      </Col>
      <Col span={24}>
        <div className="bg-[#f8fafb] w-full  border border-inherit rounded-lg p-[4px] relative">
          <div className="h-[24px] font-bold color-black text-xs absolute left-1 top-1 scale-75">
            BORDER
          </div>
          <div className="flex flex-col items-center box-content">
            <Item
              className="px-[8px] text-center"
              tailwindPrefix={"border-t"}
              onSelect={handleSelect}
            />
            <div className="flex items-center w-full">
              <Item tailwindPrefix={"border-l"} onSelect={handleSelect} />
              <div className={"flex-1"}>
                <div className="flex items-center justify-center bg-[#ecf3fa] w-full h-[100px] border border-inherit relative my-[4px]">
                  <div className="h-[24px] font-bold color-black text-xs scale-75">
                    RADIUS
                  </div>
                  <Item
                    tailwindPrefix={"rounded-tl"}
                    onSelect={handleRadiusSelect}
                    className={"absolute left-1 top-1"}
                  />
                  <Item
                    tailwindPrefix={"rounded-tr"}
                    v={handleRadiusSelect}
                    className={"absolute right-1 top-1"}
                  />
                  <Item
                    tailwindPrefix={"rounded-bl"}
                    onSelect={handleRadiusSelect}
                    className={"absolute left-1 bottom-1"}
                  />
                  <Item
                    tailwindPrefix={"rounded-br"}
                    onSelect={handleRadiusSelect}
                    className={"absolute right-1 bottom-1"}
                  />
                </div>
              </div>
              <Item tailwindPrefix={"border-r"} onSelect={handleSelect} />
            </div>
            <Item
              className="col-span-3"
              tailwindPrefix={"border-b"}
              onSelect={handleSelect}
            />
          </div>
        </div>
      </Col>
    </Row>
  );
}
