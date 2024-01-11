import {
  DesktopOutlined,
  MobileOutlined,
  TabletOutlined,
} from "@ant-design/icons";
import Guides from "@scena/react-guides";
import { Dropdown, DropdownProps, MenuProps } from "antd";
import React, {
  Fragment,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import InfiniteViewer from "react-infinite-viewer";

// import styles from "./index.module.less";
import { Movable } from "@/components";
import NodeContext, { EventType } from "@/context";
import useKeyDown from "@/hooks/useKeyDown";
import { animated, useSpring } from "@react-spring/web";
import { useAsyncEffect, useGetState, useKeyPress } from "ahooks";

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

const defaultContentStyle: React.CSSProperties = {
  opacity: 0,
  background: "white",
  width: "fit-content",
  //cursor: "default",
  position: "relative",
};

export type MouseDown = {
  down: boolean;
  offsetX: number;
  offsetY: number;
};

export default function Content(props: React.PropsWithChildren) {
  const { children: childrenProps } = props;

  const horizontalGuidesRef = useRef<Guides>(null);

  const verticalGuidesRef = useRef<Guides>(null);

  const viewerRef = React.useRef<InfiniteViewer>(null);

  const [isKeyDown] = useKeyDown("space");

  const [device, setDevice] = useState(0);

  const [zoom, setZoom] = useState<number>(1);

  const [contentStyle, setContentStyle, getContentStyle] =
    useGetState<React.CSSProperties>(defaultContentStyle);

  const contentRef = useRef<HTMLDivElement>(null);

  const [openContextMenu, setOpenContextMenu] = useState(false);

  const { target, emitter, onChange, isPreview } = useContext(NodeContext);

  const [children, setChildren] = useState<React.ReactNode>(<Fragment />);

  const [init, setInit] = useState(false);

  const paintingRef = useRef<any>();

  emitter.useSubscription(({ type, nodeIds, data }) => {
    if (type === EventType.INIT && getContentStyle().opacity === 1) {
      setContentStyle((prev) => ({ ...prev, opacity: 0 }));
    }

    if (type === EventType.PAINTING) {
      paintingRef.current = data;
      console.log("paintingRef.current", paintingRef.current);
    }

    //  重制状态
    if (type === EventType.DEFAULT) {
      paintingRef.current = null;
    }

    // if (type === EventType.ADD_TEXT) {
    //   setContentStyle((prev) => ({ ...prev, cursor: "text" }));
    // }

    // if (type === EventType.ACTION_RECT) {
    //   //setContentStyle((prev) => ({ ...prev, cursor: "crosshair" }));
    // }

    // if (
    //   type === EventType.SELECT ||
    //   type === EventType.ADD_ELEMENT
    // ) {
    //   setContentStyle((prev) => ({ ...prev, cursor: "default" }));
    // }

    // if (type === EventType.GRAB) {
    //   setContentStyle((prev) => ({
    //     ...prev,
    //     cursor: `url("/svg/mouse_active.svg"), auto`,
    //   }));
    // }
  });

  useEffect(() => {
    if (isPreview) {
      setTimeout(() => {
        setZoom(1);
        viewerRef.current?.setZoom(1);
        const containerWidth =
          viewerRef.current?.getContainer().clientWidth || 0;
        const scrollLeft =
          (containerWidth - contentRef.current!.clientWidth) / 2;
        viewerRef.current?.scrollTo(-scrollLeft, -240);
      }, 1000);
    }
  }, [isPreview]);

  const handleContextMenu: DropdownProps["onOpenChange"] = () => {
    setOpenContextMenu(target !== null);
  };

  async function showContent(
    clientWidth: number = 0,
    clientHeight: number = 0,
    contentStyle: React.CSSProperties
  ) {
    const temp = {
      ...contentStyle,
      width: `${clientWidth}px`,
      height: `${clientHeight}px`,
    };
    //  设置样式
    setContentStyle(temp);
    //  缓冲个10ms, 确认前面的state已经render
    await wait(10);
    // 居中

    if (clientHeight < document.body.clientHeight) {
      viewerRef.current?.scrollCenter();
    } else {
      const containerWidth = viewerRef.current?.getContainer().clientWidth || 0;
      const scrollLeft = (containerWidth - clientWidth) / 2;
      viewerRef.current?.scrollTo(-scrollLeft, -240);
    }

    // viewerRef.current?.scrollCenter();
    //  展示
    setContentStyle({ ...temp, opacity: 1 });
  }

  async function resizeElement() {
    let interval = setInterval(() => {
      const clientWidth = contentRef.current?.firstElementChild?.clientWidth;
      const clientHeight = contentRef.current?.firstElementChild?.clientHeight;
      const temp = getContentStyle();
      if (clientWidth && clientWidth > 0 && temp.opacity === 0) {
        showContent(clientWidth, clientHeight, temp);
        clearInterval(interval);
      }
    }, 100);
  }

  useAsyncEffect(async () => {
    if (childrenProps) {
      if (!init) setInit(true);
      setChildren(childrenProps);
      await resizeElement();
    }
  }, [childrenProps]);

  // const [isSpace, setIsSpace] = useState(false);

  // useKeyPress("space", (event) => {
  //   // viewerRef.current?.setZoom(1);
  //   // const containerWidth = viewerRef.current?.getContainer().clientWidth || 0;
  //   // const scrollLeft = (containerWidth - contentRef.current!.clientWidth) / 2;
  //   // viewerRef.current?.scrollTo(-scrollLeft, -240);
  //   setIsSpace(true)
  //   event.preventDefault();
  // });

  // function resize() {
  //   const containerWidth = viewerRef.current?.getContainerWidth() || 0;
  //   if (containerWidth > 0) {
  //     if (containerWidth - 100 < deviceList[device].width) {
  //       const zoom = (containerWidth - 100) / deviceList[device].width;
  //       viewerRef.current?.setZoom(zoom);
  //       setZoom(zoom);
  //     } else {
  //       viewerRef.current?.setZoom(1);
  //       setZoom(1);
  //     }
  //     viewerRef.current?.scrollCenter();
  //   }
  // }

  // function handleChangeDevice(event: React.ChangeEvent<{}>, newValue: number) {
  //   setDevice(newValue);
  //   resize();
  //   setTimeout(() => {
  //     viewerRef.current?.scrollCenter();
  //   }, 0);
  // }

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

  const footerStyle = useSpring({
    from: { height: 0 },
    to: {
      height: isPreview ? 0 : 30,
    },
    delay: isPreview ? 50 : 500,
  });

  const leftStyle = useSpring({
    from: { width: 0, left: -30 },
    to: {
      left: isPreview ? -30 : 0,
      width: isPreview ? 0 : 30,
    },
    delay: isPreview ? 50 : 500,
  });

  const topStyle = useSpring({
    from: { height: 0, top: -30 },
    to: {
      height: isPreview ? 0 : 30,
      top: isPreview ? -30 : 0,
    },
    delay: isPreview ? 30 : 300,
  });

  const scrollOptions = {
    container: () => viewerRef.current!.getContainer(),
    threshold: 20,
    getScrollPosition: () => {
      return [
        viewerRef.current!.getScrollLeft({ absolute: true }),
        viewerRef.current!.getScrollTop({ absolute: true }),
      ];
    },
  };

  return (
    <>
      {/* <div
        className={
          "relative w-full h-full overscroll-none preserve-3d bd-0 overflow-hidden"
        }
        style={{ cursor: isKeyDown ? "grab" : "auto" }}
      > */}

      <animated.div
        style={topStyle}
        className={"absolute w-30px h-30px bg-#444 box-border z-2"}
      ></animated.div>

      <animated.div
        style={topStyle}
        className={"absolute top-0 left-0px w-full h-30px z-1"}
      >
        <Guides
          ref={horizontalGuidesRef}
          type="horizontal"
          displayDragPos={true}
          displayGuidePos={true}
          zoom={zoom}
          useResizeObserver={true}
        />
      </animated.div>

      <animated.div
        style={leftStyle}
        className={"absolute left-0px top-0px w-30px h-[calc(100vh-30px)] z-1"}
      >
        <Guides
          ref={verticalGuidesRef}
          type="vertical"
          displayDragPos={true}
          zoom={zoom}
          displayGuidePos={true}
          useResizeObserver={true}
        />
      </animated.div>

      <InfiniteViewer
        className={"w-full h-full bg-#333"}
        ref={viewerRef}
        displayHorizontalScroll={true}
        displayVerticalScroll={true}
        maxPinchWheel={10}
        useGesture={false}
        zoom={zoom}
        zoomRange={[0.1, 5]}
        useMouseDrag={isKeyDown}
        onPinch={(e) => {
          if (!isPreview) {
            setZoom(e.zoom);
          }
        }}
        onScroll={(e) => {
          const zoom = viewerRef.current?.getZoom();
          horizontalGuidesRef.current?.scroll(e.scrollLeft, zoom);
          horizontalGuidesRef.current?.scrollGuides(e.scrollTop, zoom);
          verticalGuidesRef.current?.scroll(e.scrollTop, zoom);
          verticalGuidesRef.current?.scrollGuides(e.scrollLeft, zoom);
        }}
      >
        <div
          id={"rem-content"}
          ref={contentRef}
          className={`rem-elements selecto-area`}
          style={contentStyle}
        >
          <Dropdown
            menu={{ items, onClick }}
            trigger={["contextMenu"]}
            open={openContextMenu}
            onOpenChange={handleContextMenu}
          >
            {children}
          </Dropdown>
          {!isPreview && (
            <Movable
              scrollOptions={scrollOptions}
              onScroll={({ direction }: any) => {
                viewerRef.current!.scrollBy(
                  direction[0] * 10,
                  direction[1] * 10
                );
              }}
            />
          )}
        </div>
      </InfiniteViewer>

      {/* <animated.div
          style={footerStyle}
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
        </animated.div> */}

      {/* {!init && (
        <div className="absolute left-0 top-0 w-400px bg-white justify-self-stretch self-cente z-1">
          <Guide />
        </div>
      )} */}
    </>
  );
}
