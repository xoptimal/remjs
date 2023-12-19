import { EventEmitter } from "ahooks/lib/useEventEmitter";
import React from "react";

export enum EventType {
  SYNC_ELEMENTS, //  同步elements
  CANCEL,
  SAVE,
  SELECT_TREE,
  SELECT_NODE,
  ADD_TEXT,
  SELECT,
  ACTION_RECT,
  ADD_LAYOUT,
  ADD_ELEMENT,
  INIT,
  DELETE,
  GRAB,
  ACTION_ANTDESIGN,
} 

export type EventProps<T = any> = { type: EventType;
  nodeIds?: string[];
  data?: T;
  added?: boolean;
  elements?: any;
};

export type NodeContextType = {
  target?: { className: string[]; id: string; parentId?: string, style: React.CSSProperties, position?: { x: number, y: number } };
  setTarget: (id?: string) => void;
  onChange: (
    params: {
      className?: string | string[];
      mutuallyExclusives?: string[];
      style?: any;
      text?: string;
      placeholder?: string;
    },
    targetId?: string | null,
    callback?: () => void
  ) => void;
  emitter: EventEmitter<EventProps>;
};

const NodeContext = React.createContext<NodeContextType>({
  setTarget: () => {},
  onChange: () => {},
  emitter: {} as any,
});

export default NodeContext;
