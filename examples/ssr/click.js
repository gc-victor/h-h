import 'html-element/global-shim';

import { indexHtml } from './index-html';
import { buildPage } from './build-page';
import { ClickApp } from '../click/click';

const index = indexHtml({ content: ClickApp });

buildPage({
    container: index.outerHTML,
    output: 'examples/click.html',
    init: { app: './click/app.js' },
})
    .then((fullPath) => console.log('Success: ' + fullPath + '\n'))
    .then(() => process.exit())
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
