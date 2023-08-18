import {
  DesktopOutlined,
  MobileOutlined,
  TabletOutlined,
} from "@ant-design/icons";
import { Dropdown, InputNumber, MenuProps } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import InfiniteViewer from "react-infinite-viewer";
import Guides from "@scena/react-guides";

// import styles from "./index.module.less";
import useKeyDown from "@/hooks/useKeyDown";
import Index from "@/components/Moveable";
import NodeContext from "@/context";

const deviceList = [
  { label: <DesktopOutlined />, key: "pc", width: 1000 },
  { label: <TabletOutlined />, key: "pad", width: 642 },
  { label: <MobileOutlined />, key: "mobile", width: 375 },
];

function wait(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
}

export default function Content(props: React.PropsWithChildren) {

  const { children } = props;

  const horizontalGuidesRef = useRef<Guides>(null);
  const verticalGuidesRef = useRef<Guides>(null);

  const viewerRef = React.useRef<InfiniteViewer>(null);

  const { isKeyDown } = useKeyDown("space");

  const [device, setDevice] = useState(0);

  const [zoom, setZoom] = useState<number>(1);

  const [contentStyle, setContentStyle] = useState<React.CSSProperties>({
    opacity: 0,
  });

  const contentRef = useRef<HTMLDivElement>(null);

  async function init() {
    await wait(300);
    const clientWidth = contentRef.current?.firstElementChild?.clientWidth;
    const clientHeight = contentRef.current?.firstElementChild?.clientHeight;
    setContentStyle((prev) => ({
      opacity: 0,
      width: `${clientWidth}px`,
      height: `${clientHeight}px`,
    }));
    await wait(300);
    setContentStyle((prev) => ({
      width: `${clientWidth}px`,
      height: `${clientHeight}px`,
      opacity: 1,
    }));
    viewerRef.current?.scrollCenter();
  }

  useEffect(() => {
    init();
  }, []);

  function resize() {
    const containerWidth = viewerRef.current?.getContainerWidth() || 0;
    if (containerWidth > 0) {
      if (containerWidth - 100 < deviceList[device].width) {
        const zoom = (containerWidth - 100) / deviceList[device].width;
        viewerRef.current?.setZoom(zoom);
        setZoom(zoom);
      } else {
        viewerRef.current?.setZoom(1);
        setZoom(1);
      }
      viewerRef.current?.scrollCenter();
    }
  }

  useEffect(() => {
    resize();
    window.addEventListener("resize", (ev) => {
      resize();
    });

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, []);

  function handleChangeDevice(event: React.ChangeEvent<{}>, newValue: number) {
    setDevice(newValue);
    resize();
    setTimeout(() => {
      viewerRef.current?.scrollCenter();
    }, 0);
  }

  const items: MenuProps["items"] = [
    {
      label: "上一层",
      key: "increase",
    },
    {
      label: "下一层",
      key: "decrease",
    },
    {
      label: "顶层",
      key: "top",
    },
    {
      label: "底层",
      key: "bottom",
    },
  ];

  const { target, onChange } = useContext(NodeContext);

  const onClick: MenuProps["onClick"] = (e) => {
    if (!target) return;

    const find = target.className.find(
      (find: string) => find.indexOf("z") > -1
    );

    let zIndex = 1;
    const mutuallyExclusives = [];
    if (find) {
      mutuallyExclusives.push(find);
      zIndex = parseInt(find.substring(find.indexOf("-") + 1));
      switch (e.key) {
        case "increase":
          zIndex += 1;
          break;
        case "decrease":
          zIndex -= 1;
          break;
        case "top":
          zIndex = 99;
          break;
        case "bottom":
          zIndex = -99;
          break;
      }
    }

    onChange({
      className: ["relative", `z-${zIndex}`],
      mutuallyExclusives: mutuallyExclusives,
    });
  };

  return (
    <>
      <div
        className={"relative w-full h-[calc(100vh-80px)] overscroll-none preserve-3d bd-0 overflow-hidden bg-#333"}
        style={{ cursor: isKeyDown ? "grab" : "auto" }}
      >
        <div className={"relative w-30px h-30px bg-#444 box-border z-21"}></div>
        <div className={"absolute top-1 left-30px w-full h-30px z-1"}>
          <Guides
            ref={horizontalGuidesRef}
            type="horizontal"
            displayDragPos={true}
            displayGuidePos={true}
            useResizeObserver={true}
          />
        </div>
        <div className={"absolute  left-0px top-30px w-30px h-[calc(100vh-30px)] z-2331 bg-[#ff0ff0]"}>
          <Guides
            ref={verticalGuidesRef}
            type="vertical"
            displayDragPos={true}
            displayGuidePos={true}
            useResizeObserver={true}
          />
        </div>

        <InfiniteViewer
          className={"w-full h-full relative bg-#333 br-0"}
          ref={viewerRef}
          margin={0}
          threshold={0}
          displayHorizontalScroll={false}
          displayVerticalScroll={false}
          useMouseDrag={isKeyDown}
          useWheelScroll={true}
          useAutoZoom={true}
          zoomRange={[0.1, 10]}
          maxPinchWheel={10}
          onScroll={(e) => {
            const zoom = viewerRef.current?.getZoom();
            setZoom(zoom || 1);
            horizontalGuidesRef.current?.scroll(e.scrollLeft, zoom);
            horizontalGuidesRef.current?.scrollGuides(e.scrollTop, zoom);
            verticalGuidesRef.current?.scroll(e.scrollTop, zoom);
            verticalGuidesRef.current?.scrollGuides(e.scrollLeft, zoom);
          }}
        >
          <div
            ref={contentRef}
            className={`rem-elements selecto-area`}
            style={contentStyle}
          >
            <Dropdown menu={{ items, onClick }} trigger={["contextMenu"]}>
              {children}
            </Dropdown>
            <Index />
          </div>
        </InfiniteViewer>
      </div>

      <div
        className={
          "bg-white w-full border-t-1 border-b-gray-200 flex flex-justify-end"
        }
      >
        <InputNumber
          size={"small"}
          step={10}
          min={10}
          max={100}
          value={Math.floor(zoom * 100)}
          formatter={(value) => `${value}%`}
          parser={(value) => value!.replace("%", "") as any}
          onPressEnter={(event) => {
            const target = event.target as any;
            let value = target.value;
            if (value.length > 0) {
              if (value.indexOf("%") > -1) {
                value = value.substring(0, value.length - 1);
              }
            }
            const zoom = value / 100;
            setZoom(zoom);
            viewerRef.current?.setZoom(zoom);
            viewerRef.current?.scrollCenter();
          }}
          bordered={false}
        />
      </div>
    </>
  );
}
