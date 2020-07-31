import { componentFactory } from './component.factory';
import { Props, Render } from './component.types';

let keyCounter = 1;

const keyGenerator = () => {
    return `__${keyCounter++}__`;
};

const contains = new Map();
const elements = new Map();
const hooks = new Map();

const onDelete = (key: string) => {
    (contains.get(key) || []).forEach((k: string) => {
        const containedElement = elements.get(k);

        if (containedElement) {
            containedElement.__deleted(containedElement);
            containedElement.__hooks.forEach((h: string) => hooks.delete(h));
        }

        contains.delete(k);
        elements.delete(k);
    });
};

const setChildren = (element: Element, key: string) => {
    // Set children and itself
    elements.forEach((_, k) => {
        const domElement = elements.get(k);

        if (domElement && domElement.contains(element)) {
            contains.set(k, [...(contains.get(k) || []), key]);
        }
    });
};

const onCreate = (key: string, element: Element) => {
    elements.set(key, element);
    setChildren(element, key);
};

export function component(render: Render) {
    function factory(key: string, newProps?: Props) {
        const _key = newProps && newProps.key ? newProps.key + key : key;

        return componentFactory({
            hooks,
            key: _key,
            newProps: newProps || {},
            onCreate,
            onDelete,
            render,
        });
    }

    function init() {
        return factory.bind(null, keyGenerator());
    }

    return init;
}
