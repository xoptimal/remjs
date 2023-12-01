import React, {useCallback, useState} from "react";
import ReactDOM from "react-dom/client";
import "@/index";
import Core from "@/core";
import {FileType} from "@/components/ContextMenu";
import {CanvasModal} from "@/components";
import {FloatButton} from "antd";
import {PiPProvider, usePiPWindow} from "@/components/PiP/PiPProvider";
import PiPWindow from "@/components/PiP/PiPWindow";

import './global.css'

function Example() {
    const { isSupported, requestPipWindow, pipWindow, closePipWindow } =
        usePiPWindow();

    const startPiP = useCallback(() => {
        requestPipWindow(500, 500);
    }, [requestPipWindow]);

    const [count, setCount] = useState(0);

    return (
        <div>
            {/* Make sure to have some fallback in case if API is not supported */}
            {isSupported ? (
                <>
                    <button onClick={pipWindow ? closePipWindow : startPiP}>
                        {pipWindow ? "Close PiP" : "Open PiP"}
                    </button>
                    {pipWindow && (
                        <PiPWindow pipWindow={pipWindow}>
                            <div
                                style={{
                                    flex: 1,
                                    textAlign: "center",
                                }}
                            >
                                <h3>Hello in PiP!</h3>
                                <button
                                    onClick={() => {
                                        setCount((count) => count + 1);
                                    }}
                                >
                                    Clicks count is {count}
                                </button>
                            </div>
                        </PiPWindow>
                    )}
                </>
            ) : (
                <div className="error">
                    Document Picture-in-Picture is not supported in this browser
                </div>
            )}
        </div>
    );
}


const App = () => {

    const [file, setFile] = useState<FileType|undefined>()
    const [open, setOpen] = useState(false)
    const [canvasData, setCanvasData] = useState<any>()

    const onClick = () => {
        setCanvasData(null)
        setFile({
            content: `
            import React, { useState } from 'react';

const Counter = () => {
    const [count, setCount] = useState(0);

    const [style, setStyle] = useState("bg-yellow")
    
    const increment = () => {
        setCount(count + 1);
    };

    const decrement = () => {
        setCount(count - 1);
    };
    
    const a1= "bg-red"    

    return (
        <div className="w-393px h-852px bg-white">
            <h2 className={a1}>Counter, sdas qwed,qdqwnindasdian asdas</h2>
            <p className={"bg-blue"}>{a1}=========123123=======<span>12312</span></p>
            <button className={style} onClick={increment}>Increment</button>
            <input placeholder="placeholder" />
            <button onClick={decrement}>Decrement</button>
            <div className="w-100px h-100px bg-red translate-x-55px translate-y-476px"></div>
            <div className="w-100px h-100px bg-yellow translate-x-[251px] translate-y-[40px]"></div>
        </div>
    );
};

export default Counter;
            `, path: ''
        })
    }

    return (
        <div>
            <FloatButton.Group shape="circle" style={{ right: 24 }}>
                <FloatButton onClick={onClick} />
                <FloatButton onClick={() => {
                    //setOpen(true)
                    setFile(undefined)
                    setCanvasData({width: 500, height: 500, background: '#fff'})
                }}/>
            </FloatButton.Group>
            <Core file={file} canvas={canvasData} />
            <CanvasModal open={open} onCancel={() => setOpen(false)} />
        </div>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App/>)
