import { h } from '../src/h.js';
import { component } from '../src/component.js';

const clickButton = component(function ({ cleanup, execute, key, update }) {
    const [count, setCount] = update(0);

    const onClick = () => {
        console.log('click', new Date().toLocaleTimeString());
        setCount(count() + 1);
    };

    execute((element) => {
        console.log('executed first time', element, key);
    }, []);

    cleanup(() => {
        console.log('cleanup', element, key);
    });

    return h('button', { onClick }, [h('span', {}, [`Click ${count()}`])]);
})();

const button = component(function ({ cleanup, key, execute, update }) {
    const [count, setCount] = update(0);
    const [count2, setCount2] = update(0);
    const onClick = () => {
        console.log('click', new Date().toLocaleTimeString());
        setCount(count() + 1);
        setCount2(count2() + 2);
    };

    cleanup((element) => {
        console.log('deleted', element, key);
    });

    execute(() => {
        TimerApp && console.log('executed on timer change', key, { timer: TimerApp });
    }, [TimerApp]);

    execute(() => {
        console.log('executed first time', key);
    }, []);

    execute(
        (arr) => {
            if (arr[0] === 2) {
                console.log(`${new Date().toLocaleTimeString()}`, 'init set timeout', key);
                // const timer = setTimeout(() => {
                //     console.log('execute set timeout', key);
                //     setCount(0);
                //     setCount2(0);
                // }, 5000);
                // !one && store.set(key, timer);
            }
        },
        [count()]
    );

    return count() < 2
        ? h('button', { onClick }, [h('span', {}, [`Click ${count()} - ${count2()}`])])
        : clickButton({ key });
});

const button1 = button();
const button2 = button();
const button3 = button();

const timerComponent = component(function ({ key, execute, update }) {
    const [time, setTime] = update(new Date());

    execute(() => {
        setInterval(() => {
            setTime(new Date());
        }, 1000);
    }, []);

    return h('span', {}, [
        h('span', { className: 'timer' }, [`${time().toLocaleTimeString()}`]),
        ' - ',
        button1({ one: true }),
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

    // TODO: Create a test for this case
    return h('ul', {}, [
        h('li', {}, [
            h('button', { key: 'zero', onClick: onClick0 }, [
                show0() ? h('span', { }, [`Click`]) : h('span', {}, [`Clock`])
            ])
        ]),
        h('li', {}, [
            h('button', { key: 'one', onClick: onClick1 }, [
                show1() ? h('span', {}, [`Click`]) : h('span', {}, [`Clock`])
            ])
        ]),
        h('li', {}, [
            h('button', { key: 'two', onClick: onClick2 }, [
                show2() ? h('span', { }, [`Click`]) : h('span', {}, [`Clock`])
            ])
        ]),
    ])
})();

export const TimerApp = () =>
    h(
        'p',
        {
            className: 'class',
        },
        [
            h('span', { className: 'e-test' }, ['Timer: ']),
            timerComponent(),
            ' - ',
            button2(),
            ' - ',
            button3(),
            list()
        ]
    );
