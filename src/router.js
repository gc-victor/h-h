import { app } from './app.js';

let setClick;

const matcher = storeMatcher();

export const redirect = (href) => {
    const link = document.createElement('a');
    link.setAttribute('href', href);
    setClick(link);
};

export const to = (event) => {
    event.preventDefault();
    setClick(event.currentTarget);
};

const click = (options) => (link) => {
    const handler = (event) => {
        link.removeEventListener('click', handler);
        render({ options, event });
    };
    link.addEventListener('click', handler);
    link.click();
};

export function router(options) {
    const match = matcher.set(options, document.location.pathname);
    setClick = click(options);
    popState(options);
    setTitle({ match, path: setPath(document.location), isPopState: false });
    app(document.getElementById(match.id || options.id || 'app'), match.view(match.params));
    return {
        view: match.view || options.view,
    };
}

function popState(options) {
    document.addEventListener('popstate', (event) => render({ options, event }));
}

function render({ options = {}, event }) {
    const target = event.currentTarget;
    const match = matcher.set(options, target.attributes.href.value);
    event.preventDefault();
    setTitle({
        match,
        path: setPath(target) || setPath(document.location),
        isPopState: event.type === 'popstate',
    });
    app(document.getElementById(match.id || options.id || 'app'), match.view(match.params));
}

function setPath(location) {
    return location.pathname + (location.search || location.hash);
}

function setTitle({ match, path, isPopState }) {
    const title = match.title(match.params) || document.title;
    if (!isPopState) {
        window.history.pushState({}, title, path);
    }
    document.title = title;
}

function storeMatcher() {
    const storeMatches = new Map();
    const noop = () => {};
    return {
        set(options, url) {
            if (!storeMatches.has(url)) {
                let rout = '';
                let params;
                const routes = Object.keys(options);
                const length = routes.length;
                for (let i = 0; i < length; i = i + 1) {
                    rout = routes[i];
                    params = addMatch(url, routes[i]);
                    if (params) {
                        break;
                    }
                }
                const item = options[rout];
                storeMatches.set(url, {
                    ...item,
                    params,
                    title: item.title || noop,
                    view: item.view || noop,
                });
            }
            return storeMatches.get(url);
        },
    };
}

// @see https://github.com/jesseditson/fs-router/blob/v0.2.0/index.js#L7
function addMatch(url, path) {
    let matched;
    const paramPattern = /:([^/]+)/;
    const paramNames = [];
    while ((matched = path.match(paramPattern))) {
        path = path.replace(paramPattern, '([^?/]+)');
        paramNames.push(matched[1]);
    }
    const pattern = new RegExp(`^${path}(\\?(.*)|$)`, 'i');
    const match = url.match(pattern);
    if (match) {
        return paramNames.reduce((map, param, index) => {
            map[param] = match[index + 1];
            return map;
        }, {});
    }
}
