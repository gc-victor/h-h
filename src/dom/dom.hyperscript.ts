import {
    attrIDom,
    elementCloseIDom,
    elementOpenEndIDom,
    elementOpenStartIDom,
    skipIDom,
    textIDom,
} from './dom.incremental-dom';
import { HTMLElements, HTMLElementsAttributes, HyperScriptNode } from './dom.types';

// @see: https://github.com/preactjs/preact/blob/87202bd7dbcb5b94506f9388516a9c4bd289129a/compat/src/render.js#L10
const CAMEL_PROPS = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|fill|flood|font|glyph(?!R)|horiz|marker(?!H|W|U)|overline|paint|stop|strikethrough|stroke|text(?!L)|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;

export function h<T extends HTMLElements>(
    tagName: T,
    attributes: HTMLElementsAttributes[T],
    children: any[]
) {
    const attrs = attributes || {};
    const outerArgs = arguments;
    const names = Object.keys(attrs);
    const length = names.length;

    function render(
        options: {
            skip: boolean;
            key?: string;
            elementAttached?: Function;
            elementDetached?: Function;
        } = { skip: false }
    ) {
        let element;

        const elementAttached = attrs.elementAttached || options.elementAttached;
        const elementDetached = attrs.elementDetached || options.elementDetached;
        const key = attrs.key || options.key || null;
        const skip = attrs.skip || options.skip || null;

        elementOpenStartIDom(tagName, key);
        setAttributes({ attributes: attrs, names, length });
        elementOpenEndIDom();

        if (skip) {
            skipIDom();

            element = elementCloseIDom(tagName);
        } else {
            if (Array.isArray(children)) {
                children.forEach(renderChildren);
            } else {
                forEachChildInArgs(outerArgs, renderChildren);
            }

            element = elementCloseIDom(tagName) || {};

            element._elementAttached = elementAttached;
            element._elementDetached = elementDetached;

            if (typeof window !== 'undefined') {
                setEvents({ attributes: attrs, names, length, element });
            }

            if (typeof attrs.ref === 'function') {
                attrs.ref(element);
            }
        }

        return element;
    }

    return render;
}

function isEvent(name: string): boolean {
    return /^on/.test(name);
}

function isSkip(name: string): boolean {
    return /^skip$/.test(name);
}

function isRef(name: string): boolean {
    return /^ref$/.test(name);
}

function setAttributes({
    attributes,
    names,
    length,
}: {
    attributes: any;
    names: Array<string>;
    length: number;
}): void {
    for (let i = 0; i < length; i++) {
        const name = names[i];

        if (name && !isEvent(name) && !isSkip(name) && !isRef(name)) {
            const classProp = name === 'className' ? 'class' : '';
            const forProp = name === 'htmlFor' ? 'for' : '';
            // @see: https://github.com/preactjs/preact/blob/87202bd7dbcb5b94506f9388516a9c4bd289129a/compat/src/render.js#L149
            const hyphenated =
                CAMEL_PROPS.test(name) && name.replace(/[A-Z0-9]/, '-$&').toLowerCase();

            attrIDom(forProp || classProp || hyphenated || name, attributes[name]);
        }
    }
}

function setEvents({
    attributes,
    names,
    length,
    element,
}: {
    attributes: any;
    names: Array<string>;
    length: number;
    element: HyperScriptNode;
}): void {
    for (let i = 0; i < length; i++) {
        const name = names[i];

        if (name && isEvent(name)) {
            const eventName = name.toLowerCase().substring(2);

            element._listeners = element._listeners || {};

            if (!element._listeners[eventName]) {
                element.addEventListener(eventName, eventProxy, false);
            }

            element._listeners[eventName] = attributes[name];
        }
    }
}

function eventProxy(event: Event) {
    return (event.currentTarget as HyperScriptNode)._listeners[event.type](event);
}

function forEachChildInArgs(args: IArguments, iteratee: Function) {
    if (args.length > 2) {
        for (let i = 2; i < args.length; i++) {
            iteratee(args[i]);
        }
    }
}

function renderChildren(children: Function | string | void) {
    const str = typeof children === 'string' ? textIDom(children) : '';

    return typeof children === 'function' ? children() : str;
}
