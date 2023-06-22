import { createElement } from "./utils/transform";
import React from "react";
import NodeFactory from "./NodeFactory";
import defaultTheme from "@/core/utils/theme";

// @ts-ignore
import config from "../../tailwind.config.js";
import { tailwindToCSS } from "tw-to-css";

type RemProps = {
  code: string;
  theme: any;
};

const { twi, twj } = tailwindToCSS({
  config: {
    theme: config.theme,
  },
});

export { twi, twj };

function Rem(props: RemProps) {
  const { code, theme = defaultTheme } = props;

  let TransformNode: any;
  let elements: any;
  let data: any;

  try {
    data = createElement(code);
    //console.log("node", data.node)
    TransformNode = data.node;
    elements = data.elements;
  } catch (error) {
    TransformNode = (error as Error).message;
  }

  if (!TransformNode) return <div>error</div>;

  //报错时输出信息
  //if (typeof TransformNode === 'string') return TransformNode;

  console.log("init rem");

  //渲染组件
  return (
    <NodeFactory elements={elements} data={data}>
      {TransformNode}
    </NodeFactory>
  );
}

export default React.memo(Rem);
