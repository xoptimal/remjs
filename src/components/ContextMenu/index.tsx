import React, {useEffect} from "react";
import {Item, ItemProps, Menu, useContextMenu} from 'react-contexify';
import {Tag} from "antd";
import sever from "@/server";

import 'react-contexify/ReactContexify.css';
import './index.css'

type Fiber = {
    _debugSource?: {
        columnNumber?: number;
        fileName: string;
        lineNumber?: number;
    };
    _debugOwner?: Fiber;
    type: string | { displayName?: string; name: string };
};

const MENU_ID = 'rem-context-menu';

const getPath = (fiber: Fiber) => {
    if (!fiber._debugSource) {
        console.debug("Couldn't find a React instance for the element", fiber);
        return;
    }
    const {columnNumber = 1, fileName, lineNumber = 1} = fiber._debugSource;
    return fileName;
};

const getLayersForElement = (element: Element) => {
    let instance = getReactInstanceForElement(element);
    const layers: { name: string; path: string }[] = [];
    while (instance) {
        const path = getPath(instance);
        if (path) {
            const name =
                typeof instance.type === "string"
                    ? instance.type
                    : instance.type.displayName ?? instance.type.name;
            layers.push({name, path});
        }
        instance = instance._debugOwner;
    }
    return layers;
};

const getReactInstanceForElement = (element: Element): Fiber | undefined => {
    // Prefer React DevTools, which has direct access to `react-dom` for mapping `element` <=> Fiber
    if ("__REACT_DEVTOOLS_GLOBAL_HOOK__" in window) {
        const {renderers} = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
        for (const renderer of renderers.values()) {
            try {
                const fiber = renderer.findFiberByHostInstance(element);
                if (fiber) return fiber;
            } catch {
                // If React is mid-render, references to previous nodes may disappear during the click events
                // (This is especially true for interactive elements, like menus)
            }
        }
    }

    if ("_reactRootContainer" in element) {
        return (element as any)._reactRootContainer._internalRoot.current.child;
    }

    for (const key in element) {
        if (key.startsWith("__reactFiber")) return (element as any)[key];
    }
};


// const root = "__ROOT__";
let currentTarget: HTMLElement | undefined;
let hasMenu = false;

const removeMenu = () => {
    if (!hasMenu) return;
    hasMenu = false;
};

const cleanUp = () => {
    clearOverlay();
    removeMenu();
};

const clearOverlay = () => {
    if (!currentTarget) return;
    const current = document.querySelector<HTMLElement>(
        "[data-click-to-component-target]",
    );
    if (current) delete current.dataset.clickToComponentTarget;
    currentTarget = undefined;
};

export type FileType = {
    path: string, content: string
}

export type ContextMenuProps = {
    onChange?: (file: FileType) => void
}

export default function ContextMenu(props: ContextMenuProps) {

    const { onChange } = props;

    const {show} = useContextMenu({
        id: MENU_ID,
    });

    const handleItemClick: ItemProps["onClick"] = ({id}) => {
        if (id) sever.readFile(id)
    }

    useEffect(() => {
        window.addEventListener("keyup", (event) => {
            if (!event.altKey && (hasMenu || currentTarget)) cleanUp();
        });

        window.addEventListener("mousemove", (event) => {
            if (!event.altKey) {
                cleanUp();
                return;
            }
            if (hasMenu) return;
            if (!(event.target instanceof HTMLElement)) {
                clearOverlay();
                return;
            }
            if (event.target === currentTarget) return;
            clearOverlay();
            currentTarget = event.target;
            event.target.dataset.clickToComponentTarget = "true";
        });

        window.addEventListener("contextmenu", (event) => {
            if (!event.altKey) return;
            const target = event.target;
            if (!(target instanceof HTMLElement)) return;
            event.preventDefault();
            const layers = getLayersForElement(target);
            if (layers.length === 0) return;
            setItems(layers)
            show({event})
            hasMenu = true;
        });

        sever.addGetFileListener(file => {
            onChange?.(file);
        })
    }, [])

    const [items, setItems] = React.useState<{ name: string, path: string }[]>([])

    return (
        <Menu id={MENU_ID}>
            {
                items.map(item =>
                    <Item id={item.path} key={item.path} onClick={handleItemClick}>
                        <div>
                            <Tag color={"default"} className={"bg-white"}>{item.name}</Tag>
                            <span className={"text-12px"}>{item.path}</span>
                        </div>
                    </Item>)
            }
        </Menu>
    )
}