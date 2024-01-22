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
  Video,
  Image
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

const layoutItems :any[] = [
  {
    key: "flex",
    type: EventType.PAINTING,
    label: "Flex布局",
    icon: <Layout size={14} />,
    data: {
      source: "div",
      className: ["flex", "w-1px", "h-1px", "bg-[#cccccc]"],
      isDraw: true,
      attributes: [
        {}
      ]
    },
  },
  {
    key: "relative",
    type: EventType.PAINTING,
    label: "绝对布局",
    icon: <Layout size={14} />,
    data: {
      source: "div",
      className: ["relative", "w-1px", "h-1px", "bg-[#cccccc]"],
      isDraw: true,
    },
  },
]

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

function renderMoreItem(icon: React.ReactNode) {
  return (
    <div className="relative">
      {icon}
      <img
        className=" absolute right-[-2px] bottom-[-2px] w-10px h-10px"
        alt=""
        src="svg/ic_show_more.svg"
      />
    </div>
  );
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
            {renderMoreItem(React.cloneElement(find.icon, { size: 18 }))}
          </Dropdown>
        ),
      });
      return [...prev];
    });

    setSelectedKey([find.key]);
    emitter.emit({ type: find.type, data: {...find.data} });
  };

  const [items, setItems] = useState<any[]>([
    {
      key: "default",
      type: EventType.DEFAULT,
      label: "选择",
      icon: <MousePointer2 size={18} />,
    },
    {
      // key: "layout",
      // type: EventType.PAINTING,
      // label: "布局",
      // icon: <Layout size={18} />,
      ...layoutItems[0],
      icon: (
        <Dropdown
          menu={{
            items: layoutItems,
            onClick: ({ key }) => onClickMenuItem(key, layoutItems, 1),
          }}
          trigger={["contextMenu"]}
        >
          {renderMoreItem(<Layout size={18} />)}
        </Dropdown>
      ),
    },
    {
      ...shapeItems[0],
      icon: (
        <Dropdown
          menu={{
            items: shapeItems,
            onClick: ({ key }) => onClickMenuItem(key, shapeItems, 2),
          }}
          trigger={["contextMenu"]}
        >
          {renderMoreItem(<Square size={18} />)}
        </Dropdown>
      ),
    },
    {
      key: "text",
      type: EventType.PAINTING,
      label: "文本",
      icon: <TextCursorInput size={18} />,
      data: {
        source: "span",
        text: "请输入文本内容",
      },
    },
    
    {
      key: "image",
      type: EventType.PAINTING,
      label: "图片",
      icon: <Image size={18} />,
      data: {
        source: "span",
        text: "请输入文本内容",
      },
    },
     {
      key: "video",
      type: EventType.PAINTING,
      label: "视频",
      icon: <Video size={18} />,
      data: {
        source: "span",
        text: "请输入文本内容",
      },
    },
    {
      key: "antd",
      type: EventType.PAINTING,
      label: "Ant Design 组件",
      icon: renderMoreItem(
        <img className="w-18px h-18px" src="svg/antd.svg" />
      ),
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
