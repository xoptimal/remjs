import React, {ComponentType, useEffect, useState} from "react";
import * as recast from "recast";
import {useEventEmitter, useGetState, useSetState} from "ahooks";
import Editor from "@/components/Editor";
import {createElement, traversalChildren, traversalChildrenToTree} from "@/utils/transform";
import NodeContext from "./context";

const b = recast.types.builders;

interface RemProps {
    code?: string;
}

function withCore<T extends RemProps>(WrappedComponent: ComponentType<T>) {
    return function WithCodeComponent(props: T) {
        const {code, ...rest} = props;
        let data;
        try {
            data = createElement(code);
        } catch (e) {
            //  解析失败, 请检查录入的code是否存在问题
            console.log("e", e)
        }
        return (
            <WrappedComponent data={data} {...rest as T} />
        );
    };
}

const Core: React.FC<RemProps & { data?: any }> = (props) => {

    const {data} = props;

    const emitter = useEventEmitter<string>();

    const [elements, setElements] = useSetState<any>({});
    const [target, setTarget, getTarget] = useGetState<any>(null);

    const [children, setChildren] = useState<any>();

    const [treeData, setTreeData] = useState<any[]>([]);

    useEffect(() => {
        if (data) {
            setElements(data.elements)
            const treeData = traversalChildrenToTree(data.children)
            setTreeData(Array.isArray(treeData) ? treeData : [treeData])
            setChildren(traversalChildren(data.children, data.elements, {isRoot: true}))
        }
    }, [data])


    const onSave = () => {
        // const { ast } = data;
        // recast.visit(ast, {
        //   visitJSXOpeningElement(path) {
        //     const node = path.node as any;
        //     const type = node.name.name;
        //     if (type !== "Fragment") {
        //       if (node.attributes.length) {
        //         const findIdIndex = node.attributes.findIndex(
        //           (find: any) => find.name.name === "id"
        //         );
        //         //  判断是否有ID属性
        //         if (findIdIndex > -1) {
        //           const id = node.attributes[findIdIndex].value.value;
        //           //  判断ID对应的当前对象, 是否有样式数据
        //           if (elements[id].style?.length > 0) {
        //             const className = elements[id].style.join(" ");
        //             const findClassNameIndex = node.attributes.findIndex(
        //               (find: any) => find.name.name === "className"
        //             );
        //             if (findClassNameIndex > -1) {
        //               node.attributes[findClassNameIndex].value =
        //                 b.stringLiteral(className);
        //             } else {
        //               const a = b.jsxAttribute(
        //                 b.jsxIdentifier("className"),
        //                 b.stringLiteral(className)
        //               );
        //               node.attributes.unshift(a);
        //             }
        //           }
        //           //  清除标识符
        //           delete node.attributes[findIdIndex];
        //         }
        //       }
        //     }
        //     return false;
        //   },
        // });
        // const formatCode = recast.print(ast).code;
    };

    const handleChangeTarget = ({className, mutuallyExclusives = []}: any) => {
        const tTarget = getTarget();
        if (!tTarget) return;

        setElements((draft: any) => {
            let arr = [...draft[tTarget.id].className].filter(
                (className) =>
                    mutuallyExclusives?.findIndex(
                        (find: string) => find === className
                    ) === -1
            );
            if (className) {
                if (Array.isArray(className)) {
                    arr.push(...className);
                } else {
                    arr.push(className);
                }
                arr = [...new Set(arr)];
            }

            //  update
            draft[tTarget.id].className = arr;
            setTarget({...tTarget, className: arr});
            return draft;
        });
    };

    const handleSetTarget = (id: string) => {
        setTarget(elements[id] ? {...elements[id], id} : null);
    };

    return (
        <NodeContext.Provider
            value={{
                target,
                setTarget: handleSetTarget,
                onChange: handleChangeTarget,
                emitter,
            }}
        >
            <Editor treeData={treeData}>{children || <span />}</Editor>
        </NodeContext.Provider>
    );
};

export default withCore(Core);

