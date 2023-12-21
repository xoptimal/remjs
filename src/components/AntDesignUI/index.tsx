import NodeContext, { EventType } from "@/context";
import { getAntdSvgIcon } from "@/utils/utils";
import { Button, Card, Col, Input, Row } from "antd";
import { useContext } from "react";

export type ExtensionElement = {
  key: string;
  source: any;
  dom: JSX.Element;
  text?: string;
  placeholder?: string;
  className?: string[];
  import: string;
  id: string;
  parentId?: string;
  style: React.CSSProperties;
  children: any[];
};

const list: any[] = [
  {
    key: 'Button',
    label: "Button 按钮",
    preview: getAntdSvgIcon("button"),
    source: Button,
    text: "按钮",
    import: 'import { Button } from "antd"',
    
  },
  {
    key: "Input",
    label: "Input 输入框",
    preview: getAntdSvgIcon("input"),
    source: Input,
    import: 'import { Input } from "antd"',
  },
];


export default function () {
  const { emitter } = useContext(NodeContext);

  return (
    <Row gutter={[16, 16]} className={"px-16px"}>
      {/* {list.map((item) => {
        return (
          <Col span={12} key={item.key}>
            <Card
              title={item.label}
              onMouseDown={(e) => {
                emitter.emit({ type: EventType.GRAB, data: item });
              }}
              className="rem-card"
              size="small"
            >
             <img className=" w-full h-72px" src={item.preview} alt="" />
            </Card>
          </Col>
        );
      })} */}
    </Row>
  );
}
