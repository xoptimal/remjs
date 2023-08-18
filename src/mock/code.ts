export default `
import React, {useEffect, useState} from "react";

export default function sub1() {

    const value1 = "w-[100px] h-[30px] mb-1 bg-[#009eeb]";
    const value2 =  333;

    function func1 () {
        console.log("123", 123)
    }

    const fun2 = () => {
        // do something ....
    }
    
    useEffect(() => {
        console.log("sub1 init")
    }, [])

    const [style, setStyle] = useState("w-[100px] h-[30px] mb-1 bg-[#eeee88]")

    const arr = ['1', '2', '3']

    return <div className={"w-500px bg-white"}>
  
    <div className={"bg-#888888 w-100px h-100px"}>red</div>
    <div className={"bg-#ff00ff w-100px h-100px"}>yellow</div>
    <div className={"bg-#f3f3f3 w-100px h-100px"}>green</div>
    {
        arr.map(item => <div key={item} className={value1}>{item}</div>)
    }
    <div>
    {
        arr.map(item => <div key={item} className={value1}>{item}</div>)
    }
    </div>
</div>
}
`;
