// @see: https://github.com/purposeindustries/window-or-global/
export const root: any =
    // eslint-disable-next-line
    (typeof self === 'object' && self.self === self && self) ||
    // @ts-ignore
    (typeof global === 'object' && global.global === global && global) ||
    window;
