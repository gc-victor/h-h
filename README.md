# h-h

Your tiny framework to create web interfaces.

-   HyperScript as a template engine, allowing uses it directly in the browser, without any build tool. In the case that you want to use JSX, you can do it too.
-   Instead of using a virtual DOM, it uses [Incremental DOM](https://github.com/google/incremental-dom) that reduces memory allocation and GC thrashing for incremental updates.
-   Hooks allow composing state and side effects.
-   A simple router.
-   Has a small API, not much to learn.
-   Static Site Generator, Server-Side and Client-Side Rendering.

## Let's Play

You can start using it without bundlers or compilers.

[Demo CodeSandbox](https://codesandbox.io/s/zen-matsumoto-f756x).

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <script src="https://cdn.jsdelivr.net/npm/incremental-dom@0.7.0/dist/incremental-dom-min.js"></script>
        <script type="module">
            import {
                app,
                component,
                h,
            } from 'https://cdn.jsdelivr.net/gh/gc-victor/h-h/dist/h-h.esm.js';

            const todo = component(({ update }) => {
                const [newTodo, setNewTodo] = update('');
                const [todos, setTodo] = update([]);

                const onInput = (ev) => {
                    const value = ev.target.value;

                    setNewTodo(value);
                };
                const addTodo = (ev) => {
                    ev.preventDefault();
                    setTodo([...todos, newTodo]);
                    setNewTodo('');
                };

                return h('form', { onSubmit: addTodo }, [
                    h('input', { type: 'text', onInput, value: newTodo }, []),
                    h('button', { type: 'submit' }, ['Add']),
                    h(
                        'ul',
                        {},
                        todos.map((t) => h('li', {}, t))
                    ),
                ]);
            })();

            app({
                id: 'app',
                view: () => h('main', { id: 'app' }, [todo()]),
            });
        </script>
    </head>
    <body>
        <main id="app"></main>
    </body>
</html>
```

## Installation

You can use npm or yarn to install it.

```console
npm install git+https://github.com/gc-victor/h-h.git#master
```

Import it in your application.

```js
import { h, component, app } from 'h-h';
```

Or import it in a `<script>` as a module.

```html
<script type="module">
    import { h, component, app } from 'https://cdn.jsdelivr.net/gh/gc-victor/h-h/dist/h-h.esm.js';
</script>
```

Or import it in a `<script>` as nomodule, and use it as a global variable.

```html
<script src="https://cdn.jsdelivr.net/gh/gc-victor/h-h/dist/h-h.umd.production.min.js"></script>
```

```javascript
const { app, component, h } = window['h-h'];
```

### Dependecies

Its main dependency is [Incremental DOM](https://github.com/google/incremental-dom), you have to import it with a CDN.

```html
<script src="https://cdn.jsdelivr.net/npm/incremental-dom@0.7.0/dist/incremental-dom-min.js"></script>
```

Or in your code.

```console
npm install incremental-dom incremental-dom-string
```

`incremental-dom.js` will be used for Client-Side Rendering.

```javascript
import * as IncrementalDOMString from 'incremental-dom';

window.IncrementalDOM = IncrementalDOM;
```

index.js

```javascript
import './incremental-dom';

// Your code ...
```

`incremental-dom-string.js` will be used for Server-Side Rendering and Static Site Generator.

```javascript
import * as IncrementalDOMString from 'incremental-dom-string';

global.IncrementalDOM = IncrementalDOM;
```

static.js

```javascript
import './incremental-dom-string';

// Your code ...
```

## Template engine

By default, you can use HyperScript. It doesn't require bundlers or compilers.

```javascript
h('h1', {}, ['h-h']);
```

To transpile JSX, you need a [Babel plugin](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx) that converts it to valid JavaScript.

.babelrc

```json
{
    "plugins": [
        [
            "@babel/plugin-transform-react-jsx",
            {
                "pragma": "h"
            }
        ]
    ]
}
```

index.js

```javascript
/** @jsx h */
import { app, h } from 'h-h';

const todo = component(() => ... )();

app({
    id: 'app',
    view: () => <main id="app">${todo()}</main>,
});
```

## Hooks

The hooks allow composing states and side effects in the components.

```javascript
const todo = component(({ created, deleted, execute, key, props, update }) => {
    const [state, setter] = update('');

    created(() => {
        console.log('CREATED');
    });
    deleted(() => {
        console.log('DELETED');
    });
    execute(() => {
        console.log('EXECUTED ONCE');
    }, []);
    execute(() => {
        console.log('EXECUTED EACH TIME THE VARIABLE CHANGES');
    }, [variable]);

    return h('h1', null, ['h-h']);
});
```

-   **update**: as the useState from React is in charge of managing a state. It returns an array, where the first item is the current state, and the second is the setter.
-   **execute**: as the useEffect from React is the main way to trigger various side-effects.
-   **created**: is triggered when the component is created in the DOM, close to componentDidMount.
-   **deleted**: is triggered when the component is deleted from the DOM, close to componentWillUnMount.

## Router

The router has to be initialized as part of the configuration of our application.

```javascript
app({
    id: 'app',
    router: {
        '/': {
            title: () => 'View 1',
            view: () => h('div', { id: 'app' }, ['View 1']),
        },
        '/:slug': {
            title: () => 'View 2',
            view: () => h('div', { id: 'app' }, ['View 2']),
        },
    },
});
```

To navigate through the application, you have to add the `to` method to an anchor.

```javascript
import { to } from 'h-h';
```

```javascript
h('a', { href: '/', onClick: to }, ['View 1']);
```

## Compatible Versioning

### Summary

Given a version number MAJOR.MINOR, increment the:

-   MAJOR version when you make backwards-incompatible updates of any kind
-   MINOR version when you make 100% backwards-compatible updates

Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR format.

[![ComVer](https://img.shields.io/badge/ComVer-compliant-brightgreen.svg)](https://github.com/staltz/comver)

## Contribute

First off, thanks for taking the time to contribute!
Now, take a moment to be sure your contributions make sense to everyone else.

### Reporting Issues

Found a problem? Want a new feature? First of all, see if your issue or idea has [already been reported](../../issues).
If it hasn't, just open a [new clear and descriptive issue](../../issues/new).

### Commit message conventions

A specification for adding human and machine readable meaning to commit messages.

-   [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

### Submitting pull requests

Pull requests are the greatest contributions, so be sure they are focused in scope and do avoid unrelated commits.

-   Fork it!
-   Clone your fork: `git clone http://github.com/<your-username>/h-h`
-   Navigate to the newly cloned directory: `cd h-h`
-   Create a new branch for the new feature: `git checkout -b my-new-feature`
-   Install the tools necessary for development: `npm install`
-   Make your changes.
-   `npm run build` to verify your change doesn't increase output size.
-   `npm test` to make sure your change doesn't break anything.
-   Commit your changes: `git commit -am 'Add some feature'`
-   Push to the branch: `git push origin my-new-feature`
-   Submit a pull request with full remarks documenting your changes.

## License

[MIT License](https://github.com/gc-victor/h-h/blob/master/LICENSE)

Copyright (c) 2020 Víctor García

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
