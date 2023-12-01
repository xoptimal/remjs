import React, {CSSProperties, ReactElement} from "react";
import ReactDOM from "react-dom";
import type {types} from "recast";
import * as recast from "recast";
import InputContainer from "@/components/InputContainer";
import {Options, transform as babelTransform} from "sucrase";
import {FileType} from "@/components/ContextMenu";
import server from "@/server";

const b = recast.types.builders;

export type ElementType = Record<
    string,
    {
        children: {
            className: string[];
            type: string;
            name?: string;
            style?: CSSProperties;
            text?: string;
        }[];
        className: string[];
        type: string;
        name?: string;
        style?: CSSProperties;
        text?: string;
        deleted: boolean;
    }
>;

export type DataType = {
    children: React.ReactNode
    elements: ElementType
    ast: types.ASTNode
    sourceCode: string
    transformCode: string
    filePath: string
}

export type FileResponseType = {
    code: number
    message: string
}

const _require = (moduleName: string) => {
    const modules: any = {
        "react": React,
        "react-dom": ReactDOM,
    };
    if (modules[moduleName]) {
        return modules[moduleName];
    }
    throw new Error(
        `找不到'${moduleName}模块'，可选模块有：${Object.keys(modules).join(", ")}`
    );
};

const getCodeFunc = (code: string) => {
    const scope: Record<string, any> = {
        require: _require,
        exports: {__esModule: true},
    };
    const keys = Object.keys(scope);
    const values = keys.map((key) => scope[key]);
    const fn = new Function(...keys, code);
    return fn(...values)
};

const core = (code: string) => {
    const option: Options = {
        transforms: ["jsx", "typescript", "imports"]
    };
    return babelTransform(code, option).code + "\nreturn exports.default()"
    //.replace(/(\(function \(\) \{)[\r\n]/, '')
    //.replace(/\}\)\;$/, '');
};

const FORM_ELEMENTS = ['input', 'select', 'picker', 'textarea'];

function checkFormElement(element: string) {
    const lowercaseElement = element.toLowerCase();
    return FORM_ELEMENTS.some(formElement => lowercaseElement.indexOf(formElement) > -1)
}

function findAttribute(attributes: any[], name: string, ast: any, transformValue?: (value: string) => string) {
    const classNameAttr: any = attributes.find((attr: any) => attr.name.name === name);
    let value;
    if (classNameAttr) {
        switch (classNameAttr.value.type) {
            case "StringLiteral":
            case "Literal": {
                value = classNameAttr.value.value.trim();
                if (transformValue) classNameAttr.value.value = transformValue(value)
                break;
            }
            case "JSXExpressionContainer": {
                if (classNameAttr.value.expression.type === 'Literal') {
                    value = classNameAttr.value.expression.value;
                    if (transformValue) classNameAttr.value.expression.value = transformValue(value)

                } else if (classNameAttr.value.expression.type === "Identifier") {
                    const findVariableName = classNameAttr.value.expression.name;
                    recast.visit(ast, {
                        visitVariableDeclarator(path): any {
                            const node = path.node as any;
                            let isUseState = false;
                            let variableName = "";
                            if (node.id.name) {
                                variableName = node.id.name;
                            } else if (node.init.callee && node.init.callee.name === "useState") {
                                variableName = node.id.elements[0].name;
                                isUseState = true;
                            }
                            if (variableName === findVariableName) {
                                if (isUseState) {
                                    value = node.init.arguments[0].value.trim();
                                    if (transformValue) node.init.arguments[0].value = transformValue(value);
                                } else {
                                    value = node.init.value.trim();
                                    if (transformValue) node.init.value = transformValue(value);
                                }
                                this.abort();
                                return false;
                            }
                            this.traverse(path);
                        },
                    });
                }
            }
                break;
        }
    }
    return value;
}

