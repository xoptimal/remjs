import React from "react";

type NodeContextType = {
  target?: { className: string[] };
  setTarget: (id: string) => void;
  onChange: (params: {
    className?: string | string[];
    mutuallyExclusives?: string[];
    style?: any;
  }) => void;
  emitter?: any;
};

const NodeContext = React.createContext<NodeContextType>({
  setTarget: () => {},
  onChange: () => {},
});

export default NodeContext;
