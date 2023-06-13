import React, {useContext, useRef} from "react";
import {ColumnHeightOutlined, ColumnWidthOutlined} from "@ant-design/icons";
import NodeContext from "@/core/context";
import {convertFromCssToJss, getConvertedClasses} from "@/core/utils/helpers";
import {Grid, IconButton, Menu, MenuItem, TextField} from "@mui/material";

import {
    AlignCenterHorizontal,
    AlignCenterVertical,
    AlignEndHorizontal,
    AlignEndVertical,
    AlignHorizontalJustifyCenter, AlignHorizontalJustifyEnd,
    AlignHorizontalJustifyStart,
    AlignStartHorizontal
} from 'lucide-react'

import {
    ArrowDropDown as ArrowDropDownIcon,
    FormatAlignCenter as FormatAlignCenterIcon,
    FormatAlignJustify as FormatAlignJustifyIcon,
    FormatAlignLeft as FormatAlignLeftIcon,
    FormatAlignRight as FormatAlignRightIcon
} from '@mui/icons-material';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {Button} from "antd";

const widthItems = [
    {
        value: 'fill',
        label: 'Fill',
        remark: '宽度设为100%',
    },
    {
        value: 'stretch',
        label: 'Stretch',
        remark: '宽度设为auto',
    },
    {
        value: 'shrink',
        label: 'Shrink',
        remark: '宽度设为fit-content',
    },
    {
        value: 'full-page-width',
        label: 'Full page width',
        remark: '宽度设为页面大小(100vw)',
    },
    {
        value: 'remove',
        label: 'Remove',
        remark: '删除样式',
    },
];

const heightItems = [
    {
        value: 'fill',
        label: 'Fill',
        remark: '高度设为100%',
    },
    {
        value: 'stretch',
        label: 'Stretch',
        remark: '高度设为auto',
    },
    {
        value: 'shrink',
        label: 'Shrink',
        remark: '高度设为fit-content',
    },
    {
        value: 'full-page-width',
        label: 'Full page width',
        remark: '高度设为页面大小(100vh)',
    },
    {
        value: 'remove',
        label: 'Remove',
        remark: '删除样式',
    },
];

const textStyles: any[] = [
    {
        items: widthItems,
        placeholder: 'WIDTH',
        stylePrefix: 'fontWeight',
        icon: <ColumnWidthOutlined className={"text-base mr-2"}/>
    },
    {
        items: heightItems,
        placeholder: 'HEIGHT',
        stylePrefix: 'fontSize',
        icon: <ColumnHeightOutlined className={"text-base mr-2"}/>
    },
    {
        items: widthItems,
        placeholder: 'MAX WIDTH',
        stylePrefix: 'lineHeight',
        icon: <ColumnWidthOutlined className={"text-base mr-2"}/>
    },
    {
        items: heightItems,
        placeholder: 'MAX HEIGHT',
        stylePrefix: 'letterSpacing',
        icon: <ColumnHeightOutlined className={"text-base mr-2"}/>
    },
    {
        items: widthItems,
        placeholder: 'MIN WIDTH',
        stylePrefix: 'lineHeight',
        icon: <ColumnWidthOutlined className={"text-base mr-2"}/>
    },
    {
        items: heightItems,
        placeholder: 'MIN HEIGHT',
        stylePrefix: 'letterSpacing',
        icon: <ColumnHeightOutlined className={"text-base mr-2"}/>
    },
]


export const InputItem = (props: any) => {

    const {placeholder, stylePrefix, items = [], xs = 6} = props.data

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuClick = (option: any) => {
        handleClose();
    };

    return (
        <Grid item xs={6}>
            <TextField
                size={"small"}
                label={placeholder}
                className="rem-text-field"
                InputProps={{
                    className: "h-[30px]",
                    endAdornment: <IconButton
                        size={"small"}
                        onClick={handleClick}>
                        <ArrowDropDownIcon/>
                    </IconButton>
                }}
            >
            </TextField>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {items.map((option: any) => (
                    <MenuItem key={option.value} onClick={() => handleMenuClick(option)}>
                        <div className={"flex w-[240px]"}>
                            <div className={"flex-1"}>
                                <p className={"text-[14px]"}>{option.label}</p>
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


function ToggleButtons() {

    const [alignment, setAlignment] = React.useState<string | null>('left');

    const handleAlignment = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string | null,
    ) => {
        setAlignment(newAlignment);
    };

    return (
        <Button.Group className={"w-full"}>
            <Button className={"flex-1"}><AlignStartHorizontal size={16}/></Button>
            <Button className={"flex-1"}><AlignCenterHorizontal size={16}/></Button>
            <Button className={"flex-1"}><AlignEndHorizontal size={16}/></Button>
            <Button className={"flex-1"}><AlignHorizontalJustifyStart size={16}/></Button>
            <Button className={"flex-1"}><AlignCenterVertical size={16}/></Button>
            <Button className={"flex-1"}><AlignHorizontalJustifyEnd size={16}/></Button>
        </Button.Group>
    );
}

export default function LayoutPanel() {

    const {target, onRemove, onChange} = useContext(NodeContext)

    const currentRef = useRef(-1)

    const handleInput = (index: number, event: React.FormEvent<HTMLInputElement>) => {
        // @ts-ignore
        onChangeTarget({[textStyles[index].stylePrefix]: `${event.target.value}`})
    }

    const handleMenuClick = (tailwindValue: string) => {
        const css = getConvertedClasses(tailwindValue)
        const cssObj = convertFromCssToJss(css)
        onChange(cssObj)
    };

    return <Grid container spacing={1.5}>
        <Grid item xs={12}>
            <ToggleButtons/>
        </Grid>
        {
            textStyles.map((item, index) => {
                return <InputItem key={item.key} data={item}/>
            })
        }
    </Grid>

}