export const createElement = (file: FileType): DataType => {

    const ast = recast.parse(file.content);
    const elements: ElementType = {};
    let number = new Date().getTime();

    recast.visit(ast, {
        visitJSXElement(path) {
            const {openingElement, children} = path.node
            const {attributes = []} = openingElement
            const type = (openingElement.name as types.namedTypes.JSXIdentifier).name;
            if (type !== "Fragment") {
                let name;
                //let className;
                number += 1;
                const id = `${number}`;

                const className = findAttribute(attributes, 'className', ast, value => `${id} ${value}`)
                if (!className) {
                    attributes.unshift(b.jsxAttribute(b.jsxIdentifier("className"), b.stringLiteral(id)));
                }

                // const classNameAttr: any = attributes.find((attr: any) => attr.name.name === 'className');
                // if (classNameAttr) {
                //     switch (classNameAttr.value.type) {
                //         case "StringLiteral":
                //         case "Literal": {
                //             className = classNameAttr.value.value.trim();
                //             classNameAttr.value.value = `${id} ${className}`;
                //             break;
                //         }
                //         case "JSXExpressionContainer": {
                //             if (classNameAttr.value.expression.type === 'Literal') {
                //                 className = classNameAttr.value.expression.value;
                //                 classNameAttr.value.expression.value = `${id} ${className}`;
                //
                //             } else if (classNameAttr.value.expression.type === "Identifier") {
                //                 const findVariableName = classNameAttr.value.expression.name;
                //                 recast.visit(ast, {
                //                     visitVariableDeclarator(path): any {
                //                         const node = path.node as any;
                //                         let isUseState = false;
                //                         let variableName = "";
                //                         if (node.id.name) {
                //                             variableName = node.id.name;
                //                         } else if (node.init.callee && node.init.callee.name === "useState") {
                //                             variableName = node.id.elements[0].name;
                //                             isUseState = true;
                //                         }
                //                         if (variableName === findVariableName) {
                //                             if (isUseState) {
                //                                 className = node.init.arguments[0].value.trim();
                //                                 node.init.arguments[0].value = `${id} ${className}`;
                //                             } else {
                //                                 className = node.init.value.trim();
                //                                 node.init.value = `${id} ${className}`;
                //                             }
                //                             this.abort();
                //                             return false;
                //                         }
                //                         this.traverse(path);
                //                     },
                //                 });
                //             }
                //         }
                //             break;
                //     }
                //
                // } else {
                //     attributes.unshift(b.jsxAttribute(b.jsxIdentifier("className"), b.stringLiteral(id)));
                // }

                let text;
                if (children && children.length === 1 && children[0].type === 'JSXText') {
                    text = children[0].value.trim();
                } else {
                    const placeholder = findAttribute(attributes, 'placeholder', ast)
                    if (placeholder) text = placeholder;
                }
                elements[id] = {type, className, name, style: {}, text, children: [], deleted: false};
            }
            this.traverse(path);
        },

    });

    //  转换后代码
    const formatCode = recast.print(ast).code;

    //  转换可执行程序
    const transformCode = core(formatCode.trim().replace(/;$/, ""));

    //  处理require, export
    const children = getCodeFunc(transformCode);

    Object.keys(elements).map((key) => {
        const temp = elements[key] as any;
        if (temp.className) {
            //temp.style = twj(temp.className, { minify: true, merge: false });
            temp.className = temp.className.split(" ");
        } else {
            temp.className = [];
        }
        //  init children
        temp.children = []
        return temp;
    });

    console.log("elements", elements)

    return {children, elements, ast, sourceCode: file.content, transformCode, filePath: file.path};
}

export function getIconColor(
    target: { className: string[] } | undefined,
    className: string | string[]
) {
    const color = "blue";
    if (target) {
        if (Array.isArray(className)) {
            const classNameSet = new Set(target.className);
            const isSubset = className.every((item) => classNameSet.has(item));
            return isSubset ? color : undefined;
        }
        if (target.className.includes(className)) {
            return color;
        }
    }
    return undefined;
}

export function getStyleValue(str: string) {
    const reg = /(\d+)px/g;
    const arr = [];
    let result;
    while ((result = reg.exec(str))) {
        arr.push(parseFloat(result[1]));
    }
    return arr;
}


