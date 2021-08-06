import { patch } from './patch.js';
import { isNodejs } from './is-nodejs.js';
import { queue } from './queue-microtask.js';

// Exposed for testing proposes
export const __keyCounter = { value: 1 };

const hasParent = new Set();
const contains = new Map();
const elements = new Map();
const hooks = new Map();
const componentHooksKeys = new Map();
const componentCleanup = new Map();

export function component(render) {
    return () => factory.bind(null, `__${__keyCounter.value++}__`);

    function factory(k, nextProps = {}) {
        const noop = () => {};
        const key = nextProps && nextProps.key ? nextProps.key + k : k;
        const hooksKeys = new Set();
        let element;
        let cleanup = noop;

        function update(currentHook, initialState) {
            const setState = (newState) => {
                hooks.set(currentHook, newState);
                let newElement = renderComponent();
                if (!isNodejs && element) {
                    newElement = patch(element, newElement);
                }
                element = newElement;
            };
            if (!hooks.has(currentHook)) {
                hooks.set(currentHook, initialState);
            }
            return [() => hooks.get(currentHook), setState];
        }

        function execute(currentHook, callback, newDeps) {
            const hasNoDeps = !newDeps;
            const deps = hooks.get(currentHook);
            const hasChangedDeps = deps
                ? !newDeps.every((item, i) => JSON.stringify(item) === JSON.stringify(deps[i]))
                : true;
            if (hasNoDeps || hasChangedDeps) {
                hooks.set(currentHook, newDeps);
                callback(newDeps);
            }
        }

        return (element = renderComponent());

        function renderComponent() {
            let currentHook = 0;
            let ref = {};
            const newElement = render({
                cleanup: (callback) => (cleanup = callback || cleanup),
                execute: (callback, deps) => {
                    const hook = `execute${key}${currentHook++}`;
                    hooksKeys.add(hook);
                    return execute(hook, callback, deps);
                },
                key,
                props: nextProps,
                ref: (fn) => (ref.fn = fn),
                update: (initialState) => {
                    const hook = `update${key}${currentHook++}`;
                    hooksKeys.add(hook);
                    return update(hook, initialState);
                },
            });

            const prevElement = elements.get(key);
            ref.fn && ref.fn(newElement, prevElement);

            if (!isNodejs && newElement) {
                newElement.__key__ = newElement.__key__ || key;
                elements.forEach(function (el, k) {
                    const current = contains.get(k) || [];
                    if (
                        el &&
                        !(elements.get(k) && !elements.get(k).parentNode) &&
                        newElement.contains(el) &&
                        !current.includes(key) &&
                        k !== key
                    ) {
                        contains.set(key, [...current, k]);
                        hasParent.add(k);
                    }
                });
                elements.set(key, newElement);
                componentHooksKeys.set(key, hooksKeys);
                componentCleanup.set(key, cleanup);
            } else if (elements.get(key) && !newElement) {
                queue(() => cleanup && onCleanup());
            }

            return newElement;
        }

        function onCleanup() {
            const arr = [...(contains.get(key) || [key])];
            const length = arr.length;
            for (let i = 0; i < length; i++) {
                if (elements.get(k)) {
                    const k = arr[i];
                    componentCleanup.get(k)(elements.get(k));
                    elements.set(k, 1);
                    if (!hasParent.has(k)) {
                        componentHooksKeys.get(k).forEach((h) => hooks.delete(h));
                        componentHooksKeys.delete(k);
                        elements.delete(k);
                    }
                    hasParent.delete(k);
                    contains.delete(k);
                }
            }
            cleanup = null;
            element = null;
        }
    }
}
