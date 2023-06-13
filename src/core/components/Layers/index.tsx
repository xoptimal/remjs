import React, {Key, useContext, useEffect, useState} from "react";
import NodeContext from "@/core/context";
import {Tree} from "antd";

const {DirectoryTree} = Tree;

export default function Layers(props: any) {

    const {treeData = []} = props;

    const [expandedKeysValue, setExpandedKeys] = useState<Key[]>([])
    const [selectKeys, setSelectKeys] = useState<React.Key[]>([])

    const {emitter, setTarget} = useContext(NodeContext)

    emitter.useSubscription(({type, nodeIds}: { type: string, nodeIds: string[] }) => {
        if (type === 'select-tree') {
            let arr: Key[] = [];
            nodeIds.forEach(item => {
                if (Array.isArray(item)) {
                    arr.push("group_" + item[0])
                    arr = arr.concat(item)
                } else {
                    arr.push(item)
                }
            })
            setSelectKeys(arr)
        }
    })

    useEffect(() => {
        if (treeData?.length > 0) {
            setExpandedKeys([treeData[0].key])
        }
    }, [])

    const onSelect = (selectedKeys: Key[], {selectedNodes}: { selectedNodes: any[] }) => {
        let keys = selectedKeys;
        if (selectedNodes.length === 1 && selectedNodes[0].children?.length > 0) {
            keys = selectedNodes[0].children.map((item: { key: string }) => item.key)
        }
        emitter.emit({type: 'select-node', nodeIds: keys})
        setSelectKeys(selectedKeys)
    }

    const onExpand = (expandedKeysValue: React.Key[]) => {
        setExpandedKeys(expandedKeysValue);
    };

    const onRightClick = ({node}: { node: any }) => {
        console.log("node", node)
    }


    return (
        <DirectoryTree
            //blockNode
            //showLine
            multiple
            defaultExpandAll
            //draggable
            showIcon={false}
            autoExpandParent
            onRightClick={onRightClick}
            expandedKeys={expandedKeysValue}
            onExpand={onExpand}
            onSelect={onSelect}
            selectedKeys={selectKeys}
            treeData={treeData}/>
    )
}