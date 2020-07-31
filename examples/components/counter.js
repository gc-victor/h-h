import { component } from '../../dist/h-h.cjs.development';
import { debug } from '../utils';
import { article, button, div, form, input, label, li, p, span, ul } from '../html';
import { Layer, Buttons, Paragraph } from './ui';
import { clockComponentInit } from './clock';

const field = (onInput, ref, text) =>
    label([
        span({ className: 'dn' }, ['Input']),
        input({
            className: 'fl w-100 f6 pa2 mv0 f7 bn',
            type: 'search',
            name: 'name',
            onInput,
            placeholder: 'Write something here…',
            ref,
            value: text,
        }),
    ]);

const buttons = ({ showAll }) =>
    ul({ className: 'pa0 ma0' }, [
        li({ className: 'list' }, [
            button(
                {
                    className: 'fl w-50 link dim pa2 f7 bn black bg-yellow',
                    type: 'reset',
                },
                ['Reset']
            ),
        ]),
        li({ className: 'list' }, [
            button(
                {
                    className: 'fl w-50 mb0 link dim pa2 f7 bn white bg-green',
                    type: 'submit',
                },
                ['Submit']
            ),
        ]),
        li({ className: 'list' }, [
            button(
                {
                    className: 'fl w-100 link dim pa2 f7 bn white bg-black',
                    type: 'button',
                    onClick: () => showAll(),
                },
                ['Show all']
            ),
        ]),
    ]);

const messageComponentInit = component(({ created, deleted, execute, key, props, update }) => {
    const localDate = new Date().toLocaleTimeString('en', { hour12: false });

    const [times, setTimes] = update(0);
    const [date, setDate] = update(localDate);

    const { text, setShow } = props;
    const onDelete = () => setShow(false);
    const onCountTimes = (n) => () => setTimes(times + n);
    const onResetCountTimes = () => setTimes(0);

    created(() => debug(' CREATED Message', key));
    deleted(() => debug(' DELETED Message', key));
    execute(() => debug(' EXECUTED ONCE Message', { key, text }), []);
    execute(() => debug(' EXECUTED ON_COUNT Message', { key, times, text }), [times]);
    execute(() => debug(' EXECUTED ALWAYS Message', { key }));
    execute(() => setDate(localDate), [times]);

    return Layer(
        [
            Paragraph(`${date} :: ${localDate} :: → ${text || ''} - counter: ${times}`),
            Buttons([
                ['0', { className: 'bg-yellow ml2 ', onClick: onResetCountTimes }],
                ['-1', { className: 'bg-black white ml2 ', onClick: onCountTimes(-1) }],
                ['+1', { className: 'bg-black white ml2 ', onClick: onCountTimes(1) }],
                ['Delete', { className: 'bg-red white ml2 ', onClick: onDelete }],
            ]),
        ],
        { className: 'flex mv0 pv2 f7 bb b--black bb' }
    );
});

const messageContainerSubmitComponent = messageComponentInit();
const messageContainerInputComponent = messageComponentInit();

const formComponentInit = component(
    ({
        created,
        deleted,
        key,
        props: { onInput, onReset, onSubmit, ref, submitText, text },
        update,
    }) => {
        const [showSubmit, setShowSubmit] = update(true);
        const [showInput, setShowInput] = update(true);

        const showAll = () => {
            setShowSubmit(true);
            setShowInput(true);
        };

        created(() => debug(' CREATED Form', key));
        deleted(() => debug(' DELETED Form', key));

        return form(
            {
                autocomplete: 'off',
                onSubmit,
                onReset,
            },
            [
                div({ className: 'bt b--black' }, [
                    showSubmit
                        ? messageContainerSubmitComponent({
                              text: submitText || 'Submit',
                              setShow: setShowSubmit,
                          })
                        : null,
                    showInput
                        ? messageContainerInputComponent({ text, setShow: setShowInput })
                        : null,
                    p({ className: 'ma0' }, [field(onInput, ref, text)]),
                    buttons({ showAll }),
                ]),
            ]
        );
    }
);

let refElement;

const formComponent = formComponentInit();
const clockComponent = clockComponentInit();
const wrapperComponentInit = component(({ key, created, deleted, execute, update }) => {
    const initialText = '';
    const [text, setText] = update(initialText);
    const [submitText, setSubmitText] = update();
    const onSubmit = (ev) => {
        ev.preventDefault();
        setSubmitText(text);
    };
    const onReset = (ev) => {
        ev.preventDefault();
        setText(initialText);
    };
    const onInput = (ev) => {
        const value = ev.target.value;

        setText(value);
    };
    const ref = (el) => {
        !refElement && debug({ el });
        refElement = el;
    };

    created(() => debug(' CREATED Wrapper', key));
    deleted(() => debug(' DELETED Wrapper', key));
    execute(() => debug(' EXECUTED Wrapper', { key, text }));

    return article({ className: 'sans-serif' }, [
        clockComponent({ background: '', color: 'black' }),
        formComponent({
            onInput,
            onReset,
            onSubmit,
            ref,
            submitText,
            text,
        }),
    ]);
});

const wrapperComponent = wrapperComponentInit();
export const counterComponent = wrapperComponent;
