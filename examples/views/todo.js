import { component } from '../../dist/h-h.cjs.development';
import { debug } from '../utils';
import { article, button, form, h1, input, li, p, ul } from '../html';

const todoItem = component(({ created, deleted, props: { item, key } }) => {
    created(() => debug('CREATED', item));
    deleted(() => debug('DELETED', item));

    return li([item, button({ type: 'button', onClick: () => console.log(item) }, ['Click'])]);
})();

export const todoComponent = component(({ update }) => {
    const [newTodo, setNewTodo] = update('');
    const [todos, setTodo] = update([]);

    const onInput = (ev) => {
        const value = ev.target.value;

        setNewTodo(value);
    };
    const addTodo = (ev) => {
        ev.preventDefault();
        setNewTodo('');
        setTodo([...todos, newTodo]);
    };
    const clearList = (ev) => {
        ev.preventDefault();
        setTodo([]);
    };

    return article([
        h1(['TODO']),
        form({ onSubmit: addTodo }, [
            input({ type: 'text', onInput, value: newTodo }, []),
            button({ type: 'submit' }, ['Add']),
        ]),
        todos.length ? ul(todos.map((item) => todoItem({ item, key: item }))) : null,
        p([button({ onClick: clearList }, ['Clear list'])]),
    ]);
})();
