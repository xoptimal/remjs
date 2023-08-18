import React, { useContext, useRef, useState } from "react";
import { cn } from "@/utils/utils";
import NodeContext from "@/context";

type InputContainerProps = {
  style?: React.CSSProperties;
  className?: string;
  type: string; //  origin document type
  id: string;
  value?: string;
  placeholder?: string;
};

function InputContainer(props: InputContainerProps) {
  const { id, value, placeholder, className } = props;

  const [showEdit, setShowEdit] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const { onChange } = useContext(NodeContext);

  const handleDoubleClick = () => {
    setShowEdit(true);
  };

  const handleBlur = () => {
    const value = inputRef.current?.value;
    //onChange()
    setShowEdit(false);
  };

  const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <div
      key={id}
      className={cn(className, "cursor-default")}
      onDoubleClick={handleDoubleClick}
    >
      {showEdit ? (
        <input
          className={"rem-input"}
          onBlur={handleBlur}
          autoFocus
          ref={inputRef}
          onKeyDown={handleKeydown}
          placeholder={placeholder}
          defaultValue={value}
        />
      ) : (
        value || <span className={"text-[#9ca3af]"}>{placeholder}</span>
      )}
    </div>
  );
}

export default InputContainer;
