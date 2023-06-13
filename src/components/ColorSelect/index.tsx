import React from "react";
import {Button, ColorPicker, Dropdown, Input} from "antd";
import {ChevronDown} from "lucide-react";
import useDebouncedValueHook from "@/core/hooks/useDebouncedValueHook";

export default function ColorSelect(props: any) {

    const {items = []} = props;

    const [value, handleInput] = useDebouncedValueHook({stylePrefix: 'color'})


    return <Button className={"p-0 pr-[14px] w-full flex items-center justify-between"}>
        <ColorPicker value={value} onChange={(value, hex) => handleInput(hex)}>
            <div className={"flex"}>
                <div className={`w-[77px] h-[30px] rounded-l-[6px]`}
                     style={{backgroundColor: value || '#000'}}/>
                <Input bordered={false} value={value} onChange={handleInput} className={"flex-1"}
                       placeholder={"选择颜色"}/>
            </div>
        </ColorPicker>
        {items?.length > 0 ? <Dropdown menu={{items, selectable: true}}>
            <ChevronDown className={"cursor-pointer w-[12.96px]"} size={16}/>
        </Dropdown> : ''}
    </Button>
}
