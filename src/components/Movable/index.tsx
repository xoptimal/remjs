import ReactMovable, {makeAble, MoveableManagerInterface, MoveableTargetGroupsType, Renderer} from "react-moveable";
import {flushSync} from "react-dom";
import React, {useContext, useEffect, useRef, useState} from "react";
import Selector from "react-selecto";
import {GroupManager, TargetList} from "@moveable/helper";
import {deepFlat} from "@daybrush/utils";
import NodeContext, {EventType} from "@/context";
import useKeyDown from "@/hooks/useKeyDown";
import {useEventListener, useKeyPress} from "ahooks";
import {MouseDown} from "@/components/Content";
import {formatTailwindValue} from "@/hooks/useDebouncedValueHook";

const DimensionViewable = {
    name: "dimensionViewable",
    props: [],
    events: [],
    render(moveable: MoveableManagerInterface<any, any>, React: Renderer) {
        const rect = moveable.getRect();

        if (rect.width > 10 || rect.height > 10) {
            return <div key={"dimension-viewer"} className={"moveable-dimension"} style={{
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
            }}>
                {Math.round(rect.offsetWidth)} x {Math.round(rect.offsetHeight)}
            </div>;
        }
    }
} as const;

type MovableProps = {
    mousedown: MouseDown
    contentStyle: React.CSSProperties
}

const snapContainer = '.rem-elements'


