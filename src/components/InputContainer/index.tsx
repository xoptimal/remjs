import React, {KeyboardEventHandler, useContext, useEffect, useState} from "react";
import NodeContext from "@/context";
import {Form, Input, Popover} from "antd";

type InputContainerProps = {
    style?: React.CSSProperties;
    className?: string;
    type: string; //  origin document type
    id: string;
    text?: string;
    isFormElement?: boolean;
};

function InputContainer(props: React.PropsWithChildren<InputContainerProps>) {

    const {id, text, isFormElement, className, children, style} = props;

    const {target, onChange} = useContext(NodeContext);

    const [open, setOpen] = useState(false);

    const onDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation();
        if (target && target.id === id) setOpen(!open);
    }

    useEffect(() => {
        if ((!target && open) || (target && target.id !== id)) setOpen(false)
    }, [target])

    const onPressEnter: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
        const text = (event.target as HTMLTextAreaElement).value
        setOpen(false);
        onChange({text}, id)
    }

    const onBlur = () => {
        setOpen(false);
    }

    const cloneElementProps: any = {
        key: id,
        onDoubleClick,
        className,
        style,
        onClick: () => {
            console.log('11233333');
            
        }
    }

    if (isFormElement) {
        cloneElementProps.placeholder = text;
    } else {
        cloneElementProps.children = text;
    }

    return <Popover
        open={open}
        trigger={"click"}
        title={`Edit ${isFormElement ? 'Placeholder' : 'InnerText'}`}
        content={open && (
            <Input.TextArea className={"w-500px"} autoSize={{minRows: 4, maxRows: 6}} defaultValue={text} onPressEnter={onPressEnter} onBlur={onBlur}/>
        )}
    >
        {React.cloneElement(children as React.ReactElement, cloneElementProps)}
    </Popover>
}

export default InputContainer;
