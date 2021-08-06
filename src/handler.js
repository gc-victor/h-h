export function handler(ev) {
    return ev.currentTarget.__handler__[ev.type](ev);
}
