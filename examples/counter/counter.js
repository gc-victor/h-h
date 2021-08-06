import { h } from '../src/h.js';
import { component } from '../src/component.js';

const c = component(({ execute, ref, props: { count } }) => {
    execute(() => {
        ref((n, p) => {
            // console.log('Ref:', { n, p });
        });
    }, [count]);

    return h('p', {}, ['Count: ' + count]);
})();

export const Counter = component(({ update }) => {
    const [count, setCount] = update(0);

    const add = (ev) => setCount(Number(ev.target.value));
    const increment = () => setCount(count() + 1);
    const decrement = () => setCount(count() - 1);

    return h('div', {}, [
        h('h1', {}, ['Counter']),
        c({ count: count() }),
        h('button', { onClick: increment }, ['+']),
        h('input', { key: 'input', type: 'number', onInput: add, value: count() }, []),
        h('button', { onClick: decrement }, ['-']),
        h('p', {}, [
            'Count:',
            h('button', { key: 'count1', onClick: increment }, [`[+] @ ${count()}`]),
            h('button', { key: 'count', onClick: decrement }, [
                h('span', {}, [`${count()} @ [-]`]),
            ]),
        ]),
    ]);
})();
