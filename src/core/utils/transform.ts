import React, {CSSProperties} from 'react';
import ReactDOM from "react-dom";
import * as recast from "recast";
// @ts-ignore
import {transform as babelTransform} from "@babel/standalone"
import {twj} from 'tw-to-css';

const b = recast.types.builders;

const _require = (moduleName: string) => {
    const modeules: any = {
        react: React,
        'react-dom': ReactDOM,
    };
    if (modeules[moduleName]) {
        return modeules[moduleName];
    }
    throw new Error(
        `找不到'${moduleName}模块'，可选模块有：${Object.keys(modeules).join(", ")}`
    );
};

const getCodeFunc = (code: string) => {
    const scope: Record<string, any> = {
        "require": _require,
        "exports": {"__esModule": true}
    }
    const keys = Object.keys(scope);
    const values = keys.map((key) => scope[key]);
    const fn = new Function(...keys, code);
    return fn(...values)
};

const transform = (code: string) => {
    const text: string = code;
    const option = {presets: ['es2015', 'react']};
    let transformCode = babelTransform(text, option).code;
    return transformCode + "return exports.default()"
    //.replace(/(\(function \(\) \{)[\r\n]/, '')
    //.replace(/\}\)\;$/, '');
};

/**
 * es6代码转换为es5
 * @returns 转换后的代码
 */
type FuncType = (code: string) => any;

type ElementType = Record<string, { classNames?: string, type: string, name?: string, style?: CSSProperties }>

export const createElement: FuncType = (sourceCode = '') => {
    const ast = recast.parse(sourceCode);
    const elements: ElementType = {}

    let number = new Date().getTime()

    recast.visit(ast, {
        visitJSXOpeningElement(path) {
            const node = path.node as any
            const type = node.name.name
            if (type !== 'Fragment') {
                let classNames;
                let name;
                number += 1;
                const id = `${number}`;
                if (node.attributes?.length) {
                    const findIndex = node.attributes.findIndex((find: any) => find.name.name === 'className')
                    if (findIndex > -1) {
                        const find = node.attributes[findIndex]
                        switch (find.value.type) {
                            case 'Literal':
                                classNames = find.value.value
                                find.value.value = `${id} ${find.value.value}`
                                break;
                            case 'JSXExpressionContainer': {
                                if (find.value.expression.type === "Identifier" && typeof find.value.expression.name !== 'undefined') {
                                    name = find.value.expression.name
                                }
                            }
                                break;
                        }
                    } else {
                        node.attributes.unshift(b.jsxAttribute(b.jsxIdentifier("className"), b.stringLiteral(id)))
                    }
                } else {
                    node.attributes = [b.jsxAttribute(b.jsxIdentifier("className"), b.stringLiteral(id))]
                }

                elements[id] = {type, classNames, name, style: {}}
            }
            return false;
        },
    })

    const keys = Object.keys(elements);

    recast.visit(ast, {
        visitVariableDeclarator(path): any {
            const node = path.node as any
            let isUseState = false;
            let key: string;
            if (node.id.name) {
                key = node.id.name
            } else if (node.init.callee && node.init.callee.name === "useState") {
                key = node.id.elements[0].name
                isUseState = true;
            }
            const findIndex = keys.findIndex(findKey => elements[findKey]?.name == key)
            if (key! && findIndex > -1) {
                const elementKey = keys[findIndex];
                if (isUseState) {
                    elements[elementKey].classNames = node.init.arguments[0].value
                    node.init.arguments[0].value = `${elementKey} ${node.init.arguments[0].value}`
                } else if (elements[elementKey].name === node.id.name) {
                    elements[elementKey].classNames = node.init.value
                    node.init.value = `${elementKey} ${node.init.value}`
                }
            }
            return false;
        },

    })

    //  转换后代码
    const formatCode = recast.print(ast).code;

    //  转换可执行程序
    const transformCode = transform(formatCode.trim().replace(/;$/, ''));

    //  处理require, export
    const node = getCodeFunc(transformCode)

    Object.keys(elements).map(key => {
        const temp = elements[key]
        if (temp.classNames) {
            temp.style = twj(temp.classNames, {minify: true, merge: false});
        }
        return temp;
    })

    return {transformCode, node, elements, ast, sourceCode};
};
