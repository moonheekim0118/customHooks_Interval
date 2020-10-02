# Custom hooks SetInterval practice

 [Dan's post about setInterval & React Hooks](https://overreacted.io/making-setinterval-declarative-with-react-hooks/) 포스팅을 통해 공부한 내용을 정리했습니다
<br/>
## Counter와 Make Faster의 역할

- Counter
  - setInterval로 delay.ms에 한번씩, count state를 증가시킨다.
- Make Faster
  - setInterval로 1초에 한번씩 Counter에 전달될 delay를 반으로 줄인다. 

<br/>



## useEffect와 의존성 주입

- **아무것도 주입하지 않는 경우**
  - 렌더링 될때마다 useEffect가 실행된다 (`return문 까지 실행한다`) . setInterval의 경우 계속 새로운 setInterval이 생성-소멸되어서 성능에 치명적이다.
- **빈껍데기 주입  [  ]**
  - 첫 렌더링에만 실행되고 (`return문은 실행하지 않는다`) 그 후로 컴포넌트가 언마운트 될 때까지는 실행되지 않는다.
- **특정 변수 주입 [ value ]**
  - 해당 value가 변경될 때만 실행된다. (`return문 까지 실행한다`) setInterval의 경우 value 가 변경되었을 경우에만 setInterval이 새로 소멸 - 재생성 된다. 


<br/>


## setInterval을 customHook으로 분리

- 동적으로 콜백 함수와 delay 파라미터를 전달해줄 수 있다.

```javascript
const useIntervals=(callback, delay)=>{
    const savedCallback = useRef();
    
    useEffect(()=>{
        savedCallback.current=callback;
    })

    useEffect(()=>{ // delay가 변경될 경우에만 소멸-재생성 되고, 변경되지 않을경우 계속 setInterval이 유지된다.
        const tick=()=>{
            savedCallback.current();
        }

        if(delay!==null){ // delay === null 은 pause 의 경우 
            let id = setInterval(tick,delay);
            return()=>{
                clearInterval(id);
            }
        }
    },[delay]) 
}
```
<br/>

### **인자로 받아온 콜백함수를 useRef에 저장하는 이유**

   - React Hooks는 이전 렌더를 잊지만, setInterval은 이전 상태에 관한 정보를 우리가 대체할 때 까지 가지고 있다. 따라서 , 우리는 setInterval(callback1,delay)를 첫번째 렌더링에 하고, 추후에 callback2로 대체 시켜야 한다. 이러려면 시간 자체를 리셋해야하는데 이렇게 되면 setInterval 자체가 변경된다.
   <br/>
   
   - setInterval 자체를 변경하지 않고, setInterval에 넘겨진 callback 함수만 변경시켜주기 위해서 ref 를 사용한다. 즉, callback함수를 렌더 사이(렌더-리렌더)에서 사라지지 않고 `지속적으로 저장할 공간이 바로 ref`인 것이다. 
   <br/>
   
   - ref는 **가변한(mutable) 변수이기 때문에 가능**하다. ( .current 로 접근하므로 직접적으로 데이터 영역의 주소가 변경되는 것이 아니다)

   <br/>

### **두번째 useEffect에 의존성 주입하는 이유**

   - 의존성 자체를 주입하지 않으면 setInterval이 계속 새로 생성된다. 
   <br/>
   
   - Counter 자체는 똑같이 동작하지만 setInterval 두개가 지속적으로 생성-소멸되기 때문에 성능에 매우 좋지 않고 이상한 결과값을 도출한다.
   <br/>
   
   - 따라서 의존성을 주입하여, **해당 변수가 변경될 경우에만 소멸-재생성 하도록 설계**한다.
   <br/>
   
   - 여기서는 또한, Make Faster 에 의해서 delay가 지속적으로 변경되므로 변경 사항을 setInterval에 반영시켜줘야 한다. 
     - 만약 빈껍데기 [ ] 의존성을 주입시켜주면, 성능은 상관 없지만 delay 가 변경되어도 ,setInterval이 delay 가 변경된대로 동작하지 않고, 처음 받은 delay를 계속 유지한다.



<br/>

### **첫번째 useEffect에는 의존성을 주입하지 않아도 되는 이유**

   - [callback] 으로 의존성을 주입해줘도 되지만, callback은 함수, 결국 객체이기 때문에 `같은 함수를 넣어도 매번 변경 된다고 판단한다`. 따라서 의존성을 주입하지 않는 것과 callback을 주입하는 것은 결국 같은 결과를 도출한다 
   <br/>
   
   -  [] 을 의존성으로 주입한다면, 리렌더링 될 때마다 콜백함수를 지속적으로 변경 할 수 없으므로 제대로 동작하지 않는다 

<br/>



참고 [React official docs about useEffect fires](https://reactjs.org/docs/hooks-reference.html#cleaning-up-an-effect)
