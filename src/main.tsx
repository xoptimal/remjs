import React, {useState} from "react";
import ReactDOM from "react-dom/client";
import mockCode from './mock/code'
import Core from "@/index";

const App = () => {
    const [code, setCode] = useState<string|undefined>()
    return (
        <div>
            <button onClick={() => setCode(mockCode)}>mock code</button>
            <Core code={code}/>
        </div>
    )
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App/>)
