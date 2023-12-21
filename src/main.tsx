import React, { useCallback, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import "@/index";
import Core from "@/core";
import { FileType } from "@/components/ContextMenu";
import { CanvasModal } from "@/components";
import { Button, FloatButton, Input } from "antd";
import { PiPProvider, usePiPWindow } from "@/components/PiP/PiPProvider";
import PiPWindow from "@/components/PiP/PiPWindow";

import "./global.css";

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
  const [file, setFile] = useState<FileType | undefined>();
  const [open, setOpen] = useState(false);
  const [canvasData, setCanvasData] = useState<any>();

  const onClick = () => {
    setCanvasData(null);
    setFile({
      content: `
            import React, { useState } from "react"

            import { Button, Input } from "antd";
            
            const Counter = () => {
                const [count, setCount] = useState(0);
            
                const [style, setStyle] = useState("bg-yellow")
                
                const increment = () => {
                    setCount(count + 1);
                };
            
                const decrement = () => {
                    setCount(count - 1);
                };
                
                const a1= "bg-red translate-x-[0px] translate-y-[0px]"    
            
                return (
                    <div className="w-[393px] h-[5852px] bg-[#fff] relative">
                        <h2 className={a1}>Counter, sdas qwed,qdqwnindasdian asdas</h2>
                        <p className={"bg-blue"}>{a1}=========123123=======<span>12312</span></p>
                        <button className={style} onClick={increment}>Increment</button>
                        <input placeholder="placeholder" />
                        <button onClick={decrement}>Decrement</button>
                        <div className="w-[100px] h-[100px] bg-red translate-x-[163px] translate-y-[143px]"></div>
                        <div className="w-[100px] h-[100px] bg-yellow translate-x-[40px] translate-y-[42px]"></div>
                        <Button onClick={decrement} className="absolute left-0 top-0 translate-x-[41px] translate-y-[508px]">按钮{count}</Button>
                        <Input className="absolute left-0 top-0 w-[176px] h-[26px] translate-x-[41px] translate-y-[447px]"></Input>
                        <div className="target"><a href="#about">Target1</a></div>
                    </div>
                );
            };
            
            export default Counter;

            `,
      path: "",
    });
  };

  const [className, setClassName] = useState("");

  const [value, setValue] = useState("");


  const onPressEnter = (event: any) => {
    const value = event.target.value;
    setClassName(value)
    setValue("")
  }

  return (
    <div>
<FloatButton.Group  shape="circle" style={{ right: 24 }}>
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
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
