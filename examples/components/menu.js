import { to } from '../../dist/h-h.cjs.development';
import { a, li, ul } from '../html';

export const menu = () =>
    ul({ className: 'flex list ma0 pa0 f7' }, [
        li([a({ href: '/', className: 'black mr2', onClick: to }, ['Clock'])]),
        li([a({ href: '/whatever-slug#hash', className: 'black mr2', onClick: to }, ['Counter'])]),
        li([a({ href: '/todo?test=loquesea', className: 'black mr2', onClick: to }, ['Todo'])]),
    ]);
