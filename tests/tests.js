import { expect, test as t, window } from 't-t';
import jsdom from 'jsdom';
import { app, component, h } from '../src';
import { router } from '../src/router';
import { __keyCounter } from '../src/component';
import { doubleTree } from '../src/patch';
import { patchTrees } from '../src/patch-trees';

const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><body><div id="app"><p>Hello world!</p></div></body>`, {
    url: 'https://h-h.h/',
});
window('window', dom.window);
window('document', dom.window.document);

const test = t;
// const only = t;
// const test = () => {};

test('should render a template', () => {
    expect(
        h('div', {}, [
            h('p', { className: 'test' }, [
                h('span', { className: 's-test' }, ['test', 'test', h('span', {}, ['test'])]),
            ]),
        ]).outerHTML
    ).toBe('<div><p class="test"><span class="s-test">testtest<span>test</span></span></p></div>');
});

test('should render the attributes', () => {
    expect(
        h('label', { htmlFor: 'test' }, [h('input', { checked: 'checked', type: 'checkbox' }, [])])
            .outerHTML
    ).toBe('<label for="test"><input checked="checked" type="checkbox"></label>');
});

test('should not render the attribute checked if is false', () => {
    expect(
        h('label', { htmlFor: 'test' }, [h('input', { checked: false, type: 'checkbox' }, [])])
            .outerHTML
    ).toBe('<label for="test"><input type="checkbox"></label>');
});

test('should rename the attribute htmlFor to for', () => {
    expect(h('label', { htmlFor: 'test' }, [h('input', { type: 'checkbox' }, [])]).outerHTML).toBe(
        '<label for="test"><input type="checkbox"></label>'
    );
});

test('should rename the attribute className to class', () => {
    expect(h('div', {}, [h('p', { className: 'test' }, ['test'])]).outerHTML).toBe(
        '<div><p class="test">test</p></div>'
    );
});

test('should set the events and handlers', () => {
    expect(typeof h('button', { onClick: () => {} }, ['test']).__handler__.click).toBe('function');
});

test('should set key to the element object', () => {
    expect(h('p', { key: 'key-test' }, ['test']).__key__).toBe('key-test');
});

test('should throw an error if the children is null', () => {
    expect(() => h('p', {}, null).outerHTML).throws(
        new TypeError("Cannot read property 'length' of null")
    );
});

test('should not throw an error if the children is an empty string, false or zero', () => {
    expect(h('p', {}, '').outerHTML).toBe('<p></p>');
    expect(h('p', {}, false).outerHTML).toBe('<p></p>');
    expect(h('p', {}, 0).outerHTML).toBe('<p></p>');
});

test('should initialize the app', () => {
    app(document.getElementById('app'), h('div', { id: 'app' }, [h('p', {}, ['Hello Paco!'])]));
    expect(document.getElementById('app').outerHTML).toBe('<div id="app"><p>Hello Paco!</p></div>');
});

test('should initialize a component', () => {
    expect(
        component(() => {
            return h('p', { className: 'test' }, ['test']);
        })()().outerHTML
    ).toBe('<p class="test">test</p>');
});

test('should run the execute method once if the array is empty', () => {
    let onlyOnce = 0;
    const c = component(({ execute }) => {
        execute(() => onlyOnce++, []);
    })();
    c();
    c();
    c();
    c();
    expect(onlyOnce).toBe(1);
});

test('should run the execute method each time the array changes', () => {
    let variable = 0;
    const c = component(({ execute, props: { count } }) => {
        execute(() => variable++, [count]);
    })();
    c({ count: 1 });
    c({ count: 2 });
    c({ count: 3 });
    expect(variable).toBe(3);
});

test('should run all the execute methods', () => {
    let count = 0;
    component(({ execute }) => {
        execute(() => count++, []);
        execute(() => count++, [count < 2]);
        execute(() => count++, [count > 2]);
    })()();
    expect(count).toBe(3);
});

test('should be available to access the pros from the execute method', () => {
    let variable = 0;
    const c = component(({ execute, props: { count } }) => {
        execute(() => (variable = count), [count]);
    })();
    c({ count: 1 });
    expect(variable).toBe(1);
});

test('should get the injected props', () => {
    let variable = 0;
    const c = component(({ props: { count } }) => {
        variable = count;
    })();
    c({ count: 3 });
    expect(variable).toBe(3);
});

test('should generate a key', () => {
    let variable = 0;
    __keyCounter.value = 0;
    component(({ key }) => {
        variable = key;
    })()();
    expect(variable).toBe('__0__');
});

test('should concat the added key with the generated a key', () => {
    let variable = 0;
    __keyCounter.value = 0;
    const c = component(({ key }) => {
        variable = key;
    })();
    c({ key: 'key' });
    expect(variable).toBe('key__0__');
});

test('should generate multiple keys for multiple instance of the component', () => {
    let count = 0;
    let keys = [];
    __keyCounter.value = 0;
    const c = component(({ key }) => {
        keys[count++] = key;
    });
    const c1 = c();
    const c2 = c();
    const c3 = c();
    c1();
    c2();
    c3();
    expect(JSON.stringify(keys)).toBe('["__0__","__1__","__2__"]');
});

test('should concatenate the multiple generated keys for multiple instance of the component', () => {
    let count = 0;
    let keys = [];
    __keyCounter.value = 0;
    const c = component(({ key }) => {
        keys[count++] = key;
    });
    const c1 = c();
    const c2 = c();
    const c3 = c();
    c1({ key: 'key1' });
    c2({ key: 'key2' });
    c3({ key: 'key3' });
    expect(JSON.stringify(keys)).toBe('["key1__0__","key2__1__","key3__2__"]');
});

test('should run the cleanup method when the main element is removed', () => {
    let variable;
    let count = 0;
    const c = component(({ execute, cleanup }) => {
        execute(() => {
            count < 1 && process.nextTick(() => count++);
        }, [count]);
        cleanup((el) => {
            variable = el;
        });
        return !count ? h('p', {}, ['test']) : '';
    })();
    expect(c().outerHTML).toBe('<p>test</p>');
    process.nextTick(() => {
        expect(c()).toBe('');
        expect(variable.outerHTML).toBe('<p>test</p>');
    });
});

test('should not run the cleanup method when the main element is changed', () => {
    let variable;
    const c = component(({ cleanup, execute, update }) => {
        const [count, setCount] = update(0);
        execute(() => {
            process.nextTick(() => setCount(1));
        }, [count()]);
        cleanup((el) => {
            variable = el;
        });
        return !count() ? h('p', {}, ['test']) : h('p', {}, ['']);
    })();
    app(document.getElementById('app'), h('div', { id: 'app' }, [c()]));
    expect(c().outerHTML).toBe('<p>test</p>');
    process.nextTick(() => {
        expect(c().outerHTML).toBe('<p></p>');
        expect(variable).toBe(undefined);
    });
});

test('should define a initial state', () => {
    let variable;
    const c = component(({ update }) => {
        const [count] = update(0);
        variable = count;
    })();
    c();
    expect(variable()).toBe(0);
});

test('should update the initial state when a new value is set', () => {
    let variable;
    const c = component(({ execute, update }) => {
        const [count, setCount] = update(0);
        execute(() => {
            process.nextTick(() => setCount(1));
        }, []);
        variable = count;
    })();
    c();
    expect(variable()).toBe(0);
    process.nextTick(() => {
        expect(variable()).toBe(1);
    });
});

test('should replace the element', () => {
    const c = component(({ execute, update }) => {
        const [count, setCount] = update(0);
        execute(() => {
            process.nextTick(() => setCount(1));
        }, [count()]);
        return !count() ? h('p', {}, ['test']) : h('p', {}, ['']);
    })();
    app(document.getElementById('app'), h('div', { id: 'app' }, [c()]));
    expect(c().outerHTML).toBe('<p>test</p>');
    process.nextTick(() => {
        expect(c().outerHTML).toBe('<p></p>');
    });
});

test('should replace the element when none is an empty string', () => {
    const c = component(({ execute, update }) => {
        const [count, setCount] = update(0);
        execute(() => {
            process.nextTick(() => setCount(1));
        }, [count()]);
        return !count() ? h('p', {}, ['test']) : h('p', {}, ['']);
    })();
    app(document.getElementById('app'), h('div', { id: 'app' }, [c()]));
    expect(c().outerHTML).toBe('<p>test</p>');
    process.nextTick(() => {
        expect(c().outerHTML).toBe('<p></p>');
    });
});

test('should remove the element when the new one is an empty string', () => {
    let count = 0;
    const c = component(({ execute }) => {
        execute(() => {
            count < 1 &&
                process.nextTick(() => {
                    count++;
                });
        }, [count]);
        return !count ? h('p', {}, ['test']) : '';
    })();
    c();
    expect(c().outerHTML).toBe('<p>test</p>');
    process.nextTick(() => {
        expect(c()).toBe('');
    });
});

test('should generate the previous tree', () => {
    app(
        document.getElementById('app'),
        h('div', { id: 'app' }, [
            h('p', { id: 'test' }, [h('input', { id: 'test', key: 'key ;)', type: 'text' }, [])]),
        ])
    );
    const appElement = document.getElementById('app');
    const activeElement = document.querySelector('input');
    activeElement.focus();
    const { p } = doubleTree(
        appElement,
        h('div', { id: 'app' }, [
            h('p', {}, [h('input', { key: 'key ;)', className: 'test', type: 'text' }, [])]),
        ]),
        activeElement
    );

    expect(p[0].outerHTML).toBe(
        '<div id="app"><p id="test"><input id="test" type="text"></p></div>'
    );
    expect(p[1].outerHTML).toBe('<p id="test"><input id="test" type="text"></p>');
    expect(p[2].outerHTML).toBe('<input id="test" type="text">');
});

test('should generate the next tree', () => {
    app(
        document.getElementById('app'),
        h('div', { id: 'app' }, [
            h('p', { id: 'test' }, [h('input', { id: 'test', key: 'key ;)', type: 'text' }, [])]),
        ])
    );
    const appElement = document.getElementById('app');
    const activeElement = document.querySelector('input');
    activeElement.focus();
    const { n } = doubleTree(
        appElement,
        h('div', { id: 'app' }, [
            h('p', {}, [h('input', { key: 'key ;)', className: 'test', type: 'text' }, [])]),
        ]),
        activeElement
    );

    expect(n[0].outerHTML).toBe('<div id="app"><p><input class="test" type="text"></p></div>');
    expect(n[1].outerHTML).toBe('<p><input class="test" type="text"></p>');
    expect(n[2].outerHTML).toBe('<input class="test" type="text">');
});

test('should generate the previous ancestry tree', () => {
    app(
        document.getElementById('app'),
        h('div', { id: 'app' }, [
            h('p', { id: 'test' }, [h('input', { id: 'test', key: 'key ;)', type: 'text' }, [])]),
        ])
    );
    const appElement = document.getElementById('app');
    const activeElement = document.querySelector('input');
    activeElement.focus();
    const { pAncestry } = doubleTree(
        appElement,
        h('div', { id: 'app' }, [
            h('p', {}, [h('input', { key: 'key ;)', className: 'test', type: 'text' }, [])]),
        ]),
        activeElement
    );
    expect(pAncestry[0].outerHTML).toBe('<input id="test" type="text">');
    expect(pAncestry[1].outerHTML).toBe('<p id="test"><input id="test" type="text"></p>');
    expect(pAncestry[2].outerHTML).toBe(
        '<div id="app"><p id="test"><input id="test" type="text"></p></div>'
    );
});

test('should generate the new ancestry tree', () => {
    app(
        document.getElementById('app'),
        h('div', { id: 'app' }, [
            h('p', { id: 'test' }, [h('input', { id: 'test', key: 'key ;)', type: 'text' }, [])]),
        ])
    );
    const appElement = document.getElementById('app');
    const activeElement = document.querySelector('input');
    activeElement.focus();
    const { nAncestry } = doubleTree(
        appElement,
        h('div', { id: 'app' }, [
            h('p', {}, [h('input', { key: 'key ;)', className: 'test', type: 'text' }, [])]),
        ]),
        activeElement
    );
    expect(nAncestry[0].outerHTML).toBe('<input class="test" type="text">');
    expect(nAncestry[1].outerHTML).toBe('<p><input class="test" type="text"></p>');
    expect(nAncestry[2].outerHTML).toBe(
        '<div id="app"><p><input class="test" type="text"></p></div>'
    );
});

test('should get the new active element', () => {
    app(
        document.getElementById('app'),
        h('div', { id: 'app' }, [
            h('p', { id: 'test' }, [h('input', { id: 'test', key: 'key ;)', type: 'text' }, [])]),
        ])
    );
    const appElement = document.getElementById('app');
    const activeElement = document.querySelector('input');
    activeElement.focus();
    const { nActiveElement } = doubleTree(
        appElement,
        h('div', { id: 'app' }, [
            h('p', {}, [h('input', { key: 'key ;)', className: 'test', type: 'text' }, [])]),
        ]),
        activeElement
    );
    expect(nActiveElement.outerHTML).toBe('<input class="test" type="text">');
});

test('should add the new attributes and remove the previous from every ancestry', () => {
    app(
        document.getElementById('app'),
        h('div', { id: 'app' }, [
            h('p', { id: 'test' }, [
                h(
                    'input',
                    { id: 'test', className: 'previous-input-class', key: 'key ;)', type: 'text' },
                    []
                ),
            ]),
        ])
    );
    const appElement = document.getElementById('app');
    expect(appElement.outerHTML).toBe(
        '<div id="app"><p id="test"><input id="test" class="previous-input-class" type="text"></p></div>'
    );
    const activeElement = document.querySelector('input');
    activeElement.focus();
    const { n, p, pAncestry, nAncestry } = doubleTree(
        appElement,
        h('div', { id: 'app' }, [
            h('p', { className: 'next-input-class' }, [
                h('input', { key: 'key ;)', className: 'next-input-class', type: 'text' }, []),
            ]),
        ]),
        activeElement
    );
    patchTrees(n, p, pAncestry, nAncestry);
    expect(n[0].outerHTML).toBe(
        '<div id="app"><p class="next-input-class"><input class="next-input-class" type="text"></p></div>'
    );
    expect(p[2]).toBe(document.activeElement);
});

test('should add the new __handlers__ to every previous ancestry', () => {
    app(
        document.getElementById('app'),
        h('div', { id: 'app' }, [
            h('form', { onSubmit: () => 'previous-onSubmit' }, [
                h('p', {}, [
                    h(
                        'input',
                        {
                            key: 'key ;)',
                            className: 'previous-input-class',
                            onInput: () => 'previous-onInput',
                            type: 'text',
                        },
                        []
                    ),
                ]),
            ]),
        ])
    );
    const appElement = document.getElementById('app');
    expect(appElement.outerHTML).toBe(
        '<div id="app"><form><p><input class="previous-input-class" type="text"></p></form></div>'
    );
    const activeElement = document.querySelector('input');
    activeElement.focus();
    const { n, p, pAncestry, nAncestry } = doubleTree(
        appElement,
        h('div', { id: 'app' }, [
            h('form', { onSubmit: () => 'next-onSubmit' }, [
                h('p', { className: 'next-p-class' }, [
                    h(
                        'input',
                        {
                            key: 'key ;)',
                            className: 'next-input-class',
                            type: 'text',
                            onInput: () => 'next-onInput',
                        },
                        []
                    ),
                ]),
            ]),
        ]),
        activeElement
    );
    patchTrees(n, p, pAncestry, nAncestry);
    expect(p[0].outerHTML).toBe(
        '<div id="app"><form><p class="next-p-class"><input type="text" class="next-input-class"></p></form></div>'
    );
    expect(p[1].__handler__.submit.toString()).toBe("() => 'next-onSubmit'");
    expect(p[3].__handler__.input.toString()).toBe("() => 'next-onInput'");
    expect(p[3]).toBe(document.activeElement);
});

test('should add new elements to the previous tree', () => {
    app(
        document.getElementById('app'),
        h('div', { id: 'app' }, [
            h('form', {}, [
                h('p', {}, [h('input', { key: 'test', id: 'test', type: 'text' }, [])]),
            ]),
        ])
    );
    const appElement = document.getElementById('app');
    expect(appElement.outerHTML).toBe(
        '<div id="app"><form><p><input id="test" type="text"></p></form></div>'
    );
    const activeElement = document.querySelector('input');
    activeElement.focus();
    const { n, p, pAncestry, nAncestry } = doubleTree(
        appElement,
        h('div', { id: 'app' }, [
            h('p', {}, ['Test']),
            h('form', {}, [
                h('p', {}, ['Test']),
                h('p', {}, [
                    h('label', { htmlFor: 'test' }, ['Test']),
                    h('input', { key: 'test', id: 'test', type: 'text' }, []),
                ]),
                h('ul', {}, [
                    h('li', {}, ['0']),
                    h('li', {}, ['1']),
                    h('li', {}, ['2']),
                    h('li', {}, ['3']),
                ]),
                h('p', {}, ['Test']),
            ]),
            h('p', {}, ['Test']),
        ]),
        activeElement
    );
    patchTrees(n, p, pAncestry, nAncestry);
    expect(p[0].outerHTML).toBe(
        '<div id="app"><p>Test</p><form><p>Test</p><p><label for="test">Test</label><input id="test" type="text"></p><ul><li>0</li><li>1</li><li>2</li><li>3</li></ul><p>Test</p></form><p>Test</p></div>'
    );
    expect(p[3]).toBe(document.activeElement);
});

test('should remove old elements to the previous tree', () => {
    app(
        document.getElementById('app'),
        h('div', { id: 'app' }, [
            h('p', {}, ['Test1']),
            h('form', {}, [
                h('p', {}, ['Test']),
                h('p', {}, [
                    h('label', { htmlFor: 'test' }, ['Test']),
                    h('input', { id: 'test', name: 'test', type: 'text' }, []),
                ]),
                h('p', {}, ['Test']),
            ]),
            h('p', {}, ['Test2']),
        ])
    );
    const appElement = document.getElementById('app');
    expect(appElement.outerHTML).toBe(
        '<div id="app"><p>Test1</p><form><p>Test</p><p><label for="test">Test</label><input id="test" name="test" type="text"></p><p>Test</p></form><p>Test2</p></div>'
    );
    const activeElement = document.querySelector('input');
    activeElement.focus();
    const { n, p, pAncestry, nAncestry } = doubleTree(
        appElement,
        h('div', { id: 'app' }, [
            h('form', {}, [
                h('p', {}, [h('input', { id: 'test', name: 'test', type: 'text' }, [])]),
            ]),
        ]),
        activeElement
    );
    patchTrees(n, p, pAncestry, nAncestry);
    expect(p[0].outerHTML).toBe(
        '<div id="app"><form><p><input id="test" name="test" type="text"></p></form></div>'
    );
    expect(p[6]).toBe(document.activeElement);
});

test('should remove old elements to the previous tree', () => {
    app(
        document.getElementById('app'),
        h('div', { id: 'app' }, [
            h('p', {}, ['Test1']),
            h('form', {}, [
                h('p', {}, ['Test']),
                h('p', {}, [
                    h('label', { htmlFor: 'test' }, ['Test']),
                    h('input', { id: 'test', type: 'text' }, []),
                ]),
                h('p', {}, ['Test']),
            ]),
            h('p', {}, ['Test2']),
        ])
    );
    const appElement = document.getElementById('app');
    expect(appElement.outerHTML).toBe(
        '<div id="app"><p>Test1</p><form><p>Test</p><p><label for="test">Test</label><input id="test" type="text"></p><p>Test</p></form><p>Test2</p></div>'
    );
    const activeElement = document.querySelector('input');
    activeElement.focus();
    const { n, p, pAncestry, nAncestry } = doubleTree(
        appElement,
        h('div', { id: 'app' }, [
            h('p', {}, ['Test Test Test Test ']),
            h('p', {}, ['Test2']),
            h('form', {}, [
                h('p', {}, ['Test Test ']),
                h('p', {}, [
                    h('label', { htmlFor: 'test' }, ['Test']),
                    h('input', { id: 'test', type: 'text' }, []),
                ]),
            ]),
        ]),
        activeElement
    );
    patchTrees(n, p, pAncestry, nAncestry);
    expect(p[0].outerHTML).toBe(
        '<div id="app"><p>Test Test Test Test </p><p>Test2</p><form><p>Test Test </p><p><label for="test">Test</label><input id="test" type="text"></p></form></div>'
    );
    expect(p[6]).toBe(document.activeElement);
});

test('should replace the textContent', () => {
    app(
        document.getElementById('app'),
        h('div', { id: 'app' }, [
            h('p', {}, [
                h('button', { key: 'count' }, [`[+] @ 0`]),
                h('button', { key: 'count-1' }, [h('span', {}, [`0 @ [-]`])]),
            ]),
        ])
    );
    const appElement = document.getElementById('app');
    expect(appElement.outerHTML).toBe(
        '<div id="app"><p><button>[+] @ 0</button><button><span>0 @ [-]</span></button></p></div>'
    );
    const activeElement = document.querySelectorAll('button')[0];
    activeElement.focus();
    const { n, p, pAncestry, nAncestry } = doubleTree(
        appElement,
        h('div', { id: 'app' }, [
            h('p', {}, [
                h('button', { key: 'count' }, [`[+] @ 1`]),
                h('button', { key: 'count-1' }, [h('span', {}, [`1 @ [-]`])]),
            ]),
        ]),
        activeElement
    );
    patchTrees(n, p, pAncestry, nAncestry);
    expect(p[0].outerHTML).toBe(
        '<div id="app"><p><button>[+] @ 1</button><button><span>1 @ [-]</span></button></p></div>'
    );
    expect(p[2]).toBe(document.activeElement);
});

test('should use the title that matches with the path', () => {
    dom.reconfigure({ url: 'https://h-h.h/' });
    router({
        '/': {
            title: () => 'test',
            view: () => h('div', { id: 'app' }, [h('p', {}, ['test'])]),
        },
        '/test': {
            title: () => 'test - 1',
            view: () => h('div', { id: 'app' }, [h('p', {}, ['test - 1'])]),
        },
    });
    expect(document.title).toBe('test');
});

test('should use the title that matches with the other path', () => {
    dom.reconfigure({ url: 'https://h-h.h/test' });
    router({
        '/': {
            title: () => 'test',
            view: () => h('div', { id: 'app' }, [h('p', {}, ['test'])]),
        },
        '/test': {
            title: () => 'test - 1',
            view: () => h('div', { id: 'app' }, [h('p', {}, ['test - 1'])]),
        },
    });
    expect(document.title).toBe('test - 1');
});

test('should pass as arguments the params of the path', () => {
    dom.reconfigure({ url: 'https://h-h.h/test-1/test2' });
    let title;
    let view;
    router({
        '/:tes1/:test2': {
            title: (params) => (title = params),
            view: (params) => {
                view = params;
                return h('div', { id: 'app' }, [h('p', {}, ['test - 1'])]);
            },
        },
    });
    expect(JSON.stringify(title)).toBe('{"tes1":"test-1","test2":"test2"}');
    expect(JSON.stringify(view)).toBe('{"tes1":"test-1","test2":"test2"}');
});
