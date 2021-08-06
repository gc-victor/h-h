import { h } from '../src/h.js';

export const info = () => {
    return h('footer', { className: 'info' }, [
        h('p', {}, [
            'Created with ',
            h('a', { href: 'https://github.com/gc-victor/h-h' }, ['h-h']),
        ]),
        h('p', {}, ['Based in ', h('a', { href: 'http://todomvc.com' }, ['TodoMVC'])]),
        h('p', { className: 'special' }, [
            h('a', { href: 'https://github.com/gc-victor/h-h' }, ['Source Code']),
        ]),
    ]);
};
