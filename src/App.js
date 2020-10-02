import React, {useState, useEffect,useRef} from "react";
import {hot} from "react-hot-loader";
import "./App.css";

const useIntervals=(callback, delay)=>{
    const savedCallback = useRef();
    
    useEffect(()=>{
        savedCallback.current=callback;
    },[])

    useEffect(()=>{
        const tick=()=>{
            savedCallback.current();
        }

        if(delay!==null){
            let id = setInterval(tick,delay);
            return()=>{
                clearInterval(id);
            }
        }
    },[delay]) 

    // 의존성을 주입하지 않으면, 해당 커스텀 훅은 실행 후 바로 clean up 된다.
        // 즉 subscription이 없으므로 , 계속 다시 새로 만드는 것이다!
        // 따라서 매우 비효율적으로 계속 setInterval이 껐다- 켜졌다 - 껐다 켜졌다 하는 것 
    // 의존성울 주입한 후 : delay가 업데이트 되야지만 커스텀 훅은 clean up된다. 
        // setInterval이 켜졌다가 ------ delay 가 업데이트 될 때까지 자기가 할 일을 하다가 ----- delay가 업데이트 되면 꺼짐
        // 이후 다시 타이머 시작
    
}

const App =()=>{
    const [delay, setDelay] = useState(1000);
    const [count, setCount]= useState(0);
    const [isRunning, setIsRunning]=useState(true);

    // isRunning이 true라면 재생, false라면 멈춤 

    useIntervals(()=>{  // 카운터 
        setCount((prev)=>prev+1);
    }, isRunning ? delay : null);

    useIntervals(()=>{ // Make Faster -- delay 감소시켜서 카운터가 증가되는 속도를 점점 더 빠르게 한다. 
        if(delay > 10 ){
            setDelay((prev)=>prev/2);
        }

    }, isRunning? 1000:null);  


    const handleReset=()=>{
        setDelay(1000);
    }

    const handleStop=()=>{
        setIsRunning((prev)=>!prev);
    }

    return(
        <>
            <h1>Counter: {count}</h1>
            <h4>Delay : {delay}</h4>
            <button onClick={handleReset}>Reset Delay</button>
            <button onClick={handleStop}>{isRunning?"Pause":"Resume"}</button>
        </>
    );
}



export default hot(module)(App);