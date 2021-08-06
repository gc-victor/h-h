import fs from 'fs';
import { promises as fsp } from 'fs';
import { join as joinPath } from 'path';
import { IMPORT_VIEW, INIT, STYLESHEET } from './constants';

// @see: https://github.com/jakearchibald/jakearchibald.com/blob/master/static-build/utils.tsx#L27
export async function buildPage({ container, output, init, meta = '', stylesheet = '' }) {
    const pathParts = ['./', output];
    const fullPath = joinPath(...pathParts);
    const method = Object.keys(init)[0];
    const value = Object.values(init)[0];
    const pathname = meta && fs.existsSync(meta) ? await fileWithHash(method, meta) : value;

    try {
        await fsp
            .writeFile(
                fullPath,
                '<!DOCTYPE html>' +
                    container
                        .replace(IMPORT_VIEW, `"${method}": "${pathname}"`)
                        .replace(INIT, `import "${method}";`)
                        .replace(STYLESHEET, stylesheet),
                {
                    encoding: 'utf8',
                }
            )
            .catch();

        return fullPath;
    } catch (err) {
        console.error('Failed to write ' + fullPath);
        throw err;
    }
}

async function fileWithHash(method, meta) {
    const content = JSON.parse((await fsp.readFile(`${joinPath(meta)}`)).toString());
    const regex = new RegExp(`${method}-.*\.js`);

    return Object.keys(content.outputs)
        .find((element) => element.match(regex))
        .replace('dist', '.');
}
