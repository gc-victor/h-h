import { h as hh } from '../src/h.js';

export const fragment = '__FRAGMENT__';
export default function h(type, props, children) {
    return type !== fragment
        ? hh(type, props, arguments.length > 3 ? [].slice.call(arguments, 2) : children)
        : [].slice.call(arguments, 2);
}
