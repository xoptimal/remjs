import {DesktopOutlined, MobileOutlined, TabletOutlined} from "@ant-design/icons";
import {InputNumber} from "antd";
import React, {useEffect, useRef, useState} from "react";
import InfiniteViewer from "react-infinite-viewer";
import Guides from "@scena/react-guides";
import {useKeycon} from "react-keycon";
import Moveable from "react-moveable";
import RemMoveable from "@/core/RemMoveable";

import styles from './index.module.less'

function IconText(props: { icon: React.ReactNode, text: string }) {
    const {icon, text} = props;
    return <div className="flex items-center">{icon}<span>{text}</span></div>
}


const deviceList = [
    {label: <DesktopOutlined/>, key: 'pc', width: 1000},
    {label: <TabletOutlined/>, key: 'pad', width: 642},
    {label: <MobileOutlined/>, key: 'mobile', width: 375}
]

export default function Index(props: React.PropsWithChildren) {

    const {children} = props;

    const horizontalGuidesRef = useRef<Guides>(null);
    const verticalGuidesRef = useRef<Guides>(null);

    const viewerRef = React.useRef<InfiniteViewer>(null);
    const {isKeydown: isSpace} = useKeycon({keys: "space"});
    const moveableRef = React.useRef<Moveable>(null);

    const [device, setDevice] = useState(0)

    const [zoom, setZoom] = useState<number>(1)

    const style: React.CSSProperties = {
        width: `${deviceList[device].width}px`,
        backgroundColor: "white",
        border: 'solid 1px #f0f0f0',
        //minHeight: 600,
    }

    function resize() {
        const containerWidth = viewerRef.current?.getContainerWidth() || 0
        if (containerWidth > 0) {

            if ((containerWidth - 100) < deviceList[device].width) {
                const zoom = (containerWidth - 100) / deviceList[device].width
                viewerRef.current?.setZoom(zoom)
                setZoom(zoom)
            } else {
                viewerRef.current?.setZoom(1)
                setZoom(1)
            }
            viewerRef.current?.scrollCenter();
        }
    }

    useEffect(() => {
        resize();
        window.addEventListener("resize", ev => {
            resize();
        })
        return () => {
            window.removeEventListener("resize", () => {
            })
        }
    }, [])

    function handleChangeDevice(event: React.ChangeEvent<{}>, newValue: number) {
        setDevice(newValue);
        resize();
        setTimeout(() => {
            viewerRef.current?.scrollCenter();
        }, 0)
    }

    return (
        <>
            <div className={styles.container} style={{cursor: isSpace ? 'grab' : 'auto'}}>
                <div className={styles.box}></div>
                <div className={styles.horizontal}>
                    <Guides
                        ref={horizontalGuidesRef}
                        type="horizontal"
                        displayDragPos={true}
                        displayGuidePos={true}
                        useResizeObserver={true}
                    />
                </div>
                <div className={styles.vertical}>
                    <Guides
                        ref={verticalGuidesRef}
                        type="vertical"
                        displayDragPos={true}
                        displayGuidePos={true}
                        useResizeObserver={true}
                    />
                </div>

                <InfiniteViewer
                    ref={viewerRef}
                    margin={0}
                    threshold={0}
                    displayHorizontalScroll={false}
                    displayVerticalScroll={false}
                    className={styles.viewer}
                    useMouseDrag={isSpace}
                    useWheelScroll={true}
                    useAutoZoom
                    zoomRange={[0.1, 10]}
                    maxPinchWheel={10}
                    onScroll={e => {
                        const zoom = viewerRef.current?.getZoom()
                        setZoom(zoom || 1)
                        horizontalGuidesRef.current?.scroll(e.scrollLeft, zoom);
                        horizontalGuidesRef.current?.scrollGuides(e.scrollTop, zoom);
                        verticalGuidesRef.current?.scroll(e.scrollTop, zoom);
                        verticalGuidesRef.current?.scrollGuides(e.scrollLeft, zoom);
                        moveableRef.current?.updateRect();
                    }}
                >
                    <div style={style} className={"rem-elements selecto-area"}>
                        {children}
                    </div>
                </InfiniteViewer>
                <RemMoveable ref={moveableRef}/>
            </div>

            <div className={"bg-white w-full border-t-[1px] border-b-gray-200 flex justify-end"}>
                <InputNumber size={"small"}
                             step={10}
                             min={10}
                             max={100}
                             value={Math.floor(zoom * 100)}
                             formatter={(value) => `${value}%`}
                             parser={(value) => value!.replace('%', '') as any}
                             onPressEnter={event => {
                                 const target = event.target as any;
                                 let value = target.value
                                 if (value.length > 0) {
                                     if (value.indexOf("%") > -1) {
                                         value = value.substring(0, value.length - 1)
                                     }
                                 }
                                 const zoom = value / 100
                                 setZoom(zoom)
                                 viewerRef.current?.setZoom(zoom)
                                 viewerRef.current?.scrollCenter();
                             }}
                             bordered={false}/>
            </div>
        </>
    )
}
