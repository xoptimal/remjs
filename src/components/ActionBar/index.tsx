import NodeContext, { EventType } from "@/context";
import { Dropdown, Menu, MenuProps } from "antd";
import {
  Circle,
  Layout,
  MousePointer2,
  Slash,
  Square,
  Squircle,
  TextCursorInput,
} from "lucide-react";
import React, { useContext, useState } from "react";

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  data?: { source: string; className: string[], isDraw?: boolean }
): MenuItem {
  return {
    key,
    icon,
    label,
    data,
  } as MenuItem;
}

const shapeItems: MenuItem[] = [
  getItem("矩形", EventType.ACTION_RECT, <Square size={14} />, {
    source: "div",
    className: ["w-1px", "h-1px", "bg-[#cccccc]"],
    isDraw: true
  }),
  getItem("圆角矩形", "SHAPE_SQUIRCLE", <Squircle size={14} />, {
    source: "div",
    className: ["w-1px", "h-1px", "bg-[#cccccc]", "rounded-8px"],
    isDraw: true
  }),
  getItem("椭圆", "SHAPE_CIRCLE", <Circle size={14} />),
  getItem("直线", "SHPAE_SLASH", <Slash size={14} />),
];

const antdItems: MenuItem[] = [
  getItem("Button", "Button"),
  getItem("Input", "Input"),
];

export default function ActionBar() {
  const { emitter } = useContext(NodeContext);

  emitter.useSubscription(({ type }) => {
    if (type === EventType.SELECT) {
      setSelectedKey([EventType.SELECT.toString()]);
    }

    // if (type === EventType.ACTION_RECT) {
    //   setSelectedKey([EventType.SELECT]);
    // }
    // if (type === EventType.ADD_TEXT) {
    //   setSelectedKey([EventType.SELECT]);
    // }
  });

  const handleSelect = (key: string, data: any) => {
    setSelectedKey([key]);
    emitter.emit({ type: parseInt(key), data });
  };

  const onClickMenuItem = (key: string, items: any[], index: number) => {
    const find: any = items.find((item) => item?.key === key);
    setItems((prev) => {
      prev.splice(index, 1, {
        key: find.key,
        label: find.label,
        icon: (
          <Dropdown
            menu={{
              items,
              onClick: ({ key }) => onClickMenuItem(key, items, index),
            }}
            trigger={["contextMenu"]}
          >
            {React.cloneElement(find.icon, { size: 18 })}
          </Dropdown>
        ),
      });
      return [...prev];
    });
    const findKey = find.key.toString();
    handleSelect(findKey, items.find((find) => find.key === key).data);
  };

  const [items, setItems] = useState<any[]>([
    getItem("选择", EventType.SELECT, <MousePointer2 size={18} />),
    getItem("布局", EventType.ADD_LAYOUT, <Layout size={18} />),
    {
      ...(shapeItems[0] as any),
      icon: (
        <Dropdown
          menu={{
            items: shapeItems,
            onClick: ({ key }) => onClickMenuItem(key, shapeItems, 2),
          }}
          trigger={["contextMenu"]}
        >
          <Square size={18} />
        </Dropdown>
      ),
    },
    getItem("文本", EventType.ADD_TEXT, <TextCursorInput size={18} />),
    getItem(
      "Ant Design 组件",
      EventType.ACTION_ANTDESIGN,
      <Dropdown
        menu={{
          items: antdItems,
          onClick: ({ key }) => onClickMenuItem(key, antdItems, 4),
        }}
        trigger={["contextMenu"]}
      >
        <img className="w-18px h-18px" src="svg/antd.svg" />
      </Dropdown>
    ),
  ]);

  const [selectedKeys, setSelectedKey] = useState<any[]>([
    EventType.SELECT.toString(),
  ]);

  return (
    <Menu
      selectedKeys={selectedKeys}
      mode="inline"
      onSelect={({ selectedKeys }) => {
        handleSelect(
          selectedKeys[0],
          items.find((find) => find.key === parseInt(selectedKeys[0])).data
        );
      }}
      inlineCollapsed={true}
      items={items}
      className="rem-action-bar"
      forceSubMenuRender
    />
  );
}
