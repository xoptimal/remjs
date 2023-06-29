import React from "react";

type NodeContextType = {
  target?: { className: string[] };
  setTarget: (id: string) => void;
  onChange: (params: {
    className?: string | string[];
    mutuallyExclusives?: string[];
  }) => void;
  emitter?: any;
};

const NodeContext = React.createContext<NodeContextType>({
  setTarget: () => {},
  onChange: () => {},
});

export default NodeContext;
