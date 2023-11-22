import React from "react";
import {EventEmitter} from "ahooks/lib/useEventEmitter";

export enum EventType {
  CANCEL, SAVE, SELECT_TREE, SELECT_NODE,ACTION_TEXT, ACTION_MOVE, ACTION_RECT, ADD_REACT, INIT
}

export type EventProps <T=any> = {
  type: EventType
  nodeIds?: React.Key[]
  data?: T
  added?: boolean
}

export type NodeContextType = {
  target?: { className: string[], id: string, parentId?: string };
  setTarget: (id?: string) => void;
  onChange: (params: {
    className?: string | string[];
    mutuallyExclusives?: string[];
    style?: any;
    text?: string
    placeholder?: string
  }, targetId?: string) => void;
  emitter: EventEmitter<EventProps>
};

const NodeContext = React.createContext<NodeContextType>({
  setTarget: () => {},
  onChange: () => {},
  emitter:  {} as any,
});

export default NodeContext;
