import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import React, {useState} from 'react';
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area"

import Desktop from '@/assets/svg/desktop.svg'
import Phone from '@/assets/svg/smartphone.svg'
import Tablet from '@/assets/svg/tablet.svg'
import Component from '@/assets/svg/component.svg'
import Layers from '@/assets/svg/layers.svg'
import Sliders from '@/assets/svg/sliders-horizontal.svg'
import Swords from '@/assets/svg/swords.svg'
import './App.css'

function IconText(props: { icon: React.ReactNode, text: string }) {
    const {icon, text} = props;
    return <>{icon}<span className={"pl-2"}>{text}</span></>
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
        minHeight: 1600,
    }

    return (
        <div style={rootStyle}>
            <div style={style}>
                {children}
            </div>
        </div>
    )
}

function App() {

    const [device, setDevice] = useState<DeviceType>('pad')

    const deviceItems = [
        {
            label: <IconText icon={<Desktop/>} text={'PC'}/>,
            key: 'pc',
            children: <Content bodyWidth={1000} device={device}/>
        },
        {
            label: <IconText icon={<Tablet/>} text={'PAD'}/>,
            key: 'pad',
            children: <Content bodyWidth={642} device={device}/>
        },
        {
            label: <IconText icon={<Phone/>} text={'MOBILE'}/>,
            key: 'mobile',
            children: <Content bodyWidth={375} device={device}/>
        },
    ]

    const leftItems = [
        {
            label: <IconText icon={<Component/>} text={'组件'}/>,
            key: 'components',
            children: <span>1</span>
        },
        {
            label: <IconText icon={<Layers/>} text={'图层'}/>,
            key: 'index',
            children: <span>2</span>
        },
    ]

    const rightItems = [
        {
            label: <IconText icon={<Swords/>} text={'属性'}/>,
            key: 'components',
            children: <span>1</span>
        },
        {
            label: <IconText icon={<Sliders/>} text={'样式'}/>,
            key: 'index',
            children: <span>2</span>
        },
    ]

    return (
        <div className={"h-screen flex shrink-0 divide-x divide-gray-400 overflow-hidden"}>
            <div className={"h-full w-[250px] shrink-0"}>
                <Tabs className={"h-[50px] w-[100%] border-solid border-b-[1px] border-gray-400"}
                      defaultValue="account">
                    <TabsList>
                        {leftItems.map(item => <TabsTrigger key={item.key} value={item.key}>{item.label}</TabsTrigger>)}
                    </TabsList>
                    {leftItems.map(item => <TabsContent key={item.key} value={item.key}>{item.children}</TabsContent>)}
                </Tabs>
            </div>
            <div className={"h-full flex-1"}>
                <Tabs className={"h-[50px] w-[calc(100vw_-_500px)] border-solid border-b-[1px] border-gray-400"}
                      value={device} onValueChange={value => setDevice(value as DeviceType)}>
                    <TabsList>
                        {deviceItems.map(item => <TabsTrigger key={item.key}
                                                              value={item.key}>{item.label}</TabsTrigger>)}
                    </TabsList>
                    {deviceItems.map(item => <TabsContent key={item.key}
                                                          value={item.key}>{item.children}</TabsContent>)}
                </Tabs>
            </div>
            <div className={"h-full w-[250px] shrink-0"}>
                <Tabs className={"h-[50px] w-[100%] border-solid border-b-[1px] border-gray-400"}
                      defaultValue="account">
                    <TabsList>
                        {rightItems.map(item => <TabsTrigger key={item.key}
                                                             value={item.key}>{item.label}</TabsTrigger>)}
                    </TabsList>
                    {rightItems.map(item => <TabsContent key={item.key} value={item.key}>{item.children}</TabsContent>)}
                </Tabs>
            </div>
        </div>
    )
}

export default App
