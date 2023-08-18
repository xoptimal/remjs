import {Fragment, useCallback, useState} from "react";
import {animated, config, useChain, useSpring, useSpringRef,} from '@react-spring/web'
import {useGesture} from '@use-gesture/react'
import styles from './index.module.css'
import {Tooltip} from "antd";
import ContextMenu from "@/components/ContextMenu";

const Ball: React.FC = () => {

    const [open, setOpen] = useState(false);
    const [isDragging, setDragging] = useState(false);
    const ballRef = useSpringRef()

    const getBounds = useCallback(() => {
        return {
            top: 0,
            left: 0,
            right: window.innerWidth - 64,
            bottom: window.innerHeight - 64,
        }
    }, [])

    const [lastPosition, setLastPosition] = useState({
        x: window.innerWidth - 64 - 32,
        y: window.innerHeight - 64 - 32
    })

    const [style, api] = useSpring({
        ref: ballRef,
        config: config.stiff,
        from: {
            ...lastPosition,
            width: '64px',
            height: '64px',
            background: 'hotpink',
            borderRadius: '100%',
            zIndex: open ? 9999 : 1,
        },
        to: async (next) => {
            if (open) {
                await next({
                    x: 32,
                    y: 32,
                    width: `${window.innerWidth - 64}px`,
                    height: `${window.innerHeight - 64}px`,
                    background: 'white',
                    borderRadius: '24px',
                })
            } else {
                await next({
                    ...lastPosition,
                    width: '64px',
                    height: '64px',
                    background: 'hotpink',
                    borderRadius: '999px',
                });
            }
        },
        immediate: false,
    }, [open, lastPosition]);

    const bindGestures = useGesture(
        {
            onClick: () => {
                if (isDragging) {
                    setDragging(false)
                } else {
                    setOpen(!open)
                    //showTooltip()
                }
            },
            onDrag: ({down, pinching, offset: [ox, oy], velocity: [vx, vy], direction: [dx, dy]}) => {
                if (open) return
                setLastPosition({x: ox, y: oy,})
                api.start({
                    x: ox,
                    y: oy,
                    immediate: down,
                    onChange: ({value}) => {
                        setDragging(true)
                        const bounds = getBounds()
                        if (
                            !(value.x >= bounds.left && value.x <= bounds.right && value.y >= bounds.top && value.y <= bounds.bottom)
                        ) {
                            const tempX = value.x < bounds.left ? bounds.left : value.x > bounds.right ? bounds.right : value.x;
                            const tempY = value.y < bounds.top ? bounds.top : value.y > bounds.bottom ? bounds.bottom : value.y
                            api.set({x: tempX, y: tempY})
                            setLastPosition({x: tempX, y: tempY})
                        }
                    },
                    config: key => {
                        return {
                            velocity: key === 'x' ? vx * dx : vy * dy,
                            decay: true,
                        }
                    },
                })
            },
        },
        {
            drag: {
                from: () => [style.x.get(), style.y.get()],
                bounds: getBounds,
                rubberband: true
            },
        }
    )

    const transApi = useSpringRef()
    const [transition] = useSpring({
        ref: transApi,
        immediate: true,
        from: {opacity: 0, scale: 0},
        to: {opacity: open ? 1 : 0, scale: open ? 1 : 0},
        config: config.stiff
    }, [open])

    useChain(open ? [ballRef, transApi] : [transApi, ballRef], [])

    const [tooltip, setTooltip] = useState("通过按下Alt, 选择元素鼠标右键即可激活编辑哦!")
    const [openTooltip, setOpenTooltip] = useState(false)

    const showTooltip = () => {
        setOpenTooltip(true)
        setTimeout(() => {
            setOpenTooltip(false)
        }, 1000)
    }

    const [code, setCode] = useState<string | undefined>()

    const callback = (code: string) => {
        setCode(code)
        setOpen(!open)
    }

    return <Fragment>
        <Tooltip title={tooltip} open={openTooltip}>
            <animated.div
                style={style}
                className={styles.container}
                {...bindGestures()}
            >
                <animated.div style={transition}>
                </animated.div>
            </animated.div>
        </Tooltip>
        <ContextMenu callback={callback}/>
    </Fragment>
};

export default Ball;



