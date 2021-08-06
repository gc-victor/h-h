const is = typeof global !== 'undefined' && {}.toString.call(global) === '[object global]';

if (!is) {
    window.process = { env: { TEST: false } };
}

export const isNodejs = process.env.TEST ? false : is;
