import 'html-element/global-shim';

import { indexHtml } from './index-html';
import { buildPage } from './build-page';
import { TodoApp } from '../todo/todo';

const index = indexHtml({ content: TodoApp });

buildPage({
    container: index.outerHTML,
    output: 'examples/todo.html',
    init: { todo: './todo/app.js' },
    // @see: https://github.com/fabiospampinato/css-simple-minifier/blob/master/src/index.ts#L6
    stylesheet: './todo/style.css',
})
    .then((fullPath) => console.log('Success: ' + fullPath + '\n'))
    .then(() => process.exit())
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
