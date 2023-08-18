import React, { Key, useContext, useEffect, useRef, useState } from "react";
import NodeContext from "@/context";
import { Tree, TreeProps } from "antd";
import {traversalChildrenToTree} from "@/utils/transform";

const { DirectoryTree } = Tree;

let counter = 0;



export default function Layers(props: any) {
  const { treeData } = props;

  const [expandedKeysValue, setExpandedKeys] = useState<Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const { emitter, setTarget } = useContext(NodeContext);

  emitter.useSubscription(
    ({ type, nodeIds }: { type: string; nodeIds: string[] }) => {
      if (type === "select-tree") {
        let arr: Key[] = [];

        console.log("nodeIds", nodeIds);

        nodeIds.forEach((item) => {
          if (Array.isArray(item)) {
            arr.push("group_" + item[0]);
            arr = arr.concat(item);
          } else {
            arr.push(item);
          }
        });
        setSelectedKeys(arr);
      }
    }
  );

  const onSelect: TreeProps["onSelect"] = (keys) => {
    let nodeIds = keys[0] === selectedKeys[0] ? [] : keys;
    emitter.emit({ type: "select-node", nodeIds });
    setSelectedKeys(nodeIds);
  };

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };

  const onRightClick = ({ node }: { node: any }) => {};

  const ref = useRef<HTMLDivElement>(null);

  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight(ref.current?.clientHeight || 0);
  }, []);

  return (
    <div ref={ref} style={{ height: "calc(100vh - 112px)" }}>
      <DirectoryTree
        multiple
        height={height}
        showIcon={false}
        autoExpandParent
        onRightClick={onRightClick}
        expandedKeys={expandedKeysValue}
        onExpand={onExpand}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={treeData}
      />
    </div>
  );
}
