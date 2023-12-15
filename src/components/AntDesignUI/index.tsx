import NodeContext, { EventType } from "@/context";
import { Button, Col, Input, Row } from "antd";
import { useContext } from "react";

export type ExtensionElement = {
  key: string;
  source: any;
  dom: JSX.Element;
  text?: string;
  placeholder?: string;
  className?: string[];
  import: string
};

const list: ExtensionElement[] = [
  {
    key: "Button",
    source: Button,
    text: '按钮',
    dom: <Button className={"w-full"}>按钮</Button>,
    import: 'import { Button } from "antd"',
  },
  {
    key: "Input",
    source: Input,
    placeholder: "请输入",
    dom: <Input placeholder={"请输入"} />,
    import: 'import { Input } from "antd"',
  },
];

export default function () {
  const { emitter, target, setTarget } = useContext(NodeContext);

  return (
    <Row gutter={[16, 16]} className={"px-16px"}>
      {list.map((item) => {
        return (
          <Col span={12} key={item.key}>
            <Button>123</Button>
            <div
              onMouseDown={(e) => {
                emitter.emit({ type: EventType.GRAB, data: item });
              }}
              className={
                "relative flex-1 bg-gray-100 h-100px flex items-center justify-center rounded-8px px-16px hover:bg-black select-none"
              }
            >
              {item.dom}
              <div className={"absolute top-0 left-0 w-full h-full z-1"} />
            </div>
          </Col>
        );
      })}
    </Row>
  );
}
