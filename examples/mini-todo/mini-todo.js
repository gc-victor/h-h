import { h } from '../src/h.js';
import { component } from '../src/component.js';
import { debug } from '../utils.js';

const todoItem = component(({ cleanup, props: { item } }) => {
    cleanup(() => debug('CLEANUP', item));

    return h('li', {}, [
        `item: ${item}`,
        h('button', { type: 'button', onClick: () => console.log(item) }, ['Click']),
    ]);
})();

const child = component(({ props: { addTodo, clearList, newTodo, onInput, todos }, update }) => {
    const [ooo, setO] = update('');

    const onInputComponent = (ev) => {
        setO(ev.target.value);
        onInput(ev);
    };

    const onReset = () => {
        setO('');
        clearList();
    };

    return h('article', {}, [
        h('h1', {}, ['TODO']),
        h('form', { id: '__form__', onSubmit: addTodo, onReset }, [
            // h('input', { name:"fake", type: 'text', onInput }, []),
            h(
                'input',
                {
                    autocomplete: 'off',
                    name: 'newTodo',
                    type: 'text',
                    value: newTodo(),
                    onInput: onInputComponent,
                },
                []
            ),
            // h('input', { name:"fake2", type: 'text', onInput }, []),
            h('button', { type: 'submit' }, ['Add']),
        ]),
        newTodo() && h('p', { className: '0' }, [h('span', { className: '0' }, [newTodo()])]),
        h('p', {}, [h('span', {}, ['ooo: ' + ooo()])]),
        !newTodo() && h('p', { className: '1' }, [h('span', { className: '1' }, ['ooo'])]),
        h('p', { className: '3' }, [h('span', { className: '3' }, ['+' + newTodo()])]),
        todos().length
            ? h(
                  'ul',
                  {},
                  todos().map((item) => {
                      return todoItem({ item });
                  })
              )
            : '',
        h('p', {}, [h('button', { form: '__form__', type: 'reset' }, ['Clear list'])]),
    ]);
})();

export const MiniTodo = component(({ update }) => {
    let paragraph;

    const [newTodo, setNewTodo] = update('');
    const [todos, setTodos] = update(['ooo', 'iii']);

    const onInput = (ev) => {
        setNewTodo(ev.target.value);
    };
    const addTodo = (ev) => {
        ev.preventDefault();
        setTodos([...todos(), ev.target.newTodo.value]);
    };
    const clearList = () => {
        setNewTodo('');
        setTodos([]);
    };

    return h('div', { id: 'content' }, [
        h('p', { ref: (el) => (paragraph = el) }, [h('span', {}, ['textoooo:' + newTodo()])]),
        newTodo() && h('p', {}, [h('span', {}, ['texto:' + newTodo()])]),
        newTodo() && h('p', {}, [h('span', {}, ['---:' + newTodo()])]),
        child({ addTodo, clearList, onInput, todos, newTodo }),
        h('div', { id: '???' }, ['???' + newTodo() + '---']),
        !newTodo() &&
            h('div', { ref: (el) => (paragraph = el) }, [h('span', {}, ['telto:' + newTodo()])]),
        newTodo() &&
            h('div', { ref: (el) => (paragraph = el) }, [h('span', {}, ['xx:' + newTodo()])]),
    ]);
})();
