import { h as hh } from '../src/h.js';

export function h(type, props, children) {
    return hh(type, props, arguments.length > 3 ? [].slice.call(arguments, 2) : children);
}
