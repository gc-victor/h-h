import { h } from '../src/h.js';
import { component } from '../src/component.js';
import { isNodejs } from '../src/is-nodejs.js';
import { header } from './header.js';
import { items } from './items.js';
import { toggleAllComponent } from './toggle-all.js';
import { info } from './info.js';
import { footer } from './footer.js';

const TODOS_LOCAL_STORAGE_KEY = 'todos';
const COMPLETED_LOCAL_STORAGE_KEY = 'completed';

const todosStorage = !isNodejs && localStorage.getItem(TODOS_LOCAL_STORAGE_KEY);
const completedStorage = !isNodejs && localStorage.getItem(COMPLETED_LOCAL_STORAGE_KEY);
const storedTodos = todosStorage && JSON.parse(todosStorage);
const storedCompleted = completedStorage && JSON.parse(completedStorage);

export const TodoApp = component(({ execute, update }) => {
    const [todos, setTodos] = update(storedTodos || []);
    const [completed, setCompleted] = update(storedCompleted || []);
    const [show, setShow] = update('all');

    console.log(JSON.stringify({ todos: todos(), completed: completed() }));

    const add = (todo) => {
        setTodos([...todos(), { id: `${new Date().getTime()}`, todo }]);
    };
    const clearCompleted = () => {
        setTodos(todos().filter(({ id }) => !completed().includes(id)));
        setCompleted([]);
    };
    const edit = (t, i) => {
        setTodos(todos().map(({ id, todo }) => (id === i ? { id, todo: t } : { id, todo })));
    };
    const remove = (i) => {
        setTodos(todos().filter(({ id }) => id !== i));
        setCompleted(completed().filter((id) => id !== i));
    };
    const toggle = (ev) => {
        const id = ev.target.value;
        !completed().includes(id)
            ? setCompleted([...completed(), id])
            : setCompleted(completed().filter((i) => i !== id));
    };
    const toggleAll = () => {
        todos().length && todos().length === completed().length
            ? setCompleted([])
            : setCompleted(todos().map(({ id }) => id));
    };

    execute(() => {
        !isNodejs && localStorage.setItem(TODOS_LOCAL_STORAGE_KEY, JSON.stringify(todos() || []));
    }, [todos()]);

    execute(() => {
        !isNodejs &&
            localStorage.setItem(COMPLETED_LOCAL_STORAGE_KEY, JSON.stringify(completed() || []));
    }, [completed()]);

    return h('main', { id: 'container' }, [
        h('article', { className: 'todoapp' }, [
            header({ add }),
            h('article', { className: 'main' }, [
                toggleAllComponent({ todos, completed, toggleAll }),
                items({ todos, completed, toggle, edit, remove, show }),
                footer({ clearCompleted, completed, setShow, show, todos }),
            ]),
        ]),
        info(),
    ]);
})();