export default function Movable(props: MovableProps) {

    const {contentStyle, mousedown} = props;

    const movableRef = React.useRef<ReactMovable>(null);

    const {emitter, target, setTarget} = useContext(NodeContext);

    emitter.useSubscription(({type, nodeIds, added, elements}) => {
            if (type === EventType.SELECT_NODE) {
                if (added) {
                    init()
                }
                const elements = selectoRef.current!.getSelectableElements();
                const filteredElements = elements.filter((item: any) => {
                    const reactFiber = Object.keys(item).find((key) => key.indexOf("__reactFiber") > -1);
                    return reactFiber && nodeIds?.some(id => item[reactFiber].key.includes(id));
                });
                //setTargets(filteredElements);
                //setTarget(nodeIds?.[0] as string)
                setSelectedTargets(filteredElements)

            } else if (type === EventType.SYNC_ELEMENTS) {

                const SelectableElements = selectoRef.current!.getSelectableElements();
                const tElement = {...elements};

                SelectableElements.forEach((dom: any) => {
                    if (dom.style.transform) {
                        const transform = dom.style.transform.match(/translate\((.*?)\)/);
                        if (transform) {
                            const [x, y] = transform[1].split(", ");
                            const reactFiberKey = Object.keys(dom).find(key => key.indexOf("reactFiber") > -1)
                            if (reactFiberKey && dom[reactFiberKey]) {
                                let {key} = dom[reactFiberKey]
                                if (key.lastIndexOf('/') > -1) key = key.substring(0, key.lastIndexOf('/'));
                                const className = tElement[key].className as string[]
                                const filter = className.filter(find => !find.includes('translate-x') && !find.includes('translate-y'));
                                filter.push(`translate-x-[${x}]`, `translate-y-[${y}]`);
                                tElement[key].className = filter
                            }
                        }
                    }
                })
                emitter.emit({type: EventType.SAVE, elements: tElement})
            }
        }
    );

    const [frame, setFrame] = useState({translate: [0, 0], rotate: 0});

    // let [snapContainer, setSnapContainer] = useState<any>(null);

    const {isKeyDown, key} = useKeyDown(["meta", "shift", "space"]);

    const [targets, setTargets] = useState<MoveableTargetGroupsType>([]);

    const {onChange} = useContext(NodeContext);

    // function handleResizeStart(e: any) {
    //     if (elementHasMouseEnter) {
    //         e.setOrigin(["%", "%"]);
    //         e.dragStart.set(frame.translate);
    //     }
    // }

    function handleResize(e: any) {
        e.target.style.width = `${e.width}px`;
        e.target.style.height = `${e.height}px`;
        // e.target.style.transform = e.drag.transform;
    }

    useEventListener('mousemove', (event) => {
        if ((event.buttons === 1 || event.which === 1) && target) {
            const deltaX = event.clientX - mousedown.offsetX;
            const deltaY = event.clientY - mousedown.offsetY;
            console.log('2')
            movableRef.current!.request("resizable", {offsetWidth: deltaX, offsetHeight: deltaY}, true);
        }
    }, {target: document.querySelector('#container')})

    useEventListener(
        'mouseup',
        (event) => {
            if (contentStyle.cursor === 'crosshair' && target) {
                console.log('4')
                emitter.emit({type: EventType.ACTION_MOVE})

                const style = movableRef.current!.getDragElement()!.style
                let translateX, translateY, width, height;
                const mutuallyExclusives = target!.className.filter(find => find.indexOf('w-') > -1 || find.indexOf('h-') > -1)

                if (style.height.length === 0 && style.width.length === 0) {    //  mouse not move

                    const firstTranslateX = target?.className.find(find => find.indexOf('translate-x') > -1)!
                    const firstTranslateY = target?.className.find(find => find.indexOf('translate-y') > -1)!

                    console.log('firstTranslateX', firstTranslateX)
                    console.log('firstTranslateY', firstTranslateY)

                    translateX = parseFloat(formatTailwindValue(firstTranslateX)) - 50
                    translateY = parseFloat(formatTailwindValue(firstTranslateY)) - 50

                    width = 100;
                    height = 100;

                    mutuallyExclusives.push(firstTranslateX, firstTranslateY)

                    const className = [`w-[${width}px]`, `h-[${height}px]`, `translate-x-[${translateX}px]`, `translate-y-[${translateY}px]`]

                    onChange({className, mutuallyExclusives})

                } else {    // mouse move
                    width = style.width;
                    height = style.height;
                    const className = [`w-[${width}]`, `h-[${height}]`]
                    onChange({className, mutuallyExclusives})
                }
            }
        },
        {target: document.querySelector('#container')},
    );


    const selectoRef = React.useRef<Selector>(null);

    const groupManagerRef = React.useRef<GroupManager>();

    const [elementGuidelines, setElementGuideLiens] = useState<any[]>([]);

    function init() {
        const arr: any[] = [].slice.call(document.querySelectorAll(".rem-item"));

        //const container = document.querySelector(".rem-elements");
        //arr.push(container);
        //setSnapContainer(container);

        setElementGuideLiens(arr)
        //setElementGuideLiens(arr.map(item => ({element: item, refresh: true})))

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
    }

    useEffect(() => {
        init()
    }, []);

    const setSelectedTargets = React.useCallback((nextTargets: any) => {

        if (!nextTargets || nextTargets.length === 0) {
            selectoRef.current!.setSelectedTargets([]);
            setTargets(nextTargets);
            setTarget();
            emitter.emit({type: EventType.SELECT_TREE, nodeIds: []});
            return;
        }

        elementHasMouseEnter.current = true;

        selectoRef.current!.setSelectedTargets(deepFlat(nextTargets));
        setTargets(nextTargets);
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

        nextTargets.forEach((item: any) => {
            if (Array.isArray(item)) {
                item.forEach(processChild);
            } else {
                processChild(item);
            }
        });

        setTarget([...arr][0]);
        emitter.emit({type: EventType.SELECT_TREE, nodeIds: [...treeNodeIds]});


    }, []);

    const onResizeEnd = (resizeTarget: any) => {

        if (contentStyle.cursor === 'crosshair') return

        const className = [
            `w-[${resizeTarget.style.width}]`,
            `h-[${resizeTarget.style.height}]`,
        ];

        onChange({
            className,
            mutuallyExclusives: target?.className.filter(
                (find) => find.indexOf("w-") > -1 || find.indexOf("h-") > -1
            ),
        }, null, () => {
            resizeTarget.style.width = ''
            resizeTarget.style.height = ''
        });

    };

    const elementHasMouseEnter = useRef(false)

    const MouseEnterLeaveAble = makeAble("enterLeave", {
        mouseEnter() {
            elementHasMouseEnter.current = true;
        },
        mouseLeave() {
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
                ables={[
                    MouseEnterLeaveAble,
                    DimensionViewable,
                ]}
                props={{
                    dimensionViewable: true,
                    enterLeave: true,
                }}
                transformOrigin={["left", "top"]}
                preventClickDefault={true} //  传递下一层
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

                draggable // 是否可以拖拽
                onDrag={(e) => {    //  操作单个target拖拽回调
                    //  当前Target是组, 则不允许移动,
                    if (e.target.className.indexOf("rem_group") > -1) {
                        e.stopDrag();
                    } else {
                        // e.target.style.position = `absolute`;
                        // e.target.style.left = `${e.left}px`;
                        // e.target.style.top = `${e.top}px`;
                        e.target.style.transform = e.transform;
                    }
                }}
                onDragEnd={(e) => {
                    if (!e.isDrag) return
                    // const [x, y] = e.inputEvent.translate
                    // getChangeData({x, y})
                    // const leftValue = e.target.style.left;
                    // const topValue = e.target.style.top;
                    // const className = [];
                    // className.push(
                    //     `absolute`,
                    //     `top-[${topValue}]`,
                    //     `left-[${leftValue}]`
                    // );
                    // onChange({
                    //     className,
                    //     mutuallyExclusives: target?.className.filter(
                    //         (find) => find.indexOf("top") > -1 || find.indexOf("left") > -1 || find.indexOf("absolute") > -1),
                    // });
                }}
                onDragGroup={(e) => {
                    //  操作组合(target)拖拽回调
                    // e.events.forEach((ev) => {
                    //     // ev.target.style.transform = ev.transform;
                    //     ev.target.style.position = `absolute`;
                    //     ev.target.style.left = `${ev.left}px`;
                    //     ev.target.style.top = `${ev.top}px`;
                    // });
                }}
                // onResizeGroupStart={({setMin, setMax}) => {
                //     setMin([0, 0]);
                //     setMax([0, 0]);
                // }}
                onResizeGroup={({events}) => {
                    // //  操作组合缩放回调
                    // events.forEach((ev) => {
                    //     ev.target.style.width = `${ev.width}px`;
                    //     ev.target.style.height = `${ev.height}px`;
                    //     ev.target.style.position = `absolute`;
                    //     ev.target.style.left = `${ev.left}px`;
                    //     ev.target.style.top = `${ev.top}px`;
                    // });
                }}
                onResizeGroupEnd={({events}) => {
                    onResizeEnd(events[0].target);
                }}
                //onResizeStart={handleResizeStart} // 缩放开始时
                displayAroundControls={true}
                edge //resize,scale是否支持通过边框操作
                controlPadding={0}
                onResize={handleResize} // 缩放中
                onResizeEnd={({target: resizeTarget}) => {
                    onResizeEnd(resizeTarget);
                }}
                keepRatio={false} // 是否保持纵横比
                //throttleResize={1} // 缩放阈值
                renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]} // 变化的点
                bounds={{left: 0, top: 0, right: 0, bottom: 0, position: "css"}} //  边界点
                padding={{left: 0, top: 0, right: 0, bottom: 0}} // padding距离

                triggerAblesSimultaneously
                zoom={1}
                snappable
                verticalGuidelines={[0, 100, 200]}
                horizontalGuidelines={[0, 100, 200]}
                //snapContainer={snapContainer}
                //rootContainer={snapContainer}
                elementGuidelines={elementGuidelines} //  开启目标辅助线(target)
                hideChildMoveableDefaultLines={true}
                snapGap={true} // 开启辅助线
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
                snapThreshold={0} // 辅助线阈值 ,即元素与辅助线间距小于x,则自动贴边
                isDisplaySnapDigit // 是否展示与磁吸辅助线的距离
                snapDigit={0} //捕捉距离数字
            />
            <Selector
                ref={selectoRef}
                rootContainer={snapContainer}
                selectableTargets={[".rem-item"]}
                selectByClick={!isKeyDown}
                selectFromInside={false}
                toggleContinueSelect={["shift"]}
                hitRate={0}
                ratio={0}
                onDragStart={(e) => {
                    if ((isKeyDown && key === "space") || contentStyle.cursor === 'crosshair') e.stop();

                    if (!elementHasMouseEnter.current) {
                        setSelectedTargets([]);
                    }

                    if (typeof movableRef !== "function" && movableRef !== null) {
                        const moveable = movableRef.current!;
                        const target = e.inputEvent.target;
                        const flatted = targets.flat(3) as Array<HTMLElement | SVGElement>;

                        if (moveable.isMoveableElement(target) || flatted.some((t) => t === target || t.contains(target))) {
                            e.stop();
                        }
                    }
                }}
                onSelectEnd={(e) => {
                    const {isDragStart, isClick, added, removed, inputEvent} = e;
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
                                nextChilds = groupManager.selectSingleChilds(targets, added, removed);
                            } else {
                                nextChilds = groupManager.selectCompletedChilds(targets, added, removed, isKeyDown && key === "shift");
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

