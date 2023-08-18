import ReactMovable, { MoveableTargetGroupsType } from "react-moveable";
import { flushSync } from "react-dom";
import React, { useContext, useEffect, useState } from "react";
import Selector from "react-selecto";
import { GroupManager, TargetList } from "@moveable/helper";
import { deepFlat } from "@daybrush/utils";
import NodeContext from "@/context";
import { getStyleValue } from "@/utils/transform";
import useKeyDown from "@/hooks/useKeyDown";

let dragged = false;

export default function Movable(){

  const movableRef = React.useRef<ReactMovable>(null);

  const { emitter, target, setTarget } = useContext(NodeContext);

  emitter.useSubscription(
    ({ type, nodeIds }: { type: string; nodeIds: string[] }) => {
      if (type === "select-node") {
        const elements = selectoRef.current!.getSelectableElements();
        const filter = elements.filter((item: any) => {
          const reactFiber = Object.keys(item).find(
            (key) => key.indexOf("__reactFiber") > -1
          );
          return (
            reactFiber &&
            nodeIds.findIndex(
              (find) => item[reactFiber].key.indexOf(find) > -1
            ) > -1
          );
        });
        setTargets(filter);
      }
    }
  );

  const [frame, setFrame] = useState({ translate: [0, 0], rotate: 0 });

  let [snapContainer, setSnapContainer] = useState<any>(null);

  const { isKeyDown, key } = useKeyDown(["meta", "shift", "space"]);

  const [targets, setTargets] = useState<MoveableTargetGroupsType>([]);

  const { onChange } = useContext(NodeContext);

  function handleResizeStart(e: any) {
    e.setOrigin(["%", "%"]);
    e.dragStart.set(frame.translate);
  }

  function handleResize(e: any) {
    const beforeTranslate = e.drag.beforeTranslate;
    frame.translate = beforeTranslate;
    e.target.style.width = `${e.width}px`;
    e.target.style.height = `${e.height}px`;
    e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
  }

  const selectoRef = React.useRef<Selector>(null);

  const groupManagerRef = React.useRef<GroupManager>();

  const [elementGuidelines, setElementGuideliens] = useState<HTMLElement[]>([]);

  useEffect(() => {
    const arr: any[] = [].slice.call(document.querySelectorAll(".rem-item"));

    const container = document.querySelector(".rem-elements");

    arr.push(container);
    setSnapContainer(container);
    setElementGuideliens(arr);

    const elements = selectoRef.current!.getSelectableElements();

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
  }, []);

  const setSelectedTargets = React.useCallback((nextTargetes: any) => {
    selectoRef.current!.setSelectedTargets(deepFlat(nextTargetes));
    setTargets(nextTargetes);
    const arr = new Set<string>();
    const treeNodeIds = new Set<string>();

    const processChild = (child: any) => {
      const reactFiber = Object.keys(child).find(
        (key) => key.indexOf("__reactFiber") > -1
      );
      if (reactFiber && child[reactFiber].key) {
        const key = child[reactFiber].key;
        arr.add(key.substring(0, 13));
        treeNodeIds.add(
          key.indexOf("rem_group") > -1
            ? key.substring(0, key.lastIndexOf("-"))
            : key
        );
      }
    };

    nextTargetes.forEach((item: any) => {
      if (Array.isArray(item)) {
        item.forEach(processChild);
      } else {
        processChild(item);
      }
    });

    setTarget([...arr][0]);
    emitter.emit({ type: "select-tree", nodeIds: [...treeNodeIds] });
  }, []);

  const onResizeEnd = (resizeTarget: any) => {
    const className = [
      `w-[${resizeTarget.style.width}]`,
      `h-[${resizeTarget.style.height}]`,
    ];
    onChange({
      className,
      mutuallyExclusives: target?.className.filter(
        (find) => find.indexOf("w-") > -1 || find.indexOf("h-") > -1
      ),
    });
  };

  return (
    <>
      <ReactMovable
        origin={false} //  是否显示中心点
        flushSync={flushSync} //  react> 18 开启
        ref={movableRef} //  实例
        target={targets} //  操作对象(moveable的对象)
        draggable // 是否可以拖拽
        throttleDrag={1} // 拖拽阈值 达到这个值才执行拖拽
        edgeDraggable={["n", "s"]} // 是否通过拖动边缘线移动
        startDragRotate={0}
        throttleDragRotate={0}
        resizable //  是否可以缩放
        useResizeObserver
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
            selectoRef.current!.clickTarget(e.inputEvent, e.moveableTarget);
          }
        }}
        onDrag={(e) => {
          //  操作单个target拖拽回调
          if (e.target.className.indexOf("rem_group") > -1) {
            e.stopDrag();
          } else {
            dragged = true;
            e.target.style.transform = e.transform;
          }
        }}
        onDragEnd={(e) => {
          if (dragged) {
            const arr = getStyleValue(e.target.style.transform);
            const className = [];
            if (arr[0] > 0 || arr[1] > 0) {
              className.push(
                `translate-x-[${arr[0]}px]`,
                `translate-y-[${arr[1]}px]`
              );
            }
            onChange({
              className,
              mutuallyExclusives: target?.className.filter(
                (find) =>
                  find.indexOf("translate-x") > -1 ||
                  find.indexOf("translate-y") > -1
              ),
            });
            dragged = false;
          }
        }}
        // onDragGroup={(e) => {
        //   //  操作组合(target)拖拽回调
        //   e.events.forEach((ev) => {
        //     ev.target.style.transform = ev.transform;
        //   });
        // }}
        onResizeGroupStart={({ setMin, setMax }) => {
          setMin([0, 0]);
          setMax([0, 0]);
        }}
        onResizeGroup={({ events }) => {
          //  操作组合缩放回调
          events.forEach((ev) => {
            ev.target.style.width = `${ev.width}px`;
            ev.target.style.height = `${ev.height}px`;
            ev.target.style.transform = ev.drag.transform;
          });
        }}
        onResizeGroupEnd={({ events }) => {
          onResizeEnd(events[0].target);
        }}
        onResizeStart={handleResizeStart} // 缩放开始时
        onResize={handleResize} // 缩放中
        onResizeEnd={({ target: resizeTarget }) => {
          onResizeEnd(resizeTarget);
        }}
        keepRatio={false} // 是否保持纵横比
        throttleResize={1} // 缩放阈值
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]} // 变化的点
        bounds={{ left: 0, top: 0, right: 0, bottom: 0, position: "css" }} //  边界点
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }} // padding距离
        edge //resize,scale是否支持通过边框操作
        triggerAblesSimultaneously
        zoom={0.5}
        snappable
        //snapContainer={snapContainer}
        //rootContainer={snapContainer}
        elementGuidelines={elementGuidelines} //  开启目标辅助线(target)
        hideChildMoveableDefaultLines={false}
        snapGap // 开启辅助线
        snapDirections={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          center: true,
          middle: true,
        }} // 辅助线方向
        elementSnapDirections={{
          top: true,
          right: true,
          bottom: true,
          left: true,
          center: true,
          middle: true,
        }} // 元素捕捉方向
        snapThreshold={5} // 辅助线阈值 ,即元素与辅助线间距小于x,则自动贴边
        isDisplaySnapDigit // 是否展示与磁吸辅助线的距离
        snapDigit={0} //捕捉距离数字
        preventClickDefault //  传递下一层
      />
      <Selector
        ref={selectoRef}
        rootContainer={snapContainer}
        selectableTargets={[".rem-item"]}
        hitRate={0}
        selectByClick={!isKeyDown}
        selectFromInside={false}
        toggleContinueSelect={["shift"]}
        ratio={0}
        onDragStart={(e) => {
          if (isKeyDown && key === "space") e.stop();
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
};

