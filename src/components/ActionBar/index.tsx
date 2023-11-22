import {Space, Tooltip} from "antd";
import {MousePointer2, Square, Type} from "lucide-react";
import React, {useCallback, useContext} from "react";
import {clsx} from "clsx";
import NodeContext, {EventType} from "@/context";

const tabs = [
    {icon: <MousePointer2 size={18}/>, title: "选择", type: EventType.ACTION_MOVE},
    {icon: <Square size={18}/>, title: "矩形", type: EventType.ACTION_RECT},
    {icon: <Type size={18}/>, title: "文本", type: EventType.ACTION_TEXT},
]

const tabClassName = "p-8px rounded font-size-12px "
const tabSelectedClassName = "bg-blue text-white"
const hoverClassName = "hover-bg-gray-100 hover:text-black"

export default function ActionBar() {

    const [selectedTab, setSelectedTab] = React.useState(0)

    const {emitter, onChange} = useContext(NodeContext);

    emitter.useSubscription(({type}) => {
        if (type === EventType.ACTION_MOVE) {
            setSelectedTab(0)
        }
        if (type === EventType.ACTION_RECT) {
            setSelectedTab(1)
        }
        if (type === EventType.ACTION_TEXT) {
            setSelectedTab(2)
        }
    })

    const handleClickTab = useCallback((index: number) => {
        emitter.emit({type: tabs[index].type})
    }, [])

    return (
        <Space direction={"vertical"}>
            {tabs.map((tab, index) => (
                    <div
                        key={index}
                        className={clsx(tabClassName, {
                            [tabSelectedClassName]: selectedTab === index,
                            [hoverClassName]: selectedTab !== index
                        })}
                        onClick={() => handleClickTab(index)}
                    >
                        <Tooltip title={tab.title} placement={'right'}>
                            {tab.icon}
                        </Tooltip>
                    </div>
                )
            )}
        </Space>
    )
}