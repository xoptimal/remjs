import {
  Background,
  Border,
  Content,
  Layout,
  MarginPadding,
  Typography,
} from "@/components";
import ActionBar from "@/components/ActionBar";
import NodeContext from "@/context";
import { CodeOutlined, HighlightOutlined } from "@ant-design/icons";
import { animated, useSpring } from "@react-spring/web";
import { Collapse, Tabs } from "antd";
import React, { useContext } from "react";
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
        <Collapse
          activeKey={rightActivities}
          onChange={setRightActivities}
          className="h-[calc(100vh-550px)] overflow-y-auto"
        >
          <CollapsePanel header="Layout" key="Layout">
            <Layout />
          </CollapsePanel>
          {/* <Panel header="Visibility" key="Visibility">
                        <VisibilityPanel />
                      </Panel>*/}
          <CollapsePanel header="Background" key="Background">
            <Background />
          </CollapsePanel>
          <CollapsePanel header="Typography" key="Typography">
            <Typography />
          </CollapsePanel>
          <CollapsePanel header="Margin & Padding" key="Margin & Padding">
            <MarginPadding />
          </CollapsePanel>
          <CollapsePanel header="Border" key="Border">
            <Border />
          </CollapsePanel>
        </Collapse>
      ),
    },
  ];
  const { isPreview } = useContext(NodeContext);

  const leftStyle = useSpring({
    from: { width: 0, opacity: 0 },
    to: {
      width: !isPreview ? 48 : 0,
      opacity: !isPreview ? 1 : 0,
    },
    delay: isPreview ? 500 : 50,
  });

  const rightStyle = useSpring({
    from: { width: 0, opacity: 0 },
    to: {
      width: !isPreview ? 357 : 0,
      opacity: !isPreview ? 1 : 0,
    },
    delay: isPreview ? 500 : 50,
  });

  const contentStyle = useSpring({
    from: {  opacity: 0 },
    to: {
      opacity: 1,
    },
    
    delay: isPreview ? 500 : 50,
  });

  return (
    <div className={"flex h-[calc(100vh-50px)] w-full overflow-hidden"}>
      <animated.div style={leftStyle} className={"h-[calc(100vh-50px)]"}>
        <ActionBar />
      </animated.div>
      <div
        className={"h-[calc(100vh-50px)] flex-1 bg-[#ebeced] relative overflow-hidden"}
      >
{/*         {isPreview ? props.children: <Content>{props.children}</Content>}
 */}        <Content>{props.children}</Content>
      </div>
      <animated.div
        style={rightStyle}
        className="border-l-[1px] border-b-gray-200 h-[calc(100vh-50px)]"
      >
        <Tabs
          style={{ height: `calc(100vh - 550px)`, overflow: "hidden" }}
          defaultActiveKey={"panel"}
          className="rem-device-tab border-b-[1px] border-b-gray-200"
          items={rightItems}
        />
        <div className="h-[500px] w-full overflow-hidden border-t-10px border-black">
          <span>图层</span>
          <Layers treeData={treeData} />
        </div>
      </animated.div>
    </div>
  );
}