export function traversalChildren(data: any, elements: any, props?: {
    className?: string | string[];
    index?: number;
    isRoot?: boolean
}): any {

    let counter = 0;

    function recursiveTraversal(data: any,
                                elements: any,
                                props?: { className?: string | string[]; index?: number; isRoot?: boolean }): any {
        const Node: ReactElement = data;
        let render;

        if (Array.isArray(Node)) {
            counter += 1;
            return React.Children.map(Node, (item, index) =>
                recursiveTraversal(item, elements, {
                    className: `rem_group_${counter}`,
                    index,
                })
            );
        } else if (!Node.type) {
            return Node;
        }

        if (Node.type.toString() !== "Symbol(react.fragment)") {

            let children;
            let id: any;
            let classNameList: string[] = [];

            if (Node.props) {
                const arr = Node.props.className.split(" ");
                id = arr[0];
                classNameList = arr;

                if (typeof Node.props.children === "string") {
                    children = Node.props.children;

                } else {
                    if (Array.isArray(Node.props.children)) {
                        const reactElements = Node.props.children as ReactElement[];
                        //  判断当前数组对象, 是否有嵌套数组情形
                        if (reactElements.some(element => Array.isArray(element))) {
                            children = reactElements.map(element => recursiveTraversal(element, elements));
                        } else {
                            let filter = reactElements.filter(element => React.isValidElement(element))
                            //  判断当前数组, 是否都是HTML元素
                            if (filter.length === reactElements.length) {
                                const key = reactElements[0].props.className.split(" ")[0];
                                filter = reactElements.filter(element => element.props.className.split(" ")[0] === key);
                            }
                            //  判断当前筛选是否为同一元素 (for)
                            if (filter.length === reactElements.length) {
                                children = recursiveTraversal(reactElements, elements)
                            } else {
                                children = React.Children.map(reactElements, item => recursiveTraversal(item, elements));
                            }
                        }
                    } else {
                        children = React.Children.map(Node.props.children, (item) =>
                            recursiveTraversal(item, elements)
                        );
                    }
                }
            }

            if (elements[id]) {

                if (elements[id].deleted) { //  增加筛选
                    return null
                }

                classNameList = [...elements[id].className];
            }

            if (props?.className) {
                if (Array.isArray(props.className)) {
                    classNameList.push(...props.className);
                } else {
                    classNameList.push(props.className);
                }
            }
            if (!props?.isRoot) {
                classNameList.push("rem-item");
            }

            let reactKey = id;

            if (props?.index != null && props?.index > -1) {
                reactKey = `${id}-${props.className}-${props?.index}`;
            }

            //  动态创建的元素
            if (elements[id] && elements[id].children?.length > 0) {
                const addedDomList = elements[id].children
                    .filter((item: any) => !item.deleted)
                    .map(createDom)
                    .map((item: any) => recursiveTraversal(item, elements))
                if (Array.isArray(children)) {
                    children.push(...addedDomList)
                } else if (typeof children === 'string') {
                    children = [children, ...addedDomList]
                } else {
                    children = addedDomList;
                }
            }

            render = React.cloneElement(Node, {
                key: reactKey,
                className: classNameList.join(" "),
                children,
            });

            const isFormElement: boolean = checkFormElement(Node.type as string)

            if (typeof Node.props.children === "string" || isFormElement) {
                let text = Node.props.children;

                if (elements[id] && elements[id].text) {
                    text = elements[id].text
                }

                if (Node.type === 'span') {
                    //  特殊处理
                    classNameList.push("inline-block")
                }

                // else if (Node.type === "input") {
                //     value = Node.props.value || children;
                //     placeholder = Node.props.placeholder;
                // }
                render = (
                    <InputContainer
                        key={reactKey}
                        id={reactKey}
                        type={Node.type as string}
                        text={text}
                        className={classNameList.join(" ")}
                        isFormElement={isFormElement}
                    >
                        {Node}
                    </InputContainer>
                );
            }

            return render;

        } else {
            if (Array.isArray(Node.props.children)) {
                return React.cloneElement(Node, {
                    children: recursiveTraversal(Node.props.children, elements),
                });
            }

            return React.cloneElement(Node, {
                children: React.Children.map(Node.props.children, (item) =>
                    recursiveTraversal(item, elements)
                ),
            });
        }
    }

    return recursiveTraversal(data, elements, props)
}


