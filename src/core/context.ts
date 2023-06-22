import React from "react";

type NodeContextType = {
  target?: { className: string[] };
  setTarget: (id: string) => void;
  onChange: (params: {
    className: string;
    mutuallyExclusives?: string[];
  }) => void;
  onRemove: (params: {
    className: string;
    mutuallyExclusives?: string[];
  }) => void;
  onRemoveAll: (classNameList: string) => void;
  emitter?: any;
};

const NodeContext = React.createContext<NodeContextType>({
  setTarget: () => {},
  onChange: () => {},
  onRemove: () => {},
  onRemoveAll: () => {},
});

export default NodeContext;
