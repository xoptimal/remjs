import NodeContext, { EventType } from "@/context";
import { findKeyByClassName } from "@/helpers/core";
import useKeyDown from "@/hooks/useKeyDown";
import { deepFlat } from "@daybrush/utils";
import { GroupManager, TargetList } from "@moveable/helper";
import { useEventListener } from "ahooks";
import React, { useContext, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import ReactMovable, {
  MoveableManagerInterface,
  Renderer,
  makeAble,
} from "react-moveable";
import Selector from "react-selecto";

const DimensionViewable = {
  name: "dimensionViewable",
  props: [],
  events: [],
  render(moveable: MoveableManagerInterface<any, any>, React: Renderer) {
    const rect = moveable.getRect();

    if (rect.width > 10 || rect.height > 10) {
      return (
        <div
          key={"dimension-viewer"}
          className={"moveable-dimension"}
          style={{
            position: "absolute",
            left: `${rect.width / 2}px`,
            top: `${rect.height + 20}px`,
            background: "#4af",
            borderRadius: "2px",
            padding: "2px 4px",
            color: "white",
            fontSize: "13px",
            whiteSpace: "nowrap",
            fontWeight: "bold",
            willChange: "transform",
            transform: `translate(-50%, 0px)`,
          }}
        >
          {Math.round(rect.offsetWidth)} x {Math.round(rect.offsetHeight)}
        </div>
      );
    }
  },
} as const;

const snapContainer = ".rem-elements";
const rootContainer = "#rem-content";
const verticalGuidelines = [50, 150, 250, 450, 550];
const horizontalGuidelines = [0, 100, 200, 400, 500];

const snapDirections = {
  top: true,
  left: true,
  bottom: true,
  right: true,
  center: true,
  middle: true,
};

export default function Movable() {
  const { emitter, target, setTarget } = useContext(NodeContext);
  const { onChange } = useContext(NodeContext);

  const [targets, setTargets] = useState<HTMLElement[]>([]);
  const [elementGuidelines, setElementGuideLiens] = useState<any[]>([]);

  const paintingRef = useRef<any>(null);
  const selectorRef = useRef<Selector>(null);
  const movableRef = useRef<ReactMovable>(null);
  const groupManagerRef = useRef<GroupManager>();
  const rootContainerRef = useRef<HTMLElement | null>(null);

  const { isKeyDown, key } = useKeyDown(["meta", "shift", "space"]);

  useEffect(() => {
    rootContainerRef.current = document.querySelector(rootContainer);
  }, []);

  emitter.useSubscription(
    ({ type, nodeIds, added = false, elements, data }) => {
      if (type === EventType.PAINTING) {
        paintingRef.current = data;
      }

      //  重制状态
      if (type === EventType.DEFAULT) {
        paintingRef.current = null;
      }

      if (type === EventType.SEL_ELEMENT) {
        if (added) init();

        const elements = selectorRef.current!.getSelectableElements();
        const filteredElements = elements.filter((item) => {
          const key = findKeyByClassName(item.className);
          return nodeIds?.some((id) => key.includes(id));
        });

        setSelectedTargets(filteredElements, { added });
      }

      if (type === EventType.SYNC_ELEMENTS) {
        emitter.emit({ type: EventType.SAVE, elements });
      }
    }
  );

  function handleResize(e: any) {
    e.target.style.width = `${e.width}px`;
    e.target.style.height = `${e.height}px`;
    e.target.style.transform = e.drag.transform;
  }

  const onResizeEnd = (resizeTarget: any) => {
    if (paintingRef.current) return;
    const style = {
      width: resizeTarget.style.width,
      height: resizeTarget.style.height,
    };
    onChange({ style });
    movableRef.current!.waitToChangeTarget();
  };

  useEventListener(
    "mousedown",
    (e) => {
      if (paintingRef.current) {
        const offsetX =
          e.clientX - rootContainerRef.current!.getBoundingClientRect().left;
        const offsetY =
          e.clientY - rootContainerRef.current!.getBoundingClientRect().top;

        const position = { x: offsetX, y: offsetY };

        emitter.emit({
          type: EventType.ADD_ELEMENT,
          data: { position, ...paintingRef.current },
        });

        if (paintingRef.current.isDraw) {
          //setMousedown({ down: true, offsetX: e.clientX, offsetY: e.clientY });
          paintingRef.current.offsetX = e.clientX;
          paintingRef.current.offsetY = e.clientY;
        }

        e.preventDefault();
      }
    },
    { target: rootContainerRef.current }
  );

  useEventListener(
    "mousemove",
    (event) => {
      if (
        (event.buttons === 1 || event.which === 1) &&
        paintingRef.current?.isDraw &&
        target
      ) {
        const deltaX = event.clientX - paintingRef.current.offsetX;
        const deltaY = event.clientY - paintingRef.current.offsetY;

        movableRef.current!.request(
          "resizable",
          { offsetWidth: deltaX, offsetHeight: deltaY },
          true
        );
      }
    },
    { target: rootContainerRef.current }
  );

  useEventListener(
    "mouseup",
    () => {
      const painting = paintingRef.current;

      if (painting) {
        if (painting.isDraw && target) {
          const style = movableRef.current!.getDragElement()!.style;
          const mutuallyExclusives = target!.className.filter(
            (find) => find.indexOf("w-") > -1 || find.indexOf("h-") > -1
          );

          if (style.height.length === 0 && style.width.length === 0) {
            const className = [`w-[100px]`, `h-[100px]`];
            onChange({ className, mutuallyExclusives: ["w-1px", "h-1px"] });

            if (target.position) {
              movableRef.current!.request("draggable", {
                isInstant: true,
                x: target.position.x - 50,
                y: target.position.y - 50,
              });
            }
          } else {
            // mouse move
            const className = [`w-[${style.width}]`, `h-[${style.height}]`];
            onChange({ className, mutuallyExclusives });
          }
        }
        //  回到默认状态
        emitter.emit({ type: EventType.DEFAULT });
      }
    },
    { target: rootContainerRef.current }
  );

  function init() {
    //const arr: any[] = [].slice.call(document.querySelectorAll(".rem-item"));
    //setElementGuideLiens(arr.map(item => ({element: item, refresh: true})))

    const elements = selectorRef.current!.getSelectableElements();

    setElementGuideLiens(elements);

    const groups = elements.filter(
      (item) => item.className.indexOf("rem_group") > -1
    );

    const result = groups.reduce<any[]>((acc, obj) => {
      const findClassName = obj.classList.value
        .split(" ")
        .find((value) => value.indexOf("rem_group") > -1);
      if (findClassName) {
        const index = acc.findIndex((group) =>
          group[0]?.classList.value.split(" ").includes(findClassName)
        );
        if (index > -1) {
          acc[index].push(obj);
        } else {
          acc.push([obj]);
        }
      }
      return acc;
    }, []);

    groupManagerRef.current = new GroupManager(result, elements);
  }

  useEffect(() => {
    init();
  }, []);

  const setSelectedTargets = React.useCallback(
    (nextTargets: any, option?: { added: boolean }) => {
      if (!nextTargets || nextTargets.length === 0) {
        selectorRef.current!.setSelectedTargets([]);
        setTargets(nextTargets);
        setTarget();
        emitter.emit({ type: EventType.SEL_ELELEMT_TO_TREE, nodeIds: [] });
        return;
      }

      elementHasMouseEnter.current = true;
      selectorRef.current!.setSelectedTargets(deepFlat(nextTargets));
      setTargets(nextTargets);
      setTarget(findKeyByClassName(nextTargets[0].className));

      if (option?.added) {
        movableRef.current!.waitToChangeTarget().then(() => {
          movableRef.current!.request("draggable", {
            isInstant: true,
            deltaX: 0,
            deltaY: 0,
          });
        });
      }
    },
    []
  );

  const elementHasMouseEnter = useRef(false);

  const MouseEnterLeaveAble = makeAble("enterLeave", {
    mouseEnter(moveable: MoveableManagerInterface) {
      elementHasMouseEnter.current = true;
    },
    mouseLeave(moveable: MoveableManagerInterface) {
      elementHasMouseEnter.current = false;
    },
  });

  return (
    <>
      <ReactMovable
        origin={false} //  是否显示中心点
        flushSync={flushSync} //  react> 18 开启
        ref={movableRef} //  实例
        target={targets} //  操作对象(moveable的对象)
        throttleDrag={1} // 拖拽阈值 达到这个值才执行拖拽
        edgeDraggable={["n", "s"]} // 是否通过拖动边缘线移动
        startDragRotate={0}
        throttleDragRotate={0}
        resizable={{
          edge: ["e", "w"],
          renderDirections: ["nw", "ne", "sw", "se"],
        }} //  是否可以缩放
        useResizeObserver
        useMutationObserver
        useAccuratePosition
        ables={[MouseEnterLeaveAble, DimensionViewable]}
        props={{
          dimensionViewable: true,
          enterLeave: true,
        }}
        onClickGroup={(e) => {
          if (!e.moveableTarget) {
            setSelectedTargets([]);
            return;
          }
          if (e.isDouble) {
            const childs = groupManagerRef!.current!.selectSubChilds(
              targets,
              e.moveableTarget
            );
            setSelectedTargets(childs.targets());
            return;
          }
          if (e.isTrusted) {
            selectorRef.current!.clickTarget(e.inputEvent, e.moveableTarget);
          }
        }}
        preventClickDefault={true}
        draggable // 是否可以拖拽
        onDrag={(e) => {
          //  操作单个target拖拽回调
          //  当前Target是组, 则不允许移动,
          if (e.target.className.indexOf("rem_group") > -1) {
            e.stopDrag();
          } else {
            // e.target.style.position = `absolute`;
            // e.target.style.left = `0`;
            // e.target.style.top = `0`;
            e.target.style.transform = `translate(${e.translate[0]}px, ${e.translate[1]}px)`;
          }
        }}
        onDragEnd={(e) => {
          if (e.isDrag) {
            const translate = e.lastEvent.translate;
            const style = {
              transform: `translate(${translate[0]}px, ${translate[1]}px)`,
            };
            onChange({ style });
          }
        }}
        onResizeGroupEnd={({ events }) => {
          onResizeEnd(events[0].target);
        }}
        //onResizeStart={handleResizeStart} // 缩放开始时
        displayAroundControls={true}
        edge //resize,scale是否支持通过边框操作
        controlPadding={0}
        onResize={handleResize} // 缩放中
        onResizeEnd={({ target: resizeTarget }) => {
          onResizeEnd(resizeTarget);
        }}
        keepRatio={false} // 是否保持纵横比
        //throttleResize={1} // 缩放阈值
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]} // 变化的点
        bounds={{ left: 0, top: 0, right: 0, bottom: 0, position: "css" }} //  边界点
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }} // padding距离
        triggerAblesSimultaneously
        zoom={1}
        // rootContainer={snapContainer}
        verticalGuidelines={verticalGuidelines}
        horizontalGuidelines={horizontalGuidelines}
        elementGuidelines={elementGuidelines} //  开启目标辅助线(target)
        hideChildMoveableDefaultLines={false}
        snappable
        snapContainer={snapContainer}
        snapGap={true} // 开启辅助线
        snapDirections={snapDirections} // 辅助线方向
        elementSnapDirections={snapDirections} // 元素捕捉方向
        // maxSnapElementGuidelineDistance={null}
        // maxSnapElementGapDistance={80}
        snapThreshold={0} // 辅助线阈值 ,即元素与辅助线间距小于x,则自动贴边
        isDisplaySnapDigit // 是否展示与磁吸辅助线的距离
        snapDigit={0} //捕捉距离数字
      />
      <Selector
        preventClickDefault={true}
        ref={selectorRef}
        // @ts-ignore
        rootContainer={snapContainer}
        selectableTargets={[".rem-item"]}
        selectByClick={!isKeyDown}
        selectFromInside={false}
        toggleContinueSelect={["shift"]}
        hitRate={0}
        ratio={0}
        // stopPropagation={true}
        // checkInput={false}
        // dragFocusedInput={false}
        // preventDragFromInside={false}
        onDragStart={(e) => {
          if ((isKeyDown && key === "space") || paintingRef.current) e.stop();

          if (!elementHasMouseEnter.current) setSelectedTargets([]);

          if (typeof movableRef !== "function" && movableRef !== null) {
            const moveable = movableRef.current!;
            const target = e.inputEvent.target;

            const flatted = targets.flat(3) as Array<HTMLElement | SVGElement>;

            if (
              moveable.isMoveableElement(target) ||
              flatted.some((t) => t === target || t.contains(target))
            ) {
              e.stop();
            }
          }
        }}
        onSelectEnd={(e) => {
          const { isDragStart, isClick, added, removed, inputEvent } = e;

          if (typeof movableRef !== "function" && movableRef !== null) {
            const moveable = movableRef.current!;

            if (isDragStart) {
              inputEvent.preventDefault();
              moveable.waitToChangeTarget().then(() => {
                moveable.dragStart(inputEvent);
              });
            }
            const groupManager = groupManagerRef.current!;
            let nextChilds: TargetList;

            if (isDragStart || isClick) {
              if (isKeyDown && key === "meta") {
                nextChilds = groupManager.selectSingleChilds(
                  targets,
                  added,
                  removed
                );
              } else {
                nextChilds = groupManager.selectCompletedChilds(
                  targets,
                  added,
                  removed,
                  isKeyDown && key === "shift"
                );
              }
            } else {
              nextChilds = groupManager.selectSameDepthChilds(
                targets,
                added,
                removed
              );
            }

            e.currentTarget.setSelectedTargets(nextChilds.flatten());
            setSelectedTargets(nextChilds.targets());
          }
        }}
      />
    </>
  );
}
