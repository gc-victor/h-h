import { h } from '../src/h.js';
import { filter } from './filter.js';

const ESCAPE_KEY = 27;

export const items = ({ todos, completed, toggle, edit, remove, show }) => {
    console.log({ todos: todos(), completed: completed(), show: show() });

    return todos().length > 0
        ? h(
              'ul',
              { className: 'todo-list' },
              filter({ completed, show, todos }).map(({ id, todo }) => {
                  console.log({ id, todo }, completed().includes(`${id}`));

                  return h(
                      'li',
                      {
                          className:
                              show() !== 'active' && completed().includes(`${id}`)
                                  ? 'completed'
                                  : '',
                      },
                      [
                          h('div', { className: 'view' }, [
                              h('input', {
                                  id: `item-label-${id}`,
                                  key: `item-checkbox-${id}`,
                                  className: 'toggle',
                                  type: 'checkbox',
                                  onClick: toggle,
                                  checked: show() !== 'active' && completed().includes(`${id}`),
                                  value: `${id}`,
                              }),
                              h(
                                  'span',
                                  {
                                      className: 'toggle-checkbox',
                                      contenteditable: 'true',
                                      onBlur: (ev) => edit(ev.target.textContent, id),
                                      onKeyUp: (ev) =>
                                          ev.keyCode === ESCAPE_KEY &&
                                          edit(ev.target.textContent, id),
                                  },
                                  [todo]
                              ),
                              h(
                                  'label',
                                  {
                                      className: 'sr-only',
                                      htmlFor: `item-label-${id}`,
                                  },
                                  [todo]
                              ),
                              h(
                                  'button',
                                  {
                                      className: 'destroy',
                                      key: `item-remove-${id}`,
                                      id: `item-remove-${id}`,
                                      type: 'button',
                                      onClick: () => remove(id),
                                  },
                                  [
                                      h(
                                          'span',
                                          {
                                              className: 'sr-only',
                                          },
                                          ['Remove']
                                      ),
                                  ]
                              ),
                          ]),
                      ]
                  );
              })
          )
        : '';
};
