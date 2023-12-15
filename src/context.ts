import { EventEmitter } from "ahooks/lib/useEventEmitter";
import React from "react";

export enum EventType {
  SYNC_ELEMENTS, //  同步elements
  CANCEL,
  SAVE,
  SELECT_TREE,
  SELECT_NODE,
  ACTION_TEXT,
  ACTION_MOVE,
  ACTION_RECT,
  ADD_REACT,
  ADD_EXTENSION_ELEMENT,
  INIT,
  DELETE,
  GRAB,
} export type EventProps<T = any> = { type: EventType;
  nodeIds?: React.Key[];
  data?: T;
  added?: boolean;
  elements?: any;
};

export type NodeContextType = {
  target?: { className: string[]; id: string; parentId?: string, style: React.CSSProperties };
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
