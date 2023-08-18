import { Button, Col, Row } from "antd";
import React, { useContext } from "react";
import NodeContext from "@/context";
import InputItem from "@/components/InputItem";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Strikethrough,
  Underline,
} from "lucide-react";
import ColorSelect from "@/components/ColorSelect";
import theme from "@/utils/theme";
import { getIconColor } from "@/utils/transform";

const textStyles = [
  {
    items: theme.weightItems,
    placeholder: "粗细",
    tailwindPrefix: "font",
  },
  {
    items: theme.sizeItems,
    placeholder: "大小",
    tailwindPrefix: "text",
  },
  {
    items: theme.leadingItems,
    placeholder: "行高",
    tailwindPrefix: "leading",
  },
  {
    items: theme.letterSpacingItems,
    placeholder: "字间距",
    tailwindPrefix: "tracking",
  },
];

const fontStyles = [
  {
    icon: <Bold />,
    className: "font-bold",
    mutuallyExclusives: Object.keys(theme.weightItems),
  },
  {
    icon: <Italic />,
    className: "italic",
  },
  {
    icon: <Underline />,
    className: "underline",
    mutuallyExclusives: ["line-through"],
  },
  {
    icon: <Strikethrough />,
    className: "line-through",
    mutuallyExclusives: ["underline"],
  },
];

const alignStyles = [
  {
    icon: <AlignLeft />,
    className: "text-left",
    mutuallyExclusives: ["text-center", "text-right"],
  },
  {
    icon: <AlignCenter />,
    className: "text-center",
    mutuallyExclusives: ["text-left", "text-right"],
  },
  {
    icon: <AlignRight />,
    className: "text-right",
    mutuallyExclusives: ["text-left", "text-center"],
  },
];

const groupItemStyle: React.CSSProperties = {
  padding: 0,
  textAlign: "center",
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const colorItems = (() => {
  const temp: Record<string, string> = {};
  for (const [key, value] of Object.entries(theme.colors)) {
    temp[`text-${key}`] = value;
  }
  return temp;
})();

export const IconItem = (item: any) => {
  const { target, onChange } = useContext(NodeContext);
  const color = getIconColor(target, item.className);
  return (
    <Button
      key={item.className}
      style={groupItemStyle}
      onClick={() => {
        const params: any = {
          mutuallyExclusives: [...item.mutuallyExclusives],
        };
        if (color) {
          params.mutuallyExclusives.push(...item.className);
          const filter = target?.className.filter(
            (find) =>
              find.indexOf("items-") > -1 || find.indexOf("justify-") > -1
          );
          if (filter && filter.length > 1) {
            //存在2个以上的items或justify, 补充进来
            params.className = "flex";
          }
        } else {
          params.className = item.className;
        }
        onChange(params);
      }}
    >
      {React.cloneElement(item.icon, {
        size: 16,
        style: { color },
      })}
    </Button>
  );
};

export default function Typography() {
  return (
    <Row gutter={[12, 12]}>
      {textStyles.map((item, index) => {
        return (
          <Col key={index} span={12}>
            <InputItem
              placeholder={item.placeholder}
              items={item.items}
              tailwindPrefix={item.tailwindPrefix}
            />
          </Col>
        );
      })}
      <Col span={24}>
        <ColorSelect items={colorItems} tailwindPrefix={"text"} />
      </Col>

      <Col span={12}>
        <Button.Group className={"w-full"}>
          {fontStyles.map(IconItem)}
        </Button.Group>
      </Col>

      <Col span={12}>
        <Button.Group className={"w-full"}>
          {alignStyles.map(IconItem)}
        </Button.Group>
      </Col>
    </Row>
  );
}