export function traversalChildrenToTree(
    data: any,
    props?: { className?: string | string[]; index?: number; isRoot?: boolean, counter?: number }
): any {

    const Node = data;
    let id: any;

    if (Array.isArray(data)) {
        let counter = props?.counter || 0;
        counter += 1;
        id = `${Node[0].props.className.split(" ")[0]}-rem_group_${counter}`;
        return {
            key: id,
            title: <div>Group</div>,
            counter
        };
    }

    if (Node.type.toString() !== "Symbol(react.fragment)") {
        let children;
        let type = Node.type;

        if (Node.props) {

            id = Node.props.className?.split(" ")[0];

            if (Array.isArray(Node.props.children)) {

                const reactElements = Node.props.children as ReactElement[];

                if (reactElements.some(element => Array.isArray(element))) {
                    children = reactElements.map(element => traversalChildrenToTree(element));

                } else {

                    let filter = reactElements.filter(element => React.isValidElement(element))

                    let notForElement = true;

                    //  判断当前数组, 是否都是HTML元素
                    if (filter.length === reactElements.length) {
                        const key = reactElements[0].props.className.split(" ")[0];

                        //  这里过来是不是都是for
                        notForElement = reactElements.some(element => element.props.className.split(" ")[0] !== key);
                    }

                    children = notForElement //  判断当前筛选是否为同一元素 (for)
                        ? React.Children.map(filter, element => traversalChildrenToTree(element))
                        : [traversalChildrenToTree(reactElements)]
                }
            } else if (React.isValidElement(Node.props.children)) {
                children = [traversalChildrenToTree(Node.props.children)]
            }
        }

        let reactKey = id;

        if (props?.index != null && props?.index > -1) {
            reactKey = `${id}-${props?.index}`;
        }

        return {
            key: reactKey,
            title: <div className={"capitalize"}>{type}</div>,
            children,
        };
    } else {
        if (Array.isArray(Node.props.children)) {
            return {
                key: Node.key,
                title: <div>Fragment</div>,
                children: traversalChildrenToTree(Node.props.children),
            };
        }

        return {
            key: Node.key,
            title: <div>Fragment</div>,
            children: React.Children.map(Node.props.children, (item) =>
                traversalChildrenToTree(item)
            ),
        };
    }
}


export function save(data: DataType, elements: ElementType) {

    // const keys = Object.keys(elements);

    //  深拷贝
    const ast = recast.parse(recast.print(data.ast).code); // 对AST进行深拷贝

    console.log("data.ast", data)

    recast.visit(ast, {
        visitJSXElement(path) {
            const {openingElement, children} = path.node
            const {attributes = []} = openingElement

            const findIndex: any = attributes.findIndex((attr: any) => attr.name.name === 'className');
            if (findIndex > -1) {
                const attr: any = attributes[findIndex]
                let id;

                if (attr.value.type === 'Literal' || attr.value.type === 'StringLiteral') {
                    const className = attr.value.value;
                    id = className.split(" ")[0]
                    if (elements[id].className.length > 0) {
                        attr.value.value = elements[id].className.join(" ")
                    } else {
                        attributes.splice(findIndex, 1)
                    }
                } else if (attr.value.type === 'JSXExpressionContainer') {

                    if (attr.value.expression.type === 'Literal') {
                        const className = attr.value.expression.value;
                        id = className.split(" ")[0]
                        attr.value.expression.value = elements[id].className.join(" ")

                    } else if (attr.value.expression.type === "Identifier") {
                        const findVariableName = attr.value.expression.name;
                        recast.visit(ast, {
                            visitVariableDeclarator(path): any {
                                const node = path.node as any;
                                let isUseState = false;
                                let variableName = "";
                                if (node.id.name) {
                                    variableName = node.id.name;
                                } else if (node.init.callee && node.init.callee.name === "useState") {
                                    variableName = node.id.elements[0].name;
                                    isUseState = true;
                                }
                                if (variableName === findVariableName) {
                                    if (isUseState) {
                                        const className = node.init.arguments[0].value;
                                        id = className.split(" ")[0]
                                        node.init.arguments[0].value = elements[id].className.join(" ")
                                    } else {
                                        const className = node.init.value;
                                        id = className.split(" ")[0]
                                        node.init.value = elements[id].className.join(" ")
                                    }
                                    this.abort();
                                    return false;
                                }
                                this.traverse(path);
                            },
                        });
                    }
                }

                let strChildren: any = "";

                if (elements[id].children.length > 0) {
                    elements[id].children.forEach(item => {
                        // TODO 需要做一层转换, 展示不处理 style="${item.style}"
                        strChildren += `<${item.type} className="${item.className.join(' ')}">${item.text || ''}</${item.type}>`
                    })
                }

                if (children) {

                    if (children.length === 1 && children[0].type === 'JSXText') {
                        const text = children[0].value;
                        if (elements[id].text !== text) {
                            children[0].value = elements[id].text as any;
                        }
                    }

                    if (strChildren.length > 0) {
                        console.log("str.length >0 children", children)
                        children.push(strChildren)
                    }

                }
            }

            this.traverse(path);
        },

    });

    console.log("origin", recast.print(data.ast).code)
    console.log("print", recast.print(ast).code)

    return new Promise<FileResponseType>((resolve, reject) => {
        server.writeFile(recast.print(ast).code, data.filePath, (response) => {
            if (response.code === 0) {
                resolve(response)
            } else {
                reject(new Error(response.message))
            }
        })
    })
}

