import { h } from '../src';
import { INIT, IMPORT_VIEW, STYLESHEET } from './constants';

export const indexHtml = ({ content }) =>
    h('html', { lang: 'en' }, [
        h('head', {}, [
            h('meta', { charset: 'UTF-8' }),
            h('meta', {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1.0',
            }),
            h('meta', { 'http-equiv': 'Content-Type', content: 'text/html' }),
            h('title', {}, ['h-h']),
            h('meta', {
                name: 'description',
                content: 'Tu takeaway de proximidad',
            }),
            h('meta', {
                name: 'keywords',
                content: 'restaurante, takeaway, para llevar, recoger, comida, menú del día',
            }),
            h('link', { rel: 'stylesheet', href: `${STYLESHEET}` }),
        ]),
        h('body', null, [
            h('div', { id: 'app' }, [content()]),
            // https://github.com/guybedford/es-module-shims#skip-processing
            h('script', {}, [
                'window.esmsInitOptions = {skip: /^https?:\\/\\/(cdn\\.jsdelivr\\.net)\\//};',
            ]),
            h(
                'script',
                {
                    async: '',
                    src:
                        'https://cdn.jsdelivr.net/npm/es-module-shims@0.10.1/dist/es-module-shims.js',
                },
                ['']
            ),
            h(
                'script',
                {
                    type: 'importmap',
                },
                [
                    `
                        {
                            "imports": {
                                ${IMPORT_VIEW}
                            }
                        }
                    `,
                ]
            ),
            h('script', { type: 'module' }, [INIT]),
        ]),
    ]);
