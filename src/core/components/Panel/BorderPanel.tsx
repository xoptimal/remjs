import React, {useContext, useMemo, useState} from "react";
import {Grid, IconButton, Menu, MenuItem, TextField} from "@mui/material";
import {ArrowDropDown as ArrowDropDownIcon, Transform as TransformIcon} from "@mui/icons-material";
import NodeContext from "@/core/context";
import useDebouncedValueHook from "@/core/hooks/useDebouncedValueHook";
import BorderInput from "@/components/BorderInput";

const defaultStyle = `w-5 h-5 shadow-sm ring-1 ring-slate-900/5 border-indigo-500`

const styleItems = [
    {icon: <div className={`${defaultStyle} border-2 border-solid`}/>, label: 'border-solid', value: 'border-solid'},
    {icon: <div className={`${defaultStyle} border-2 border-dashed`}/>, label: 'border-dashed', value: 'border-dashed'},
    {icon: <div className={`${defaultStyle} border-2 border-dotted`}/>, label: 'border-dotted', value: 'border-dotted'},
    {icon: <div className={`${defaultStyle} border-4 border-double`}/>, label: 'border-double', value: 'border-double'},
    {icon: <div className={`${defaultStyle} border-2 border-hidden`}/>, label: 'border-hidden', value: 'border-hidden'},
    {icon: <div className={`${defaultStyle} border-2 border-none`}/>, label: 'border-none', value: 'border-none'}
]

const widthItems = [
    {icon: <div className={`${defaultStyle} border-e-0`}/>, label: 'border-e-0', value: 'border-e-0',},
    {icon: <div className={`${defaultStyle} border-e-2`}/>, label: 'border-e-2', value: 'border-e-2',},
    {icon: <div className={`${defaultStyle} border-e-4`}/>, label: 'border-e-4', value: 'border-e-4',},
    {icon: <div className={`${defaultStyle} border-e-8`}/>, label: 'border-e-8', value: 'border-e-8',},
    {icon: <div className={`${defaultStyle} border-e`}/>, label: 'border-e', value: 'border-e',},
    {icon: <div className={`${defaultStyle} border-t-0`}/>, label: 'border-t-0', value: 'border-t-0',},
    {icon: <div className={`${defaultStyle} border-t-2`}/>, label: 'border-t-2', value: 'border-t-2',},
    {icon: <div className={`${defaultStyle} border-t-4`}/>, label: 'border-t-4', value: 'border-t-4',},
    {icon: <div className={`${defaultStyle} border-t-8`}/>, label: 'border-t-8', value: 'border-t-8',},
    {icon: <div className={`${defaultStyle} border-t`}/>, label: 'border-t', value: 'border-t',},
    {icon: <div className={`${defaultStyle} border-r-0`}/>, label: 'border-r-0', value: 'border-r-0',},
    {icon: <div className={`${defaultStyle} border-r-2`}/>, label: 'border-r-2', value: 'border-r-2',},
    {icon: <div className={`${defaultStyle} border-r-4`}/>, label: 'border-r-4', value: 'border-r-4',},
    {icon: <div className={`${defaultStyle} border-r-8`}/>, label: 'border-r-8', value: 'border-r-8',},
    {icon: <div className={`${defaultStyle} border-r`}/>, label: 'border-r', value: 'border-r',},
    {icon: <div className={`${defaultStyle} border-b-0`}/>, label: 'border-b-0', value: 'border-b-0',},
    {icon: <div className={`${defaultStyle} border-b-2`}/>, label: 'border-b-2', value: 'border-b-2',},
    {icon: <div className={`${defaultStyle} border-b-4`}/>, label: 'border-b-4', value: 'border-b-4',},
    {icon: <div className={`${defaultStyle} border-b-8`}/>, label: 'border-b-8', value: 'border-b-8',},
    {icon: <div className={`${defaultStyle} border-b`}/>, label: 'border-b', value: 'border-b',},
    {icon: <div className={`${defaultStyle} border-l-0`}/>, label: 'border-l-0', value: 'border-l-0',},
    {icon: <div className={`${defaultStyle} border-l-2`}/>, label: 'border-l-2', value: 'border-l-2',},
    {icon: <div className={`${defaultStyle} border-l-4`}/>, label: 'border-l-4', value: 'border-l-4',},
    {icon: <div className={`${defaultStyle} border-l-8`}/>, label: 'border-l-8', value: 'border-l-8',},
    {icon: <div className={`${defaultStyle} border-l`}/>, label: 'border-l', value: 'border-l',},
]

