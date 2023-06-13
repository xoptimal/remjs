import {
    BlockOutlined,
    CodeOutlined,
    DesktopOutlined,
    HighlightOutlined,
    MobileOutlined,
    PlusCircleOutlined,
    TabletOutlined
} from "@ant-design/icons";
import {ProCardProps} from "@ant-design/pro-card";
import {Alert} from "antd";
import React, {useState} from "react";
import Rem from "./core/rem";
import mockCode from '@/mock/code'
import { StyleProvider } from "@ant-design/cssinjs";
import { ClickToComponent } from "click-to-react-component";

function IconText(props: { icon: React.ReactNode, text: string }) {
    const {icon, text} = props;
    return <div className="flex items-center">{icon}<span>{text}</span></div>
}

const defaultCardProps: ProCardProps = {
    ghost: true,
    bodyStyle: {
        overflow: 'hidden',
        boxSizing: "border-box",
    },
    style: {
        boxSizing: "border-box",
        overflow: 'hidden'
    },
}

type DeviceType = 'pc' | 'pad' | 'mobile'

type ContentProps = {
    device: DeviceType
    bodyWidth: number
} & React.PropsWithChildren

function Content(props: ContentProps) {

    const {device, children, bodyWidth} = props;

    const rootStyle: React.CSSProperties = {
        width: '100%',
        height: 'calc(100vh - 86px)',
        overflow: 'auto',
        minHeight: '100%',
        backgroundColor: 'rgba(241,241,241,0.1)',
        padding: 16,
    }

    const style: React.CSSProperties = {
        width: `${bodyWidth}px`,
        margin: '0 auto',
        backgroundColor: "white",
        border: 'solid 1px #f0f0f0',
        minHeight: 600,
    }

    return (
        <>
            <Alert banner message={`当前为${device}分辨率下渲染`} type="info" showIcon/>
            <section style={rootStyle}>
                <div style={style}>
                    {children}
                </div>
            </section>
        </>
    )
}


export default function App() {

    const [device, setDevice] = useState<DeviceType>('pad')

    const deviceItems = [
        {
            label: <IconText icon={<DesktopOutlined/>} text={'PC'}/>,
            key: 'pc',
            children: <Content bodyWidth={1000} device={device}/>
        },
        {
            label: <IconText icon={<TabletOutlined/>} text={'PAD'}/>,
            key: 'pad',
            children: <Content bodyWidth={642} device={device}/>
        },
        {
            label: <IconText icon={<MobileOutlined/>} text={'MOBILE'}/>,
            key: 'mobile',
            children: <Content bodyWidth={375} device={device}/>
        },
    ]

    const leftItems = [
        {
            label: <IconText icon={<PlusCircleOutlined/>} text={'组件'}/>,
            key: 'components',
            children: <span></span>
        },
        {
            label: <IconText icon={<BlockOutlined/>} text={'图层'}/>,
            key: 'index',
            children: <span></span>
        },
    ]

    const rightItems = [
        {
            label: <IconText icon={<CodeOutlined/>} text={'属性'}/>,
            key: 'components',
            children: <span></span>
        },
        {
            label: <IconText icon={<HighlightOutlined/>} text={'样式'}/>,
            key: 'index',
            children: <span></span>
        },
    ]

    return <StyleProvider hashPriority="high">
        <Rem code={mockCode}/>
       {/* <ClickToComponent  />*/}
    </StyleProvider>
}