export type CanvasType = {
    width: number, height: number, background?: string
}

export function createCanvas(canvas: CanvasType) {
    const content = `
import React from 'react'
export default function TempCanvas() { return <div className="w-${canvas.width}px h-${canvas.height}px bg-[${canvas.background}]">
    <div className="w-100px h-100px translate-x-100px translate-y-100px bg-black"></div>
</div> } 
`
    return createElement({path: '', content})

    // const uuid = new Date().getTime();
    // const root = <div className={clsx(uuid)}/>
    // return {
    //     elements: {
    //         [uuid]: {
    //             className: [uuid, "w-500px", "h-500px", "bg-[#fff]"],
    //             style: {},
    //             type: 'div',
    //             text: null,
    //             children: [],
    //         }
    //     },
    //     children: root
    // }
}

export function createRectView(parentId: string, data: any): [string, any] {
    const uuid = new Date().getTime().toString();
    const className = [uuid, "w-1px", "h-1px", "bg-[#cccccc]"]
    if (data.position) {
        className.push(`absolute left-0 top-0 transform-gpu`)
        className.push(`translate-x-[${data.position.x}px]`)
        className.push(`translate-y-[${data.position.y}px]`)
    }
    return [uuid, {
        parentId,
        isTemporary: true,
        className,
        style: {},
        type: 'div',
        text: null,
        children: []
    }]
}


export function createDom({type, className}: { type: string, className: string[] }) {
    if (type === 'div') {
        return <div className={className.join(" ")}/>
    }
    if (type === 'span') {
        return <span className={className.join(" ")}/>
    }
    return <div/>
}


type Node = {
    parentId?: string;
    isTemporary?: boolean;
    className?: string[];
    style?: Record<string, any>;
    type?: string;
    text?: string | null;
    children?: Node[];
};

type ObjectMap = Record<string, Node>;


// export function deleteElementById(obj: ObjectMap, targetParentId: string): void {
//     function findAndDelete(node: Node, parentId: string | undefined, index: number | undefined) {
//         if (node.parentId === targetParentId) {
//             // 找到目标节点，从父节点的 children 中删除
//             if (parentId !== undefined && index !== undefined && obj[parentId]?.children) {
//                 obj[parentId].children?.splice(index, 1);
//                 return true; // 表示找到并删除成功
//             }
//         }
//
//         // 递归查找子节点
//         if (node.children) {
//             for (let i = 0; i < node.children.length; i++) {
//                 if (findAndDelete(node.children[i], node.parentId, i)) {
//                     // 如果找到并删除成功，停止继续查找
//                     return true;
//                 }
//             }
//         }
//
//         return false; // 表示未找到
//     }
//
//     // 开始从根节点查找
//     const rootId = Object.keys(obj)[0];
//     findAndDelete(obj[rootId], undefined, undefined);
// }

//
// export function getChangeData(obj: Record<string, any>) {
//
//     const className = []
//     const mutuallyExclusives = []
//
//     Object.keys(obj).forEach(key => {
//         className.push(`${key}-[${obj[key]}px]`)
//     })
// }
//
// export function updateElementPosition(obj: Record<string, any>) {
//
//     const className = []
//     const mutuallyExclusives = []
//
//     Object.keys(obj).forEach(key => {
//         className.push(`${key}-[${obj[key]}px]`)
//         mutuallyExclusives.push(key)
//     })
//
// }