import { execSync } from 'child_process';

export default {
    dist: '/examples',
    src: ['./src', './examples'],
    port: 1234,
    socketPort: 1235,
    onChangeServer: () => {},
};
