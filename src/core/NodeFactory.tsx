import React, { useMemo } from "react";
import * as recast from "recast";

import NodeContext from "./context";
import { useEventEmitter, useGetState, useSetState } from "ahooks";
import InputContainer from "@/components/InputContainer";
import Layout from "@/core/components/Layout";
import { twj } from "@/core/rem";

const b = recast.types.builders;

type NodeFactoryProps = {
  elements: any;
  data: any;
};

function traversalChildren(
  data: any,
  elements: any,
  props?: { className: string; index?: number }
): any {
  const Node = data;
  let render = Node;

  if (Array.isArray(Node)) {
    return React.Children.map(Node, (item, index) =>
      traversalChildren(item, elements, {
        className: "rem-group",
        index,
      })
    );
  }

  if (Node.type.toString() !== "Symbol(react.fragment)") {
    let children;
    let style;
    let id: any;

    const classNameList = [];

    if (Node.props) {
      id = Node.props.className.split(" ")[0];
      classNameList.push(id);

      if (typeof Node.props.children === "string") {
        children = Node.props.children;
      } else {
        if (Array.isArray(Node.props.children)) {
          return React.cloneElement(Node, {
            children: traversalChildren(Node.props.children, elements),
          });
        } else {
          children = React.Children.map(Node.props.children, (item) =>
            traversalChildren(item, elements)
          );
        }
      }
    }

    if (id && elements[id]) style = elements[id].style;

    if (props?.className) classNameList.push(props.className);
    classNameList.push("rem-item");

    let reactKey = id;

    if (props?.index != null && props?.index > -1) {
      reactKey = `${id}-${props?.index}`;
    }

    render = React.cloneElement(Node, {
      key: reactKey,
      style,
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
          style={style}
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

export default function NodeFactory(
  props: React.PropsWithChildren<NodeFactoryProps>
) {
  const { elements: elementsProps, children: childrenProps } = props;

  const [elements, setElements] = useSetState<any>(elementsProps);

  const [target, setTarget, getTarget] = useGetState<any>(null);

  const onChangeTarget = ({ className, mutuallyExclusives = [] }: any) => {
    const tTarget = getTarget();
    if (!tTarget) return;

    setElements((draft: any) => {
      const arr = [...draft[tTarget.id].className].filter(
        (className) =>
          mutuallyExclusives?.findIndex(
            (find: string) => find === className
          ) === -1
      );

      if (className) {
        arr.push(className); //  添加
      }

      //  update
      draft[tTarget.id].className = arr;
      draft[tTarget.id].style = twj(arr, { minify: true, merge: false });
      setTarget({ ...tTarget, className: arr, style: draft[tTarget.id].style });

      return draft;
    });
  };

  const onSave = () => {
    const { ast } = props.data;
    recast.visit(ast, {
      visitJSXOpeningElement(path) {
        const node = path.node as any;
        const type = node.name.name;
        if (type !== "Fragment") {
          if (node.attributes.length) {
            const findIdIndex = node.attributes.findIndex(
              (find: any) => find.name.name === "id"
            );
            //  判断是否有ID属性
            if (findIdIndex > -1) {
              const id = node.attributes[findIdIndex].value.value;
              //  判断ID对应的当前对象, 是否有样式数据
              if (elements[id].style?.length > 0) {
                const className = elements[id].style.join(" ");
                const findClassNameIndex = node.attributes.findIndex(
                  (find: any) => find.name.name === "className"
                );
                if (findClassNameIndex > -1) {
                  node.attributes[findClassNameIndex].value =
                    b.stringLiteral(className);
                } else {
                  const a = b.jsxAttribute(
                    b.jsxIdentifier("className"),
                    b.stringLiteral(className)
                  );
                  node.attributes.unshift(a);
                }
              }
              //  清除标识符
              delete node.attributes[findIdIndex];
            }
          }
        }
        return false;
      },
    });
    const formatCode = recast.print(ast).code;
  };

  const onRemoveTarget = ({ className }: { className: string }) => {
    const tTarget = getTarget();
    if (!tTarget) return;

    setElements((draft: any) => {
      const arr = [...draft[tTarget.id].className].filter(
        (value) => value !== className
      );
      draft[tTarget.id].className = arr;
      draft[tTarget.id].style = twj(arr, { minify: true, merge: false });
      setTarget({ ...tTarget, ...draft[tTarget.id] });
      return draft;
    });
  };
  const onRemoveAllStyle = (style: string) => {
    // @ts-ignore
    setElements((draft: any) => {
      const tTarget = getTarget();
      if (tTarget && style) {
        const temp = { ...draft[tTarget.id].style };
        const newStyle: any = {};
        Object.keys(temp)
          .filter((key) => key.indexOf(style) === -1)
          .forEach((key) => {
            newStyle[key] = temp[key];
          });
        draft[tTarget.id].style = newStyle;
        setTarget({ ...tTarget, style: temp });
      }
      return draft;
    });
  };

  const emitter = useEventEmitter<string>();

  const domChildren = useMemo(() => {
    if (Array.isArray(childrenProps)) {
      //  for
      return traversalChildren(childrenProps, elements);
    } else {
      return React.Children.map(childrenProps, (child) =>
        traversalChildren(child, elements)
      );
    }
  }, [elements]);

  const handleSelect = (id: string) => {
    setTarget(elements[id] ? { ...elements[id], id } : null);
  };

  console.log("render", target);
  console.log("elements", elements);

  return (
    <NodeContext.Provider
      value={{
        target,
        setTarget: handleSelect,
        onChange: onChangeTarget,
        onRemove: onRemoveTarget,
        onRemoveAll: onRemoveAllStyle,
        emitter,
      }}
    >
      <Layout>{domChildren}</Layout>
    </NodeContext.Provider>
  );
}