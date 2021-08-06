import { h } from '../src/h.js';

export const header = ({ add }) => {
    const onSubmit = (ev) => {
        ev.preventDefault();
        add(ev.target.newTodo.value);
        ev.target.newTodo.value = '';
    };

    return h('header', { className: 'header' }, [
        h('h1', {}, ['todos']),
        h('form', { onSubmit }, [
            h('label', { className: 'sr-only', for: 'new-todo' }, ['New Todo']),
            h('input', {
                className: 'new-todo',
                id: 'new-todo',
                name: 'newTodo',
                autocomplete: 'off',
                // autofocus: true,
                placeholder: 'What needs to be done?',
                type: 'text',
                value: '',
            }),
        ]),
    ]);
};
