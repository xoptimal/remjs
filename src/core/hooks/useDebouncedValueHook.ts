import {useDebounce} from "ahooks";
import {useContext, useEffect, useState} from "react";
import NodeContext from '../context'

export default function useDebouncedValueHook(props: any) {

    const {stylePrefix} = props;

    const [value, setValue] = useState<any>("");

    const debouncedValue = useDebounce(value, {wait: 500});

    const {target, onChange} = useContext(NodeContext)

    useEffect(() => {
        if (target) onChange?.({[stylePrefix]: debouncedValue})
    }, [debouncedValue])

    useEffect(() => {
        setValue(target?.style[stylePrefix] || "")
    }, [target])

    const handleInput = (event: any) => {
        setValue(typeof event === "string" ? event : event.target.value)
    }
    return [value, handleInput]
}
