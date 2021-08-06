import { h } from '../src/h.js';
import { component } from '../src/component.js';

const button = component(({ key, update, props }) => {
    const [show, setShow] = update(true);

    const onClick = () => {
        setShow(!show());
        props.onClick();
    };

    return h('button', { key, onClick }, [
        h('span', {}, [
            h('span', {}, [`Toggle ${props.label} . `]),
            show() ? h('span', {}, [`+`]) : h('span', {}, [`-`]),
        ]),
    ]);
})();

const list = component(({ update }) => {
    const [show0, setShow0] = update(true);
    const [show1, setShow1] = update(true);
    const [show2, setShow2] = update(true);

    const onClick0 = () => {
        setShow0(!show0());
    };

    const onClick1 = () => {
        setShow1(!show1());
    };

    const onClick2 = () => {
        setShow2(!show2());
    };

    const toggle0 = () => {
        setShow0(!show0());
    };

    const toggle1 = () => {
        setShow1(!show1());
    };

    return h('ul', {}, [
        h('li', {}, [
            h('button', { key: 'zero', onClick: onClick0 }, [
                show0() ? h('span', {}, [`Click 0`]) : h('span', {}, [`Clock 0`]),
            ]),
        ]),
        h('li', {}, [
            h('button', { key: 'one', onClick: onClick1 }, [
                show1() ? h('span', {}, [`Click 1`]) : h('span', {}, [`Clock 1`]),
            ]),
        ]),
        h('li', {}, [
            h('button', { key: 'two', onClick: onClick2 }, [
                show2() ? h('span', {}, [`Click 2`]) : h('span', {}, [`Clock 2`]),
            ]),
        ]),
        h('li', {}, [button({ key: 'b1', onClick: toggle0, label: '0' })]),
        h('li', {}, [button({ key: 'b2', onClick: toggle1, label: '1' })]),
    ]);
})();

export const ClickApp = () =>
    h(
        'div',
        {
            className: 'class',
        },
        [list()]
    );
