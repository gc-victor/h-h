# h-h

h-h is a micro-library (<2.5 KB) for creating user interfaces. It doesn't require compilation as it uses HyperScript as a template engine. Instead of using a Virtual DOM, it uses dom diff to update the DOM reducing the memory allocation and GC thrashing for incremental updates. Its hooks allow reactive updates and side effects with a small API. It can be used for Static Site Generation, Server-Side Rendering and Client-Side Rendering.

## Key Features

-   Micro-library <2.5 KB
-   Without dependencies
-   No compilation needed
-   HyperScript as a template engine
-   No Virtual DOM, uses dom-diff to update the DOM
-   Reactive updates and side effects
-   Small API, not much to learn
-   Static Site Generator, Server-Side Rendering and Client-Side Rendering
-   Plus, a tiny router

## Let's Play

You can start using it without bundlers or compilers.

[Demo CodeSandbox](https://codesandbox.io/s/silly-frost-mp0pp).

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <script type="module">
            import {
                app,
                component,
                h,
            } from 'https://cdn.jsdelivr.net/gh/gc-victor/h-h/dist/esm/index.js';

            const Counter = component(({ update }) => {
                const [count, setCount] = update(0);

                const add = (ev) => setCount(ev.target.value);
                const increment = () => setCount(count() + 1);
                const decrement = () => setCount(count() - 1);

                return h('div', {}, [
                    h('button', { onClick: increment }, ['+']),
                    h('input', { key: 'input', type: 'number', onInput: add, value: count() }, []),
                    h('button', { onClick: decrement }, ['-']),
                ]);
            })();

            app(document.getElementById('app'), Counter());
        </script>
    </head>
    <body>
        <main id="app"></main>
    </body>
</html>
```

## Installation

You can use pnpm, npm or yarn to install it.

```console
npm install git+https://github.com/gc-victor/h-h.git#main
```

Import it in your application.

```js
import { app, h, component } from 'h-h';
```

Or import it in a `<script>` as a module.

```html
<script type="module">
    import { app, h, component } from 'https://cdn.jsdelivr.net/gh/gc-victor/h-h/dist/esm/index.js';
</script>
```

### Dependencies

The only dependency is [html-element](https://github.com/1N50MN14/html-element) for Server Side Rendering or Static Site Generation.

```console
npm install html-element
```

```javascript
import 'html-element/global-shim';

// Your code ...
```

## Template engine

By default, you can use HyperScript. It doesn't require bundlers or compilers.

```javascript
h('h1', { className: 'bold' }, ['h-h']);
```

A key attribute is required to keep the focus of an active element when its content change.

```javascript
h('input', { key: 'input', value: newValue() }, []);
```

To transpile JSX you can use [esbuild](https://esbuild.github.io/content-types/#jsx) or [Babel plugin](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx) to convert it to JavaScript.

```javascript
import { app } from 'h-h';

const App = component(() => {
    return <h1 className="bold">h-h</h1>;
})();

app(document.getElementById('app'), App());
```

## Component

h-h components provide isolated states to work with it and offer a small API to make it easy to learn.

### API

The injected hooks allow reactive updates and side effects for the components.

```javascript
const App = component(({ cleanup, execute, props, update }) => {
    const [state, setState] = update('');

    execute(() => {
        console.log('EXECUTED ONCE');
    }, []);
    execute(() => {
        console.log('EXECUTED EACH TIME THE VARIABLE CHANGES');
    }, [variable]);
    cleanup(() => {
        console.log('cleanup');
    });

    return h('h1', {}, ['h-h']);
});
```

-   **cleanup**: is triggered when the component element is deleted from the DOM
-   **execute**: is the main way to trigger side effects, you can use more than once in a single component
-   **props**: are the properties used to send data from one component to another
-   **update**: manages the component states, you can use more than once in a single component. It returns an array, where the first item is a function with the current state, and the second is the setter

## App

You can create as many apps as you need.

```javascript
app(document.getElementById('app'), App());
```

## Router

The router has to be initialized as part of the configuration of our application.

```javascript
router({
    '/': {
        id: 'app', // by defaul the id is app
        title: () => 'App 1',
        view: () => h('div', {}, ['App 1']),
    },
    '/:slug': {
        id: 'app2', // by defaul the id is app
        title: () => 'App 2',
        view: () => h('div', {}, ['App 2']),
    },
});
```

To navigate through the application, you have to add the `to` method to an anchor.

```javascript
import { to } from 'h-h/router';
```

```javascript
h('a', { href: '/', onClick: to }, ['View 1']);
```

## Acknowledgments

### Inspiration

-   [React](https://reactjs.org/)
-   [HyperScript](https://github.com/hyperhype/hyperscript)
-   [HyperApp](https://github.com/jorgebucaran/hyperapp)
-   [udomdiff](https://github.com/WebReflection/udomdiff)

### Tools

-   [esbuild](https://esbuild.github.io/)
-   [gzip-size](https://esbuild.github.io/)
-   [d-d](https://github.com/gc-victor/t-t)
-   [esm](https://github.com/standard-things/esm) 
-   [es-module-shims](https://github.com/guybedford/es-module-shims)
-   [html-element](https://github.com/1N50MN14/html-element) 
-   [jsdom](https://github.com/jsdom/jsdom)
-   [t-t](https://github.com/gc-victor/t-t)
-   [chokidar-cli](https://github.com/kimmobrunfeldt/chokidar-cli)

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
-   Commit your changes: `git commit -am 'feat: add a feature'`
-   Push to the branch: `git push origin my-new-feature`
-   Submit a pull request with full remarks documenting your changes.

## License

[MIT License](https://github.com/gc-victor/h-h/blob/master/LICENSE)

Copyright (c) 2021 Víctor García

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
