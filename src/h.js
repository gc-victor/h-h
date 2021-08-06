import { isNodejs } from './is-nodejs.js';
import { handler } from './handler.js';

// @see: https://github.com/preactjs/preact/blob/87202bd7dbcb5b94506f9388516a9c4bd289129a/compat/src/render.js#L149
const CAMEL_PROPS = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;

export function h(tag, attrs = {}, children = []) {
    const element =
        tag === 'svg' && !isNodejs
            ? document.createElementNS('http://www.w3.org/2000/svg', 'svg')
            : document.createElement(tag);
    const keys = Object.keys(attrs || {});
    const length = keys.length;
    const childrenLength = children.length;
    for (let i = 0; i < childrenLength; i++) {
        const c = children[i];
        if (c && tag === 'svg') {
            element.innerHTML = `${element.innerHTML}${c.outerHTML}`;
        } else {
            c && element.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
        }
    }
    for (let i = 0; i < length; i++) {
        const key = keys[i];
        if (!isNodejs) {
            if (key && /^on/.test(key)) {
                const eventType = key.toLowerCase().substring(2);
                element.__handler__ = element.__handler__ || {};
                element.__handler__[eventType] = attrs[key];
                element.addEventListener(eventType, handler);
            }
        }
        if (key && !/^key$/.test(key) && !/^on/.test(key) && !/^ref$/.test(key)) {
            const classProp = key === 'className' ? 'class' : '';
            const forProp = key === 'htmlFor' ? 'for' : '';
            const hyphenated =
                CAMEL_PROPS.test(key) && key.replace(/[A-Z0-9]/, '-$&').toLowerCase();
            if (key !== 'checked' || (key === 'checked' && attrs[key])) {
                element.setAttribute(forProp || classProp || hyphenated || key, attrs[key]);
            }
        }
        if (key && /^key$/.test(key)) {
            element.__key__ = attrs[key];
        }
    }
    return element;
}
