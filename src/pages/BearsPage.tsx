import { memo } from 'react';
import { useBearStore } from './../store/useBearStore'
export default function BearsPage() {
    const bearsStore = useBearStore();
    const { bears, count, increase, decrease, reset, increaseCount } = bearsStore;
    return (
        <div>
            <h3>BearsPage</h3>
            <button onClick={() => increase()}>increase {bears}</button>
            <button onClick={() => decrease()}>decrease {bears}</button>
            <button onClick={() => reset()}>reset</button>
            <button onClick={() => increaseCount()}>count: {count}</button>
            <Child />
        </div>
    );
}
const Child = memo(() => {
    const bears = useBearStore((state: any) => state.bears, (a, b) => { return a === b; });
    console.log("child"); //sy-log
    return (
        <div>
            <h3>Child</h3>
            <p>{bears}</p>
        </div>
    );
});