import NodeContext, { EventType } from "@/context";
import { Button, Dropdown, Input, Menu } from "antd";
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

const shapeItems: any[] = [
  {
    key: "square",
    type: EventType.PAINTING,
    icon: <Square size={14} />,
    label: "矩形",
    data: {
      source: "div",
      className: ["w-1px", "h-1px", "bg-[#cccccc]"],
      isDraw: true,
    },
  },
  {
    key: "squircle",
    type: EventType.PAINTING,
    icon: <Squircle size={14} />,
    label: "圆角矩形",
    data: {
      source: "div",
      className: ["w-1px", "h-1px", "bg-[#cccccc]", "rounded-16px"],
      isDraw: true,
    },
  },
  {
    key: "circle",
    type: EventType.PAINTING,
    icon: <Circle size={14} />,
    label: "椭圆",
    data: {
      source: "div",
      className: ["w-1px", "h-1px", "bg-[#cccccc]", "rounded-full"],
      isDraw: true,
    },
  },
  // {
  //   key: "slash",
  //   type: EventType.PAINTING,
  //   icon: <Slash size={14} />,
  //   label: "直线",
  //   data: {
  //     source: "div",
  //     className: ["w-1px", "h-1px", "bg-[#cccccc]"],
  //     isDraw: true,
  //     isSlash: true,
  //   },
  // },
];

const antdItems: any[] = [
  {
    key: "button",
    type: EventType.PAINTING,
    icon: <Slash size={14} />,
    label: "Button",
    data: {
      source: Button,
      text: "按钮",
      import: 'import { Button } from "antd"',
    },
  },
  {
    key: "input",
    type: EventType.PAINTING,
    icon: <Slash size={14} />,
    label: "Input",
    data: {
      source: Input,
      import: 'import { Input } from "antd"',
    },
  },
];

function getItemByPath(items: any[], keyPath: string[]) {
  const index = keyPath.length - 1;

  const key = keyPath[index];
  const find = items.find((find) => find.key === key);

  if (index === 0) {
    return find;
  } else {
    keyPath.splice(index, 1);
    return getItemByPath(find.children, keyPath);
  }
}

export default function ActionBar() {
  const { emitter } = useContext(NodeContext);
  const [selectedKeys, setSelectedKey] = useState<any[]>(["default"]);

  emitter.useSubscription(({ type }) => {
    if (type === EventType.DEFAULT) {
      setSelectedKey(["default"]);
    }

    // if (type === EventType.ACTION_RECT) {
    //   setSelectedKey([EventType.SELECT]);
    // }
    // if (type === EventType.ADD_TEXT) {
    //   setSelectedKey([EventType.SELECT]);
    // }
  });

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

    setSelectedKey([find.key]);
    emitter.emit({ type: find.type, data: find.data });
  };

  const [items, setItems] = useState<any[]>([
    {
      key: "default",
      type: EventType.DEFAULT,
      label: "选择",
      icon: <MousePointer2 size={18} />,
    },
    {
      key: "layout",
      type: EventType.ADD_LAYOUT,
      label: "布局",
      icon: <Layout size={18} />,
    },
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
    {
      key: "text",
      type: EventType.ADD_TEXT,
      label: "文本",
      icon: <TextCursorInput size={18} />,
    },
    {
      key: "antd",
      type: EventType.ACTION_ANTDESIGN,
      label: "Ant Design 组件",
      icon: <img className="w-18px h-18px" src="svg/antd.svg" />,
      children: antdItems,
      // icon: (
      //   <Dropdown
      //     menu={{
      //       items: antdItems,
      //       onClick: ({ key }) => onClickMenuItem(key, antdItems, 4),
      //     }}
      //     trigger={["contextMenu"]}
      //   >
      //     <img className="w-18px h-18px" src="svg/antd.svg" />
      //   </Dropdown>
      // ),
    },
  ]);

  return (
    <Menu
      selectedKeys={selectedKeys}
      mode="inline"
      onSelect={({ selectedKeys, keyPath }) => {
        setSelectedKey(selectedKeys);
        const find = getItemByPath(items, keyPath);
        emitter.emit({ type: find.type, data: find.data });
      }}
      inlineCollapsed={true}
      items={items}
      className="rem-action-bar"
      forceSubMenuRender
    />
  );
}
