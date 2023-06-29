export default `
import React, { Fragment, useState } from "react";

export default function sub1() {

    const value1 = "w-[100px] h-[30px] mb-1 bg-[#009eeb]";
    const value2 =  333;

    function func1 () {
        console.log("123", 123)
    }

    const fun2 = () => {
        // do something ....
    }

    const [style, setStyle] = useState("w-[100px] h-[30px] mb-1 bg-[#eeee88]")

    const arr = ['1', '2', '3']

    return <div>
    <div className="w-[400px] h-[400px] bg-[#eeee88]">12312312</div>
    {arr.map(item => <div key={item} className="w-[400px] h-[30px] mb-1 bg-[#ff4785] text-[20px] font-bold text-primary-color">REM DEMO</div>)}
</div>
}
`;
