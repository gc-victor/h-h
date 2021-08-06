import 'html-element/global-shim';

import { indexHtml } from './index-html';
import { buildPage } from './build-page';
import { TimerApp } from '../timer/timer';

const index = indexHtml({ content: TimerApp });

buildPage({
    container: index.outerHTML,
    output: 'examples/timer.html',
    init: { app: './timer/app.js' },
})
    .then((fullPath) => console.log('Success: ' + fullPath + '\n'))
    .then(() => process.exit())
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
