import { h } from '../src/h.js';
import { filter } from './filter.js';

export const footer = ({ todos, clearCompleted, completed, setShow, show }) => {
    return todos().length > 0
        ? h('footer', { className: 'footer' }, [
              h('span', { className: 'todo-count' }, [
                  `${filter({ completed, show, todos }).length} items left`,
              ]),
              h('ul', { className: 'filters' }, [
                  h('li', {}, [h('a', { onClick: () => setShow('all') }, ['All'])]),
                  h('li', {}, [h('a', { onClick: () => setShow('active') }, ['Active'])]),
                  h('li', {}, [h('a', { onClick: () => setShow('completed') }, ['Completed'])]),
              ]),
              h(
                  'button',
                  {
                      className: 'clear-completed',
                      onClick: clearCompleted,
                  },
                  ['Clear completed']
              ),
          ])
        : '';
};
