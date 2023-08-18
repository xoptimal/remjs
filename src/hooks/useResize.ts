import {useEffect, useState} from "react";

export default function useResize() {

    const [size, setSize] = useState({width: 0, height: 0})

    function resize() {
        const dom = document.querySelector('body')
        const width = (dom?.clientWidth || 0) - 64 * 2;
        const height = (dom?.clientHeight || 0) - 64 * 3;
        setSize({width, height})
    }

    useEffect(() => {
        resize();
        window.addEventListener("resize", (ev) => {
            resize();
        });

        return () => {
            window.removeEventListener("resize", () => {
            });
        };
    }, []);

    console.log("size", size)

    return size;
}

