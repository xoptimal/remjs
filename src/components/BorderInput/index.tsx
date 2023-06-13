import {Dropdown, Input} from "antd";
import React, {useContext} from "react";
import {DownOutlined} from "@ant-design/icons";
import useDebouncedValueHook from "@/core/hooks/useDebouncedValueHook";
import {cn} from "@/lib/utils";
import NodeContext from "@/core/context";

function createItems(value: string, type: string) {
    return [
        {label: `Set all to ${type}s to ${value}`, key: 'add_all'},
        {label: `Set to auto`, key: 'add_auto'},
        {label: 'Remove', key: 'remove', danger: true,},
        {label: `Remove all ${type}s`, key: 'remove_all', danger: true,},
    ]
}

const InputSelect = (props: any) => {

    const {items: itemsProps = [], renderItems, stylePrefix} = props;

    const [value, setValue] = useDebouncedValueHook(props);

    const defaultValue = '0px'

    const items = renderItems?.(value || defaultValue) || itemsProps

    const {onRemove, onRemoveAll, onChange} = useContext(NodeContext)

    const handleMenuClick = (key: string) => {
        switch (key) {
            case 'add_all': {
                if (stylePrefix.indexOf('margin') > -1) {
                    onChange({marginTop: value, marginLeft: value, marginBottom: value, marginRight: value})
                } else {
                    onChange({paddingTop: value, paddingLeft: value, paddingBottom: value, paddingRight: value})
                }
            }
                break;
            case 'add_auto':
                onChange({[stylePrefix]: '0 auto'})
                break;
            case 'remove':
                onRemove(stylePrefix)
                break;
            case 'remove_all':
                onRemoveAll(stylePrefix.indexOf('margin') > -1 ? 'margin' : 'padding')
                break;
        }
    }

    return (
        <div className={cn("flex items-center ")}>
            <Input
                size={"small"}
                value={value}
                bordered={false}
                placeholder={defaultValue}
                onFocus={event => {
                    event.stopPropagation()
                }}
                onBlur={event => {
                    event.stopPropagation()
                }}
                className={""}
                style={{
                    width: '32px',
                    fontSize: '12px',
                    flexShrink: 0,
                    color: '#333',
                    padding: 0,
                    textAlign: 'center'
                }}
                onInput={(event: any) => setValue(event.target.value)}
            />
            {
                items.length > 0 &&
                <Dropdown
                    overlayClassName={"w-[200px]"}
                    menu={{
                        items,
                        onClick: ({key}) => handleMenuClick(key),
                    }}>
                    <a><DownOutlined style={{color: '#cecece', fontSize: '10px', margin: '0 2px'}}/></a>
                </Dropdown>
            }
        </div>
    )
}


export default function BorderInput(props: any) {

    const {label, leftKey, rightKey, topKey, bottomKey} = props

    return (
        <div className="bg-[#f8fafb] w-full  border border-inherit rounded-lg p-[4px] relative">
            <div className="h-[24px] font-bold color-black text-xs absolute left-1 top-1 scale-75">{label}</div>
            <div className="flex flex-col items-center box-content">
                <div className="px-[8px] text-center">
                    <InputSelect renderItems={(value: any) => createItems(value, 'margin')} stylePrefix={topKey}/>
                </div>
                <div className="flex items-center w-full">
                    <InputSelect renderItems={(value: any) => createItems(value, 'margin')} stylePrefix={leftKey}
                                 className={"items-start justify-start"}/>
                    <div className={"flex-1"}>
                        <div
                            className="bg-[#ecf3fa] w-full h-[100px] border border-inherit relative my-[4px]">

                        </div>
                    </div>
                    <InputSelect renderItems={(value: any) => createItems(value, 'margin')}
                                 stylePrefix={rightKey}/>
                </div>
                <div className="col-span-3">
                    <InputSelect renderItems={(value: any) => createItems(value, 'margin')}
                                 stylePrefix={bottomKey}/>
                </div>
            </div>
        </div>
    )
}
