import React, {CSSProperties} from "react";
import ReactDOM from "react-dom";
import * as recast from "recast";
// @ts-ignore
import {transform as babelTransform} from "@babel/standalone";
import InputContainer from "@/components/InputContainer";

const b = recast.types.builders;

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
    return fn(...values);
};

const transform = (code: string) => {
    const option = {presets: ["es2015", "react"]};
    return babelTransform(code, option).code + "return exports.default()"
    //.replace(/(\(function \(\) \{)[\r\n]/, '')
    //.replace(/\}\)\;$/, '');
};


type ElementType = Record<
    string,
    { className?: string; type: string; name?: string; style?: CSSProperties }
>;

export const createElement = (sourceCode?: string) => {

    if (!sourceCode || sourceCode.length === 0) {
        return null;
    }

    const ast = recast.parse(sourceCode);
    const elements: ElementType = {};
    let number = new Date().getTime();

    recast.visit(ast, {
        visitJSXOpeningElement(path) {
            const node = path.node as any;
            const type = node.name.name;
            if (type !== "Fragment") {
                let className;
                let name;
                number += 1;
                const id = `${number}`;
                if (node.attributes?.length) {
                    const findIndex = node.attributes.findIndex(
                        (find: any) => find.name.name === "className"
                    );
                    if (findIndex > -1) {
                        const find = node.attributes[findIndex];
                        switch (find.value.type) {
                            case "Literal": {
                                className = find.value.value;
                                find.value.value = `${id} ${find.value.value}`;
                                break;
                            }
                            case "JSXExpressionContainer": {
                                className = find.value.expression.value;
                                find.value.expression.value = `${id} ${find.value.expression.value}`;

                                if (
                                    find.value.expression.type === "Identifier" &&
                                    typeof find.value.expression.name !== "undefined"
                                ) {
                                    name = find.value.expression.name;
                                }
                            }
                                break;
                        }
                    } else {
                        node.attributes.unshift(
                            b.jsxAttribute(b.jsxIdentifier("className"), b.stringLiteral(id))
                        );
                    }
                } else {
                    node.attributes = [
                        b.jsxAttribute(b.jsxIdentifier("className"), b.stringLiteral(id)),
                    ];
                }

                elements[id] = {type, className, name, style: {}};
            }
            return false;
        },
    });

    const keys = Object.keys(elements);

    recast.visit(ast, {
        visitVariableDeclarator(path): any {
            const node = path.node as any;
            let isUseState = false;
            let key: string;
            if (node.id.name) {
                key = node.id.name;
            } else if (node.init.callee && node.init.callee.name === "useState") {
                key = node.id.elements[0].name;
                isUseState = true;
            }
            const findIndex = keys.findIndex(
                (findKey) => elements[findKey]?.name == key
            );
            if (key! && findIndex > -1) {
                const elementKey = keys[findIndex];
                if (isUseState) {
                    elements[elementKey].className = node.init.arguments[0].value;
                    node.init.arguments[0].value = `${elementKey} ${node.init.arguments[0].value}`;
                } else if (elements[elementKey].name === node.id.name) {
                    elements[elementKey].className = node.init.value;
                    node.init.value = `${elementKey} ${node.init.value}`;
                }
            }
            return false;
        },
    });

    //  转换后代码
    const formatCode = recast.print(ast).code;

    //  转换可执行程序
    const transformCode = transform(formatCode.trim().replace(/;$/, ""));

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
        return temp;
    });

    return {children, elements, ast, sourceCode, transformCode};
};

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


export function traversalChildren(
    data: any,
    elements: any,
    props?: { className?: string | string[]; index?: number; isRoot?: boolean, counter?: number }
): any {
    const Node = data;
    let render = Node;
    if (Array.isArray(data)) {
        let counter = props?.counter || 0;
        counter += 1;
        return React.Children.map(Node, (item, index) =>
            traversalChildren(item, elements, {
                className: `rem_group_${counter}`,
                index,
                counter
            })
        );
    }

    if (Node.type.toString() !== "Symbol(react.fragment)") {
        let children;
        let id: any;

        let classNameList = [];

        if (Node.props) {
            const arr = Node.props.className.split(" ");
            id = arr[0];
            classNameList = arr.slice(1);

            if (typeof Node.props.children === "string") {
                children = Node.props.children;
            } else {
                if (Array.isArray(Node.props.children)) {
                    //  判断当前数组对象, 是否有嵌套数组情况
                    if (
                        Node.props.children.findIndex((item: any) => Array.isArray(item)) >
                        -1
                    ) {
                        children = Node.props.children.map((item: any, index: number) =>
                            traversalChildren(item, elements)
                        );
                    } else {
                        const key = Node.props.children[0].props.className.split(" ")[0];
                        const filter = Node.props.children.filter(
                            (item: any) => item.props.className.split(" ")[0] === key
                        );
                        if (filter.length === Node.props.children.length) {
                            children = traversalChildren(Node.props.children, elements);
                        } else {
                            children = React.Children.map(Node.props.children, (item) =>
                                traversalChildren(item, elements)
                            );
                        }
                    }
                } else {
                    children = React.Children.map(Node.props.children, (item) =>
                        traversalChildren(item, elements)
                    );
                }
            }
        }

        if (id && elements[id]) {
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

        render = React.cloneElement(Node, {
            key: reactKey,
            className: classNameList.join(" "),
            children,
        });

        if (
            Node.type === "span" ||
            Node.type === "p" ||
            Node.type === "input" ||
            (Node.type === "div" && typeof Node.props.children === "string")
        ) {
            let value = children;
            let placeholder;

            if (Node.type === "input") {
                value = Node.props.value;
                placeholder = Node.props.placeholder;
            }

            render = (
                <InputContainer
                    key={reactKey}
                    id={reactKey}
                    type={Node.type}
                    value={value}
                    placeholder={placeholder}
                    className={classNameList.join(" ")}
                />
            );
        }

        return render;
    } else {
        if (Array.isArray(Node.props.children)) {
            return React.cloneElement(Node, {
                children: traversalChildren(Node.props.children, elements),
            });
        }

        return React.cloneElement(Node, {
            children: React.Children.map(Node.props.children, (item) =>
                traversalChildren(item, elements)
            ),
        });
    }
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
                if (
                    Node.props.children.findIndex((item: any) => Array.isArray(item)) > -1
                ) {
                    children = Node.props.children.map((item: any) =>
                        traversalChildrenToTree(item)
                    );
                } else {
                    const key = Node.props.children[0].props.className.split(" ")[0];

                    const filter = Node.props.children.filter(
                        (item: any) => item.props.className.split(" ")[0] === key
                    );

                    if (filter.length === Node.props.children.length) {
                        children = [traversalChildrenToTree(Node.props.children)];
                    } else {
                        children = React.Children.map(Node.props.children, (item) =>
                            traversalChildrenToTree(item)
                        );
                    }
                }
            } else if (typeof Node.props.children !== "string") {
                children = React.Children.map(Node.props.children, (item) =>
                    traversalChildrenToTree(item)
                );
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