const radiusItems = [
    {icon: <div className={`${defaultStyle} bg-indigo-500 rounded`}/>, label: 'rounded', value: 'rounded'},
    {icon: <div className={`${defaultStyle} bg-indigo-500 rounded-md`}/>, label: 'rounded-md', value: 'rounded-md'},
    {icon: <div className={`${defaultStyle} bg-indigo-500 rounded-lg`}/>, label: 'rounded-lg', value: 'rounded-lg'},
    {
        icon: <div className={`${defaultStyle} bg-indigo-500 rounded-full`}/>,
        label: 'rounded-full',
        value: 'rounded-full'
    },
    {
        icon: <div className={`${defaultStyle} bg-indigo-500 rounded-t-lg`}/>,
        label: 'rounded-t-lg',
        value: 'rounded-t-lg'
    },
    {
        icon: <div className={`${defaultStyle} bg-indigo-500 rounded-r-lg`}/>,
        label: 'rounded-r-lg',
        value: 'rounded-r-lg'
    },
    {
        icon: <div className={`${defaultStyle} bg-indigo-500 rounded-b-lg`}/>,
        label: 'rounded-b-lg',
        value: 'rounded-b-lg'
    },
    {
        icon: <div className={`${defaultStyle} bg-indigo-500 rounded-l-lg`}/>,
        label: 'rounded-l-lg',
        value: 'rounded-l-lg'
    },
    {
        icon: <div className={`${defaultStyle} bg-indigo-500 rounded-tl-lg`}/>,
        label: 'rounded-tl-lg',
        value: 'rounded-tl-lg'
    },
    {
        icon: <div className={`${defaultStyle} bg-indigo-500 rounded-tr-lg`}/>,
        label: 'rounded-tr-lg',
        value: 'rounded-tr-lg'
    },
    {
        icon: <div className={`${defaultStyle} bg-indigo-500 rounded-bl-lg`}/>,
        label: 'rounded-bl-lg',
        value: 'rounded-bl-lg'
    },
    {
        icon: <div className={`${defaultStyle} bg-indigo-500 rounded-br-lg`}/>,
        label: 'rounded-br-lg',
        value: 'rounded-br-lg'
    },
    {
        icon: <div className={`${defaultStyle} bg-indigo-500 rounded-s-lg`}/>,
        label: 'rounded-s-lg',
        value: 'rounded-s-lg'
    },
    {
        icon: <div className={`${defaultStyle} bg-indigo-500 rounded-s-lg`}/>,
        label: 'rounded-s-lg',
        value: 'rounded-s-lg'
    },
    {
        icon: <div className={`${defaultStyle} bg-indigo-500 rounded-none`}/>,
        label: 'rounded-none',
        value: 'rounded-none'
    }
]


export const SelectItem = (props: any) => {

    const {placeholder, stylePrefix, items = [], xs = 6} = props

    const [currency, setCurrency] = React.useState<string>();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCurrency(event.target.value);
    };

    return (
        <Grid item xs={xs}>
            <TextField
                fullWidth
                size={"small"}
                label={placeholder}
                select
                value={currency}
                onChange={handleChange}
            >
                {items.map((option: any) => (
                    <MenuItem key={option.key} value={option.value}>
                        <div className={"flex w-full"}>
                            <div className={"flex-1"}>
                                <p className={"text-[14px]"}>{option.label}</p>
                                <p className={"text-[12px] text-[#999]"}>{option.remark}</p>
                            </div>
                            {option.icon}
                        </div>
                    </MenuItem>
                ))
                }
            </TextField>
        </Grid>
    )
}

function formatMenuItemValue(menuValue: string, targetValue: string) {

    console.log("targetValue", targetValue)

    if (targetValue?.indexOf('px') > -1) {
        const arr = menuValue.split("-")
        return arr.slice(arr.length - 1).join("-") + `-[${targetValue}]`
    }
    return menuValue;
}

const InputItem = (props: any) => {

    const {placeholder, stylePrefix, items = [], xs = 6, endAdornment} = props

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const {target, style, onRemove, onChange} = useContext(NodeContext)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = (option: any) => {
        handleClose();
    };

    const [value, setValue] = useDebouncedValueHook(props)

    const children = useMemo(() => {
        return items.map((option: any) => (
            <MenuItem key={option.value} onClick={() => handleMenuClick(option)}>
                <div className={"flex w-[240px]"}>
                    <div className={"flex-1"}>
                        <p className={"text-[14px]"}>{formatMenuItemValue(option.label, value)}</p>
                        <p className={"text-[12px] text-[#999]"}>{option.remark}</p>
                    </div>
                    {option.icon}
                </div>
            </MenuItem>
        ))
    }, [value])

    return (
        <Grid item xs={xs}>
            <TextField
                size={"small"}
                label={placeholder}
                value={value}
                onInput={setValue}
                InputProps={{
                    endAdornment: endAdornment || (
                        <IconButton size={"small"} onClick={handleClick}>
                            <ArrowDropDownIcon/>
                        </IconButton>
                    )
                }}
            >
            </TextField>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                {items.map((option: any) => (
                    <MenuItem key={option.value} onClick={() => handleMenuClick(option)}>
                        <div className={"flex w-[240px]"}>
                            <div className={"flex-1"}>
                                <p className={"text-[14px]"}>{formatMenuItemValue(option.label, value)}</p>
                                <p className={"text-[12px] text-[#999]"}>{option.remark}</p>
                            </div>
                            {option.icon}
                        </div>
                    </MenuItem>
                ))}
            </Menu>

        </Grid>
    )
}

export default function BorderPanel() {

    const [radiusVisible, setRadiusVisible] = useState(false)

    const handleRadius = () => {
        setRadiusVisible(true)
    }

    return (
        <Grid container spacing={2}>

            <SelectItem xs={12} placeholder={"Border Style"} stylePrefix={"borderStyle"} items={styleItems}/>

            <InputItem xs={radiusVisible ? 24 : 6} placeholder={"Border Width"} stylePrefix={"borderWidth"}/>

            <InputItem placeholder={"Border Radius"}
                       stylePrefix={"borderRadius"}
                       endAdornment={<IconButton size={"small"} onClick={handleRadius}>
                           <TransformIcon sx={{fontSize: 16}}/>
                       </IconButton>}/>

            <Grid item xs={12}>
                <BorderInput label={"BorderWidth"}  />
            </Grid>

        </Grid>
    )
}
