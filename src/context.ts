import { EventEmitter } from "ahooks/lib/useEventEmitter";
import React from "react";

export enum EventType {

  //  初始化内容
  INIT,

  //  同步elements(结合SAVE使用)
  SYNC_ELEMENTS,
  
  //  保存
  SAVE,

  //  取消
  CANCEL,

  //  默认
  DEFAULT,

  //  绘制
  PAINTING,

  //  添加元素
  ADD_ELEMENT,

  //  删除元素
  DEL_ELEMENT,

  //  选择元素
  SEL_ELEMENT,

  //  从树中选择元素
  SEL_ELELEMT_TO_TREE,

  // 待定
  ADD_LAYOUT,

  //  预览
  PREVIEW
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
  isPreview: boolean
};

const NodeContext = React.createContext<NodeContextType>({
  setTarget: () => {},
  onChange: () => {},
  emitter: {} as any,
  isPreview: false
});

export default NodeContext;
