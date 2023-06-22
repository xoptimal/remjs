import { Button, Col, Row } from "antd";
import React, { useContext } from "react";
import NodeContext from "@/core/context";
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
import theme from "@/core/utils/theme";
import { getIconColor } from "@/core/utils/transform";

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
    mutuallyExclusives: theme.weightItems,
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

export default function Typography() {
  const { target, onChange, onRemove } = useContext(NodeContext);

  const IconItem = (item: any) => (
    <Button
      key={item.className}
      style={groupItemStyle}
      onClick={() =>
        onChange({
          className: item.className,
          mutuallyExclusives: item.mutuallyExclusives,
        })
      }
    >
      {React.cloneElement(item.icon, {
        size: 16,
        style: { color: getIconColor(target, item.className) },
      })}
    </Button>
  );

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
