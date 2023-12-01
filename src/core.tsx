import React, {ComponentType, useMemo, useRef, useState} from "react";
import {useAsyncEffect, useEventEmitter, useGetState, useKeyPress, useSetState} from "ahooks";
import Editor from "@/components/Editor";
import {
    CanvasType,
    createCanvas,
    createElement,
    createRectView,
    DataType,
    ElementType,
    save,
    traversalChildren
} from "@/helpers/core";
import NodeContext, {EventProps, EventType, NodeContextType} from "./context";
import {Button, Divider, message, Space} from "antd";
import {DesktopOutlined, MobileOutlined, TabletOutlined} from "@ant-design/icons";
import {FileType} from "@/components/ContextMenu";

interface CoreProps {
    file?: FileType;
    onCancel?: () => void;
    canvas?: CanvasType
}

function wait(time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}

function withCore<T extends CoreProps>(WrappedComponent: ComponentType<T>) {
    return function WithCodeComponent(props: T) {
        const {file, canvas, ...rest} = props;
        let data;
        try {
            if (file) data = createElement(file);
            else if (canvas) data = createCanvas(canvas);

        } catch (e) {
            //  解析失败, 请检查录入的code是否存在问题
            console.log("e", e)
        }
        return (
            <WrappedComponent data={data} {...rest as T} />
        );
    };
}


const Core: React.FC<CoreProps> = (props) => {

    const {data} = props as { data: DataType };

    const emitter = useEventEmitter<EventProps>();

    const [elements, setElements] = useSetState<any>(null);

    const elementsRef = useRef<ElementType>()

    const [target, setTarget, getTarget] = useGetState<any>(null);

    const [treeData, setTreeData] = useState<any[]>([]);

    const [loading, setLoading] = useState(false)

    emitter.useSubscription(({type, data, elements}) => {

            if (!elementsRef.current) return

            switch (type) {
                case EventType.SAVE: {
                    onSave(elements)
                }
                    break;
                case EventType.ADD_REACT: {
                    const firstPropertyId = Object.keys(elementsRef.current)[0];
                    const [id, element] = createRectView(firstPropertyId, data)

                    setElements(prev => {
                        const temp = {...prev}
                        temp[firstPropertyId].children.push(element)
                        temp[id] = element

                        //  sync
                        elementsRef.current = temp;
                        return temp;
                    })

                    //  wait 10ms update mouse point style
                    setTimeout(() => {
                        // 选择当前目标
                        emitter.emit({type: EventType.SELECT_NODE, nodeIds: [id], added: true})
                    }, 10)

                    // if (target) {
                    //     setElements(prev => {
                    //         prev[target.id].children.push(element)
                    //         return prev;
                    //     })
                    // } else {
                    //     const firstPropertyId = Object.keys(elements)[0];
                    //     setElements(prev => {
                    //         prev[firstPropertyId].children.push(element)
                    //         return prev;
                    //     })
                    // }
                }
                    break;
            }
        }
    );

    // useKeyPress('delete', () => {
    //     if (target && target.parentId) {
    //         // deleteElementById(elementsRef.current, target)
    //     }
    // }, {events: ['keyup'], useCapture: true});

    useAsyncEffect(async () => {
        if (data) {
            //  发送一个初始化的消息
            if (elementsRef.current) {
                emitter.emit({type: EventType.INIT})
                await wait(10);
            }
            setTarget(null)
            setElements(data.elements)
            elementsRef.current = data.elements;

            // const treeData = traversalChildrenToTree(data.elements)
            // console.log("treeData", treeData)
            // setTreeData()

        }
    }, [data])

    const onCancel = () => {
        props.onCancel?.();
    }

    const onSave = async (elements: any) => {
        setLoading(true)
        try {
            const res = await save(data, elements)
            message.success(res.message)
            props.onCancel?.()
        } catch (e) {
            message.error((e as Error).message)
        } finally {
            setLoading(false)
        }

    };

    function handleSave() {
        emitter.emit({type: EventType.SYNC_ELEMENTS, elements: elementsRef.current})
    }

    const [historyList, setHistoryList] = useState<any[]>([])

    useKeyPress('delete', () => {
        if (target) {
            console.log('1', target)
            //  保存当前对象副本
            setHistoryList(prev => [...prev, {...target}])

            setElements(prev => {
                //  标记已删除
                prev[target.id].deleted = true

                if (target.parentId) {
                    const parent = prev[target.parentId]
                    const index = parent.children.findIndex((child: any) => child.id === target.id)
                    parent.children[index].deleted = true
                }

                return prev
            })

            //  取消选择
            setTarget(null)

            // 同步Movable
            emitter.emit({type: EventType.SELECT_NODE, nodeIds: [], added: true})
        }
    }, {events: ['keyup'], useCapture: true});


    const handleChangeTarget: NodeContextType["onChange"] = (params, targetId, callback) => {

        const {
            className,
            mutuallyExclusives = [],
            text,
            placeholder
        } = params

        const tTarget = targetId ? elements[targetId] : getTarget()
        if (!tTarget) return;

        setElements((draft: any) => {
            if (text) tTarget.text = text
            if (placeholder) tTarget.placeholder = placeholder
            if (className || mutuallyExclusives.length > 0) {
                let arr = [...draft[tTarget.id].className];
                if (mutuallyExclusives) {
                    arr = arr.filter(className => !mutuallyExclusives.includes(className));
                }
                if (className) {
                    if (Array.isArray(className)) {
                        arr.push(...className);
                    } else {
                        arr.push(className);
                    }
                    arr = Array.from(new Set(arr));
                }
                tTarget.className = arr
            }
            const temp = {...tTarget};
            setTarget(temp);
            draft[tTarget.id] = temp;
            elementsRef.current![tTarget.id] = temp
            return draft;
        });

        setTimeout(() => {
            callback?.()
        }, 50)

    };

    const handleSetTarget = (id?: string,) => {
        // @ts-ignore
        setTarget(elementsRef.current[id] ? {...elementsRef.current[id], id} : null);
    };

    const deviceList = [
        {label: <DesktopOutlined/>, key: "pc", width: 1000},
        {label: <TabletOutlined/>, key: "pad", width: 642},
        {label: <MobileOutlined/>, key: "mobile", width: 375},
    ];

    const content = useMemo(() => {
        return elements && traversalChildren(data.children, elements, {isRoot: true})
    }, [elements])

    console.log("elements", elements)

    return (
        <NodeContext.Provider
            value={{
                target,
                setTarget: handleSetTarget,
                onChange: handleChangeTarget,
                emitter,
            }}
        >
            <div className={"w-full h-full bg-white"}>
                <div
                    className={
                        "w-full h-50px flex justify-between items-center px-8px border-b-solid border-b-[1px] border-b-gray-200"
                    }
                >
                    <div className={"flex items-center"}>
                        <Space>
                            <span>REM</span>
                        </Space>
                        <Divider type={"vertical"}/>
                    </div>
                    {/*
                    <div className={"h-full flex-1"}>
                        <Tabs
                            centered
                            className={"rem-device-tab"}
                            defaultActiveKey="1"
                            items={deviceList}
                        />
                    </div>*/}
                    <Space>
                        <Button onClick={onCancel}>
                            取消
                        </Button>
                        <Button type={"primary"} disabled={elements === null} onClick={handleSave} loading={loading}>
                            SAVE
                        </Button>
                    </Space>
                </div>
                <Editor treeData={treeData}>
                    {content}
                </Editor>
            </div>
        </NodeContext.Provider>
    );
};

export default withCore(Core);

