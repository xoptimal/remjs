import {Button, Col, Row} from "antd";
import React, {useContext, useEffect, useRef} from "react";
import {convertFromCssToJss, getConvertedClasses} from "@/core/utils/helpers";
import NodeContext from "@/core/context";
import InputItem from "@/components/InputItem";
import {AlignCenter, AlignLeft, AlignRight, Bold, Italic, Strikethrough, Underline} from 'lucide-react'
import ColorSelect from "@/components/ColorSelect";

type ItemType = {
    label?: string
    key?: string
    type?: string
}

const weightItems: ItemType[] = [
    {label: 'thin', key: 'font-thin'},
    {label: 'extralight', key: 'font-extralight'},
    {label: 'light', key: 'font-light'},
    {label: 'normal', key: 'font-normal'},
    {label: 'medium', key: 'font-medium'},
    {label: 'semibold', key: 'font-semibold'},
    {label: 'bold', key: 'font-bold'},
    {label: 'extrabold', key: 'font-extrabold'},
    {label: 'black', key: 'font-black'},
]

const sizeItems = [
    {label: 'xs', key: 'text-xs'},
    {label: 'sm', key: 'text-sm'},
    {label: 'base', key: 'text-base'},
    {label: 'lg', key: 'text-lg'},
    {label: 'xl', key: 'text-xl'},
    {label: '2xl', key: 'text-2xl'},
    {label: '3xl', key: 'text-3xl'},
    {label: '4xl', key: 'text-4xl'},
    {label: '5xl', key: 'text-5xl'},
    {label: '6xl', key: 'text-6xl'},
    {label: '7xl', key: 'text-7xl'},
    {label: '8xl', key: 'text-8xl'},
    {label: '9xl', key: 'text-9xl'},
]

const letterSpacingItems: ItemType[] = [
    {label: 'tighter', key: 'tracking-tighter'},
    {label: 'tight', key: 'tracking-tight'},
    {label: 'normal', key: 'tracking-normal'},
    {label: 'wide', key: 'tracking-wide'},
    {label: 'wider', key: 'tracking-wider'},
    {label: 'widest', key: 'tracking-widest'},
]

const leadingItems = [
    // {label: 'other', key: 'other'},
    // {type: 'divider'},
    {label: '3', key: 'leading-3'},
    {label: '4', key: 'leading-4'},
    {label: '5', key: 'leading-5'},
    {label: '6', key: 'leading-6'},
    {label: '7', key: 'leading-7'},
    {label: '8', key: 'leading-8'},
    {label: '9', key: 'leading-9'},
    {label: '10', key: 'leading-10'},
    {label: 'none', key: 'leading-none'},
    {label: 'tight', key: 'leading-tight'},
    {label: 'snug', key: 'leading-snug'},
    {label: 'normal', key: 'leading-normal'},
    {label: 'relaxed', key: 'leading-relaxed'},
    {label: 'loose', key: 'leading-loose'},
]

const textStyles = [
    {
        items: weightItems,
        placeholder: '粗细',
        stylePrefix: 'fontWeight',
    },
    {
        items: sizeItems,
        placeholder: '大小',
        stylePrefix: 'fontSize',
    },
    {
        items: leadingItems,
        placeholder: '行高',
        stylePrefix: 'lineHeight',
    },
    {
        items: letterSpacingItems,
        placeholder: '字间距',
        stylePrefix: 'letterSpacing',
    },
]

const fileStyles = ['textAlign']

const groupItemStyle: React.CSSProperties = {
    padding: 0,
    textAlign: "center",
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
}

