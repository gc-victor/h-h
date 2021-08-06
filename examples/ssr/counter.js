import 'html-element/global-shim';

import { indexHtml } from './index-html';
import { buildPage } from './build-page';
import { Counter } from '../counter/counter';

const index = indexHtml({ content: Counter });

buildPage({
    container: index.outerHTML,
    output: 'examples/counter.html',
    init: { app: './counter/app.js' },
    stylesheet: 'https://cdn.jsdelivr.net/gh/yegor256/tacit@gh-pages/tacit-css-1.5.5.min.css',
})
    .then((fullPath) => console.log('Success: ' + fullPath + '\n'))
    .then(() => process.exit())
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
