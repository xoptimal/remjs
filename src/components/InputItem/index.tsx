import React, {useMemo} from "react";
import {TextField} from "@mui/material";
import {ChevronDown} from 'lucide-react'
import {Dropdown} from "antd";
import useDebouncedValueHook from "@/core/hooks/useDebouncedValueHook";

type InputItemProps = {
    items?: any[]
    placeholder?: string
    stylePrefix?: string
    value?: string
}
export default function InputItem(props: InputItemProps) {

    const {placeholder, items = [], stylePrefix} = props

    const [value, handleInput] = useDebouncedValueHook({stylePrefix})

    const onSelect = ({selectedKeys}: { selectedKeys: string[] }) => {
        console.log("selectedKeys", selectedKeys)
        const key = selectedKeys[0]
    }

    const endAdornment = useMemo(() => {
        return (
            <Dropdown menu={{items, selectable: true, onSelect}}>
                <ChevronDown className={"cursor-pointer"} size={16}/>
            </Dropdown>
        )
    }, [items])

    return (
        <TextField
            size={"small"}
            label={placeholder}
            className="rem-text-field"
            value={value}
            onChange={handleInput}
            InputLabelProps={{
                shrink: value.toString().length > 0,
            }}
            InputProps={{className: "h-[30px]", endAdornment}}>
        </TextField>
    )
}