import {
  BlockOutlined,
  CodeOutlined,
  DesktopOutlined,
  HighlightOutlined,
  MobileOutlined,
  PlusCircleOutlined,
  TabletOutlined,
} from "@ant-design/icons";
import { Button, Collapse, Tabs } from "antd";
import React from "react";
import Layers from "../Layers";
import Content from "@/core/components/Content";
import {
  BackgroundPanel,
  BorderPanel,
  LayoutPanel,
  MPPanel,
  Typography,
} from "@/core/components/Panel";

function IconText(props: { icon: React.ReactNode; text: string }) {
  const { icon, text } = props;
  return (
    <div className="flex items-center">
      {icon}
      <span>{text}</span>
    </div>
  );
}

const deviceList = [
  { label: <DesktopOutlined />, key: "pc", width: 1000 },
  { label: <TabletOutlined />, key: "pad", width: 642 },
  { label: <MobileOutlined />, key: "mobile", width: 375 },
];

const Panel = Collapse.Panel;

export default function Layout(props: any) {
  const leftItems = [
    {
      label: <BlockOutlined />,
      key: "Layers",
      children: <Layers treeData={props.treeData} />,
    },
    {
      label: <IconText icon={<PlusCircleOutlined />} text={"组件"} />,
      key: "components",
      children: <span></span>,
    },
  ];

  const [rightActivities, setRightActivities] = React.useState<
    string | string[]
  >(["Border"]);

  const rightItems = [
    {
      label: <CodeOutlined />,
      key: "components",
      children: <span>123</span>,
    },
    {
      label: <IconText icon={<HighlightOutlined />} text={"样式"} />,
      key: "panel",
      children: (
        <Collapse activeKey={rightActivities} onChange={setRightActivities}>
          <Panel header="Layout" key="Layout">
            <LayoutPanel />
          </Panel>
          {/* <Panel header="Visibility" key="Visibility">
            <VisibilityPanel />
          </Panel>*/}
          <Panel header="Background" key="Background">
            <BackgroundPanel />
          </Panel>
          <Panel header="Typography" key="Typography">
            <Typography />
          </Panel>
          <Panel header="Margin & Padding" key="Margin & Padding">
            <MPPanel />
          </Panel>
          <Panel header="Border" key="Border">
            <BorderPanel />
          </Panel>
        </Collapse>
      ),
    },
  ];

  return (
    <div className={"w-full h-screen bg-white"}>
      <div
        className={
          "w-full h-[50px] flex items-center px-[16px] border-b-[1px] border-b-gray-200"
        }
      >
        <h1>REM</h1>
        <div className={"h-full flex-1"}>
          <Tabs
            centered
            className={"rem-device-tab"}
            defaultActiveKey="1"
            items={deviceList}
          />
        </div>
        <div>
          <Button type={"primary"} onClick={props.onSave}>
            SAVE
          </Button>
        </div>
      </div>
      <div className={"flex"}>
        <div
          className={
            "h-[calc(100vh_-_50px)] w-[370px] border-r-[1px] border-b-gray-200"
          }
        >
          <Tabs
            className={"rem-device-tab border-b-[1px] border-b-gray-200"}
            defaultActiveKey="Layers"
            items={leftItems}
          />
        </div>
        <div className={"h-[calc(100vh_-_50px)] w-[calc(100%_-_727px)]"}>
          <Content>{props.children}</Content>
        </div>
        <div
          className={
            "h-[calc(100vh_-_50px)] w-[357px] border-l-[1px] border-b-gray-200"
          }
        >
          <Tabs
            style={{ height: "calc(100vh - 50px)", overflow: "hidden" }}
            defaultActiveKey={"panel"}
            className={"rem-device-tab border-b-[1px] border-b-gray-200"}
            items={rightItems}
          />
        </div>
      </div>
    </div>
  );
}
