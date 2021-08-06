import 'html-element/global-shim';

import { indexHtml } from './index-html';
import { buildPage } from './build-page';
import { h } from '../src/h';
import { MiniTodo } from '../mini-todo/mini-todo';

const index = indexHtml({
    content: () => h('div', { class: 'sans-serif mh5 mt5 mw7' }, [MiniTodo()]),
});

buildPage({
    container: index.outerHTML,
    output: 'examples/index.html',
    init: { 'mini-todo': './mini-todo/app.js' },
    stylesheet: 'https://unpkg.com/tachyons@4.12.0/css/tachyons.css',
})
    .then((fullPath) => console.log('Success: ' + fullPath + '\n'))
    .then(() => process.exit())
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
