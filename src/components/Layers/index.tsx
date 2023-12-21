import React, { Key, useContext, useEffect, useState } from "react";
import NodeContext, { EventType } from "@/context";
import { Tree, TreeProps } from "antd";

const { DirectoryTree } = Tree;

export default function Layers(props: any) {
  const { treeData } = props;

  const [expandedKeysValue, setExpandedKeys] = useState<Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const { emitter } = useContext(NodeContext);

  emitter.useSubscription(({ type, nodeIds }) => {
    if (type === EventType.SEL_ELELEMT_TO_TREE) {
      let arr: Key[] = [];
      nodeIds?.forEach((item) => {
        if (Array.isArray(item)) {
          arr.push("group_" + item[0]);
          arr = arr.concat(item);
        } else {
          arr.push(item);
        }
      });
      setSelectedKeys(arr);
    }

    if (type === EventType.INIT) {
      setExpandedKeys([]);
      setSelectedKeys([]);
    }
  });

  const onSelect: TreeProps["onSelect"] = (keys) => {
    const nodeIds = (keys[0] === selectedKeys[0] ? [] : keys) as string[];
    emitter.emit({ type: EventType.SEL_ELEMENT, nodeIds });
    setSelectedKeys(nodeIds);
  };

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };

  const onRightClick = ({ node }: { node: any }) => {};

  useEffect(() => {
    if (
      treeData.length > 0 &&
      treeData.length === 1 &&
      expandedKeysValue.length === 0
    ) {
      setExpandedKeys([treeData[0].key]);
    }
  }, [treeData]);

  return (
    treeData.length > 0 && (
      <DirectoryTree
        multiple
        height={500}
        showIcon={false}
        autoExpandParent
        onRightClick={onRightClick}
        expandedKeys={expandedKeysValue}
        defaultExpandAll
        onExpand={onExpand}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={treeData}
      />
    )
  );
}
