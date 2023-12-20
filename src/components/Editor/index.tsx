import {
    BackgroundPanel,
    BorderPanel,
    Content,
    LayoutPanel,
    MPPanel,
    Typography,
} from "@/components";
import ActionBar from "@/components/ActionBar";
import {
    CodeOutlined,
    HighlightOutlined
} from "@ant-design/icons";
import { Collapse, Tabs } from "antd";
import React from "react";
import Layers from "../Layers";
import "./index.css";

const CollapsePanel = Collapse.Panel;

function IconText(props: { icon: React.ReactNode; text: string }) {
  const { icon, text } = props;
  return (
    <div className="flex items-center">
      {icon}
      <span>{text}</span>
    </div>
  );
}

export default function Editor(props: any) {
  const { treeData = [] } = props;

  //   const leftItems = [
  //     // {
  //     //     label: <div><BlockOutlined/><span>图层</span></div>,
  //     //     key: "Layers",
  //     //     children: <Layers treeData={treeData}/>,
  //     // },
  //     {
  //       label: <IconText icon={<PlusCircleOutlined />} text={"组件"} />,
  //       key: "components",
  //       children: <AntDesignUI />,
  //     },
  //   ];

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
          <CollapsePanel header="Layout" key="Layout">
            <LayoutPanel />
          </CollapsePanel>
          {/* <Panel header="Visibility" key="Visibility">
                        <VisibilityPanel />
                      </Panel>*/}
          <CollapsePanel header="Background" key="Background">
            <BackgroundPanel />
          </CollapsePanel>
          <CollapsePanel header="Typography" key="Typography">
            <Typography />
          </CollapsePanel>
          <CollapsePanel header="Margin & Padding" key="Margin & Padding">
            <MPPanel />
          </CollapsePanel>
          <CollapsePanel header="Border" key="Border">
            <BorderPanel />
          </CollapsePanel>
        </Collapse>
      ),
    },
  ];

  return (
    <div className={"flex"}>
      <div className={"h-[calc(100vh-50px)"}>
        <ActionBar />
      </div>
      {/* <div
                className={
                    "h-[calc(100vh-50px)] w-[370px] border-r-[1px] border-b-gray-200"
                }
            >
                <Tabs
                    className={"rem-device-tab border-b-[1px] border-b-gray-200"}
                    defaultActiveKey="Layers"
                    items={leftItems}
                />
            </div> */}
      <div
        className={
          "h-[calc(100vh-50px)] w-[calc(100vw-357px)] bg-red relative flex flex-col justify-center"
        }
      >
        <Content>{props.children}</Content>
      </div>
      <div className="h-[calc(100vh-50px)] w-[357px] border-l-[1px] border-b-gray-200">
        <Tabs
          style={{ height: "60%", overflow: "hidden" }}
          defaultActiveKey={"panel"}
          className="rem-device-tab border-b-[1px] border-b-gray-200"
          items={rightItems}
        />

        <div className="h-[40%] w-full overflow-hidden border-t-10px border-black">
          <span>图层</span>
          <Layers treeData={treeData} />
        </div>
      </div>
    </div>
  );
}
