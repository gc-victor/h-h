import { h } from '../src/h.js';

export const toggleAllComponent = ({ todos, completed, toggleAll }) => {
    return h('div', {}, [
        h('input', {
            className: 'toggle-all',
            type: 'checkbox',
            checked: todos().length && todos().length === completed().length,
        }),
        h('label', { htmlFor: 'toggle-all', onClick: toggleAll }, [
            h('span', { className: 'sr-only' }, ['Toggle All']),
        ]),
    ]);
};
