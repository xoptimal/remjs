import Moveable, {MoveableTargetGroupsType} from "react-moveable";
import {flushSync} from "react-dom";
import React, {forwardRef, useContext, useEffect, useState} from "react";
import Selecto from "react-selecto";
import {GroupManager, TargetList} from "@moveable/helper";
import {deepFlat} from "@daybrush/utils";
import {useKeycon} from "react-keycon";
import NodeContext from "@/core/context";

const RemMoveable = forwardRef<any, any>((props, moveableRef) => {

    const {emitter, setTarget} = useContext(NodeContext)

    emitter.useSubscription(({type, nodeIds}: { type: string, nodeIds: string[] }) => {
        if (type === 'select-node') {
            const elements = selectoRef.current!.getSelectableElements();
            const filter = elements.filter((item: any) => {
                const reactFiber = Object.keys(item).find(key => key.indexOf('__reactProps') > -1)
                return reactFiber && nodeIds.findIndex(find => find === item[reactFiber].id) > -1
            })
            setTargets(filter)
        }
    })

    const [frame, setFrame] = useState({translate: [0, 0], rotate: 0});

    let [snapContainer, setSnapContainer] = useState<any>(null)

    // @ts-ignore
    const {isKeydown: isCommand} = useKeycon({keys: "meta"});
    // @ts-ignore
    const {isKeydown: isShift} = useKeycon({keys: "shift"});
    // @ts-ignore
    const {isKeydown: isSpace} = useKeycon({keys: "space"});

    const [targets, setTargets] = useState<MoveableTargetGroupsType>([]);

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

    const selectoRef = React.useRef<Selecto>(null);

    const groupManagerRef = React.useRef<GroupManager>();

    const [elementGuidelines, setElementGuideliens] = useState<HTMLElement[]>([]);

    useEffect(() => {
        const arr: any[] = [].slice.call(document.querySelectorAll(".rem-item"))
        const container = document.querySelector(".rem-elements")

        arr.push(container)
        setSnapContainer(container)
        setElementGuideliens(arr);

        const elements = selectoRef.current!.getSelectableElements();

        const groups = elements.filter(item => item.className.indexOf("rem-group rem-item") > -1)
        const targetGroups = [];

        let temp = [...groups];
        for (let i = 0; i < groups.length - 1; i++) {
            if (temp.length > 0) {
                const item = groups[i]
                const filter = temp.filter(groupItem => groupItem.classList[0] === item.classList[0])
                if (filter.length > 0) {
                    targetGroups.push(filter)
                    temp = temp.filter(groupItem => item.classList[0] !== groupItem.classList[0])
                }
            } else {
                break
            }
        }
        groupManagerRef.current = new GroupManager(targetGroups, elements)
    }, []);

    const setSelectedTargets = React.useCallback((nextTargetes: MoveableTargetGroupsType) => {
        selectoRef.current!.setSelectedTargets(deepFlat(nextTargetes));
        setTargets(nextTargetes);
        const arr = new Set<string>()
        nextTargetes.map((item: any) => {
            if (Array.isArray(item)) {
                return item.map((child: any) => {
                    const reactFiber = Object.keys(child).find(key => key.indexOf('__reactFiber') > -1)
                    if (reactFiber && child[reactFiber].key) {
                        arr.add(child[reactFiber].key.split("-")[0])
                    }
                })
            } else {
                const reactFiber = Object.keys(item).find(key => key.indexOf('__reactFiber') > -1)
                if (reactFiber && item[reactFiber].key) {
                    arr.add(item[reactFiber].key)
                }
            }
        })

        const nodeIds = [...arr].map(item => item.split("-")[0])
        setTarget(nodeIds[0])
        emitter.emit({type: 'select-tree', nodeIds})

    }, []);

    return (
        <>
            <Moveable
                origin={false}          //  是否显示中心点
                flushSync={flushSync}   //  react> 18 开启
                ref={moveableRef}       //  实例
                target={targets}        //  操作对象(moveable的对象)
                draggable               // 是否可以拖拽
                throttleDrag={0} // 拖拽阈值 达到这个值才执行拖拽
                onClickGroup={e => {     //  点击group
                    if (!e.moveableTarget) {
                        setSelectedTargets([]);
                        return;
                    }
                    if (e.isDouble) {
                        const childs = groupManagerRef!.current!.selectSubChilds(targets, e.moveableTarget);
                        setSelectedTargets(childs.targets());
                        return;
                    }
                    if (e.isTrusted) {
                        selectoRef.current!.clickTarget(e.inputEvent, e.moveableTarget);
                    }
                }}
                onDrag={e => {  //  操作单个target拖拽回调
                    if (e.target.className.indexOf("rem-group") > -1) {
                        e.stopDrag();
                    } else {
                        e.target.style.transform = e.transform;
                    }
                }}
                onDragGroup={e => { //  操作组合(target)拖拽回调
                    e.events.forEach(ev => {
                        ev.target.style.transform = ev.transform;
                    })
                }}

                resizable   //  是否可以缩放
                onResizeGroupStart={({setMin, setMax}) => {
                    setMin([0, 0]);
                    setMax([0, 0]);
                }}

                onResizeGroup={({events}) => {  //  操作组合缩放回调
                    events.forEach(ev => {
                        ev.target.style.width = `${ev.width}px`;
                        ev.target.style.height = `${ev.height}px`;
                        ev.target.style.transform = ev.drag.transform;
                    });
                }}
                onResizeStart={handleResizeStart} // 缩放开始时
                onResize={handleResize} // 缩放中

                keepRatio={false}   // 是否保持纵横比
                throttleResize={1}  // 缩放阈值

                renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]} // 变化的点
                bounds={{"left": 0, "top": 0, "right": 0, "bottom": 0, "position": "css"}}  //  边界点
                padding={{"left": 0, "top": 0, "right": 0, "bottom": 0}} // padding距离

                edge //resize,scale是否支持通过边框操作
                edgeDraggable={["n", "s"]}  // 是否通过拖动边缘线移动
                triggerAblesSimultaneously

                zoom={0.5}

                snappable
                snapContainer={snapContainer}
                elementGuidelines={elementGuidelines}   //  开启目标辅助线(target)
                hideChildMoveableDefaultLines={false}
                snapGap // 开启辅助线
                snapDirections={{
                    "top": true,
                    "right": true,
                    "bottom": true,
                    "left": true,
                    "center": true,
                    "middle": true
                }} // 辅助线方向
                elementSnapDirections={{
                    "top": true,
                    "right": true,
                    "bottom": true,
                    "left": true,
                    "center": true,
                    "middle": true
                }} // 元素捕捉方向
                snapThreshold={5} // 辅助线阈值 ,即元素与辅助线间距小于x,则自动贴边
                isDisplaySnapDigit // 是否展示与磁吸辅助线的距离
                snapDigit={0} //捕捉距离数字
                preventClickDefault //  传递下一层
            />
            <Selecto
                ref={selectoRef}
                rootContainer={snapContainer}
                selectableTargets={[".rem-item"]}
                hitRate={0}
                selectByClick={!isSpace}
                selectFromInside={false}
                toggleContinueSelect={["shift"]}
                ratio={0}
                onDragStart={e => {
                    if (isSpace) e.stop();
                    if (typeof moveableRef !== "function" && moveableRef !== null) {
                        const moveable = moveableRef.current!;
                        const target = e.inputEvent.target;
                        const flatted = targets.flat(3) as Array<HTMLElement | SVGElement>;
                        if (moveable.isMoveableElement(target) || flatted.some(t => t === target || t.contains(target))) {
                            e.stop();
                        }
                    }
                }}
                onSelectEnd={e => {
                    const {isDragStart, isClick, added, removed, inputEvent} = e;
                    if (typeof moveableRef !== "function" && moveableRef !== null) {
                        const moveable = moveableRef.current!;

                        if (isDragStart) {
                            inputEvent.preventDefault();
                            moveable.waitToChangeTarget().then(() => {
                                moveable.dragStart(inputEvent);
                            });
                        }
                        const groupManager = groupManagerRef.current!;
                        let nextChilds: TargetList;

                        if (isDragStart || isClick) {
                            if (isCommand) {
                                nextChilds = groupManager.selectSingleChilds(targets, added, removed);
                            } else {
                                nextChilds = groupManager.selectCompletedChilds(targets, added, removed, isShift);
                            }
                        } else {
                            nextChilds = groupManager.selectSameDepthChilds(targets, added, removed);
                        }
                        e.currentTarget.setSelectedTargets(nextChilds.flatten());
                        setSelectedTargets(nextChilds.targets());
                    }
                }}
            />
        </>
    )
})


export default RemMoveable