export default function TextPanel() {

    const {target, onChange, onRemove} = useContext(NodeContext)

    const currentRef = useRef(-1)

    const handleEventListener = (e: KeyboardEvent) => {
        const index = currentRef.current;
        if (e.code === 'Backspace' && index > -1) {    //  按下删除键, 清空数据
            onRemove(textStyles[index].stylePrefix)
        }
    }

    useEffect(() => {
        document.addEventListener('keyup', handleEventListener)
        return () => {
            document.removeEventListener('keyup', (e) => {
            })
        }
    }, [])

    function getColor(key: string, value?: string) {
        const color = 'blue'
        if (target && target.style && target.style[key]) {
            return value ? target.style[key].indexOf(value) > -1 ? color : undefined : color
        }
        return undefined;
    }

    const handleMenuClick = (tailwindValue: string) => {
        const css = getConvertedClasses(tailwindValue)
        const cssObj = convertFromCssToJss(css)
        onChange(cssObj)
    };

    const onClickItem = (params: {
        containStyle: string,
        containStyleValue?: string,
        tailwindValue?: string,
        style?: any
    }) => {
        const {containStyle, containStyleValue, tailwindValue, style} = params;
        const findIndex = fileStyles.findIndex(find => containStyle === find)
        if (findIndex > -1) {
            if (tailwindValue) handleMenuClick(tailwindValue)
            else onChange(style)

        } else if (getColor(containStyle, containStyleValue)) {  //  当前已经有了, 执行取消
            onRemove(containStyle, containStyleValue)
        } else {
            if (tailwindValue) handleMenuClick(tailwindValue)
            else onChange(style)
        }
    }

    return (
        <Row gutter={[12, 12]}>
            {
                textStyles.map((item, index) => {
                    return <Col key={index} span={12}>
                        <InputItem placeholder={item.placeholder} items={item.items} stylePrefix={item.stylePrefix}/>
                    </Col>
                })
            }
            <Col span={24}>
                <ColorSelect/>
            </Col>

            <Col span={12}>
                <Button.Group className={"w-full"}>
                    <Button
                        style={groupItemStyle}
                        onClick={() => onClickItem({tailwindValue: 'font-bold', containStyle: 'fontWeight'})}>
                        <Bold size={16} style={{color: getColor('fontWeight', '700')}}/>
                    </Button>
                    <Button
                        style={groupItemStyle}
                        onClick={() => onClickItem({
                            style: {fontStyle: 'oblique'},
                            containStyle: 'fontStyle',
                            containStyleValue: 'oblique'
                        })}>
                        <Italic size={16} style={{color: getColor('fontStyle', 'oblique')}}/>
                    </Button>
                    <Button
                        style={groupItemStyle}
                        onClick={() => onClickItem({
                            style: {textDecoration: 'underline'},
                            containStyle: 'textDecoration',
                            containStyleValue: 'underline'
                        })}>
                        <Underline size={16} style={{color: getColor('textDecoration', 'underline')}}/>
                    </Button>
                    <Button
                        style={groupItemStyle}
                        onClick={() => onClickItem({
                            style: {textDecoration: 'line-through'},
                            containStyle: 'textDecoration',
                            containStyleValue: 'line-through'
                        })}>
                        <Strikethrough size={16} style={{color: getColor('textDecoration', 'line-through')}}/>
                    </Button>
                </Button.Group>
            </Col>

            <Col span={12}>
                <Button.Group className={"w-full"}>
                    <Button
                        style={groupItemStyle}
                        onClick={() => onClickItem({
                            style: {textAlign: 'left'},
                            containStyle: 'textAlign',
                        })}>
                        <AlignLeft size={16}
                                   style={{color: getColor('textAlign', 'left')}}/>
                    </Button>
                    <Button
                        style={groupItemStyle}
                        onClick={() => onClickItem({
                            style: {textAlign: 'center'},
                            containStyle: 'textAlign',
                        })}>
                        <AlignCenter size={16}
                                     style={{color: getColor('textAlign', 'center')}}/>
                    </Button>
                    <Button
                        style={groupItemStyle}
                        onClick={() => onClickItem({
                            style: {textAlign: 'right'},
                            containStyle: 'textAlign',
                        })}>
                        <AlignRight size={16}
                                    style={{color: getColor('textAlign', 'right')}}/>
                    </Button>
                </Button.Group>
            </Col>
        </Row>
    )

}
