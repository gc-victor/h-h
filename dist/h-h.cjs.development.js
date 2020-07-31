'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

// https://github.com/staltz/quicktask/blob/master/index.ts
// https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/queueMicrotask#When_queueMicrotask_isnt_available
// https://morioh.com/p/4ca3c63dbc0c
var getGlobal = function getGlobal() {
  if (typeof globalThis !== 'undefined') return globalThis; // eslint-disable-next-line

  if (typeof self !== 'undefined') return self;
  if (typeof window !== 'undefined') return window;
  if (typeof global !== 'undefined') return global;
  throw new Error('Unable to locate global object');
};

var globalThis = /*#__PURE__*/getGlobal();

if (typeof globalThis.queueMicrotask !== 'function') {
  globalThis.queueMicrotask = function queueMicrotask(callback) {
    if (globalThis.Promise) {
      Promise.resolve().then(callback)["catch"](function (e) {
        return setTimeout(function () {
          throw e;
        });
      });
    } else if (typeof process !== 'undefined') {
      return process.nextTick(callback);
    } else {
      return setTimeout(callback);
    }
  };
}

function quicktask() {
  return function (fn) {
    return globalThis.queueMicrotask(fn);
  };
}

var schedule = /*#__PURE__*/quicktask();

var noop = function noop(_) {};

var _IncrementalDOM = IncrementalDOM,
    attr = _IncrementalDOM.attr,
    _IncrementalDOM$attri = _IncrementalDOM.attributes,
    attributes = _IncrementalDOM$attri === void 0 ? {} : _IncrementalDOM$attri,
    elementClose = _IncrementalDOM.elementClose,
    elementOpenEnd = _IncrementalDOM.elementOpenEnd,
    elementOpenStart = _IncrementalDOM.elementOpenStart,
    _IncrementalDOM$notif = _IncrementalDOM.notifications,
    notifications = _IncrementalDOM$notif === void 0 ? {
  nodesCreated: noop,
  nodesDeleted: noop
} : _IncrementalDOM$notif,
    patchOuter = _IncrementalDOM.patchOuter,
    _IncrementalDOM$rende = _IncrementalDOM.renderToString,
    renderToString = _IncrementalDOM$rende === void 0 ? noop : _IncrementalDOM$rende,
    _IncrementalDOM$skip = _IncrementalDOM.skip,
    skip = _IncrementalDOM$skip === void 0 ? noop : _IncrementalDOM$skip,
    _IncrementalDOM$skipN = _IncrementalDOM.skipNode,
    skipNode = _IncrementalDOM$skipN === void 0 ? noop : _IncrementalDOM$skipN,
    text = _IncrementalDOM.text; // @see https://github.com/davidjamesstone/superviews.js/issues/32#issuecomment-274372713

var attributesIDom = attributes || {};
var attrIDom = attr;
var elementCloseIDom = elementClose;
var elementOpenEndIDom = elementOpenEnd;
var elementOpenStartIDom = elementOpenStart;
var notificationsIDom = notifications;
var renderToStringIDom = renderToString;
var textIDom = text;
var skipIDom = skip;
var skipNodeIDom = skipNode;
var patch = function patch(node, fn) {
  return schedule(function () {
    return patchOuter(node, fn);
  });
};

attributesIDom.value = function (el, _name, value) {
  return el.value = value === null || typeof value === 'undefined' ? '' : value;
};

attributesIDom.checked = function (el, _name, value) {
  return el.checked = !!value;
};

notificationsIDom.nodesDeleted = function (nodes) {
  return nodes.forEach(function (node) {
    return node && node._elementDetached && schedule(node._elementDetached);
  });
};

notificationsIDom.nodesCreated = function (nodes) {
  return nodes.forEach(function (node) {
    return node && node._elementAttached && schedule(node._elementAttached);
  });
};

var handlersCache = /*#__PURE__*/new WeakMap();
var eventTypes = /*#__PURE__*/new Map();
function h(tagName, attributes, children) {
  var attrs = attributes || {};
  var outerArgs = arguments;
  var names = Object.keys(attrs);
  var length = names.length;

  function render(options) {
    if (options === void 0) {
      options = {
        skip: false
      };
    }

    var element;
    var elementAttached = attrs.elementAttached || options.elementAttached;
    var elementDetached = attrs.elementDetached || options.elementDetached;
    var key = attrs.key || options.key || null;
    var skip = attrs.skip || options.skip || null;
    elementOpenStartIDom(tagName, key);
    setAttributes({
      attributes: attrs,
      names: names,
      length: length
    });
    elementOpenEndIDom();

    if (skip) {
      skipIDom();
      element = elementCloseIDom(tagName);
    } else {
      if (Array.isArray(children)) {
        children.forEach(renderChildren);
      } else {
        forEachChildInArgs(outerArgs, renderChildren);
      }

      element = elementCloseIDom(tagName) || {};
      element._elementAttached = elementAttached;
      element._elementDetached = elementDetached;

      if (typeof window !== 'undefined') {
        setEvents({
          attributes: attrs,
          names: names,
          length: length,
          element: element
        });
      }

      if (typeof attrs.ref === 'function') {
        attrs.ref(element);
      }
    }

    return element;
  }

  return render;
}

function isEvent(name) {
  return /^on/.test(name);
}

function isSkip(name) {
  return /^skip$/.test(name);
}

function isRef(name) {
  return /^ref$/.test(name);
}

function setAttributes(_ref) {
  var attributes = _ref.attributes,
      names = _ref.names,
      length = _ref.length;

  for (var i = 0; i < length; i++) {
    var name = names[i];

    if (name && !isEvent(name) && !isSkip(name) && !isRef(name)) {
      var classProp = name === 'className' ? 'class' : '';
      var forProp = name === 'htmlFor' ? 'for' : ''; // @see: https://github.com/shahata/dasherize/blob/master/index.js#L26

      var hyphenated = name.replace(/[A-Z](?:(?=[^A-Z])|[A-Z]*(?=[A-Z][^A-Z]|$))/g, function (s, j) {
        return (j > 0 ? '-' : '') + s.toLowerCase();
      });
      attrIDom(forProp || classProp || hyphenated, attributes[name]);
    }
  }
}

function setEvents(_ref2) {
  var attributes = _ref2.attributes,
      names = _ref2.names,
      length = _ref2.length,
      element = _ref2.element;

  for (var i = 0; i < length; i++) {
    var name = names[i];

    if (name && isEvent(name)) {
      var _extends2;

      var eventName = name.toLowerCase().substring(2);
      var handlers = handlersCache.get(element) || {};

      if (!eventTypes.has(eventName)) {
        document.body.addEventListener(eventName, eventProxy, false);
      }

      eventTypes.set(eventName, 1);
      handlersCache.set(element, _extends(_extends({}, handlers), {}, (_extends2 = {}, _extends2[eventName] = attributes[name], _extends2)));
    }
  }
}

function eventProxy(event) {
  var element = event.target;
  var handlers = handlersCache.get(element) || {};
  var type = event.type;

  if (handlers[type]) {
    return handlers[type](event);
  }
}

function forEachChildInArgs(args, iteratee) {
  if (args.length > 2) {
    for (var i = 2; i < args.length; i++) {
      iteratee(args[i]);
    }
  }
}

function renderChildren(children) {
  var str = typeof children === 'string' ? textIDom(children) : '';
  return typeof children === 'function' ? children() : str;
}

var APP_ID = 'app';

// @see: https://github.com/purposeindustries/window-or-global/
var root = // eslint-disable-next-line
typeof self === 'object' && self.self === self && self || // @ts-ignore
typeof global === 'object' && global.global === global && global || window;

var setClick;
var matcher = /*#__PURE__*/storeMatcher();

var getParams = function getParams(_ref) {
  var params = _ref.params;
  return params;
};

var getTitle = function getTitle(match) {
  return match.title(getParams(match));
};

var redirect = function redirect(href) {
  var link = root.document.createElement('a');
  link.setAttribute('href', href);
  setClick(link);
};
var to = function to(event) {
  var link = event.target;
  event.preventDefault();
  setClick(link);
};

var initClick = function initClick(options) {
  return function (link) {
    var handler = function handler(event) {
      link.removeEventListener('click', handler);
      render({
        options: options,
        event: event
      });
    };

    link.addEventListener('click', handler);
    link.click();
  };
};

function router(options) {
  var path = root.location.pathname;
  var match = matcher.set(options, path);
  setClick = initClick(options);
  popState(options);
  setTitle({
    match: match,
    path: path,
    isPopState: false
  });
  return {
    view: match.view || options.view
  };
}

function popState(options) {
  root.addEventListener('popstate', function (event) {
    return render({
      options: options,
      event: event
    });
  });
}

function render(_ref2) {
  var options = _ref2.options,
      event = _ref2.event;
  var target = event.currentTarget;
  var path = target.pathname || root.location.pathname;
  var match = matcher.set(options, path);
  event.preventDefault();
  setTitle({
    match: match,
    path: path,
    isPopState: event.type === 'popstate'
  });
  patch(document.getElementById(options.routerId || options.id || APP_ID), match.view());
}

function setTitle(_ref3) {
  var match = _ref3.match,
      path = _ref3.path,
      isPopState = _ref3.isPopState;
  var title = getTitle(match) || root.document.title;

  if (!isPopState) {
    root.history.pushState({}, title, path);
  }

  root.document.title = title;
} // @see https://github.com/jesseditson/fs-router/blob/v0.2.0/index.js#L7


function addMatch(url, path) {
  var matched;
  var paramPattern = /:([^/]+)/;
  var paramNames = [];

  while (matched = path.match(paramPattern)) {
    path = path.replace(paramPattern, '([^?/]+)');
    paramNames.push(matched[1]);
  }

  var pattern = new RegExp("^" + path + "(\\?(.*)|$)", 'i');
  var match = url.match(pattern);

  if (match) {
    return paramNames.reduce(function (map, param, index) {
      map[param] = match[index + 1];
      return map;
    }, {});
  }
}

function storeMatcher() {
  var storeMatches = new Map();

  var noop = function noop() {};

  return {
    set: function set(options, url) {
      if (!storeMatches.has(url)) {
        var rout = '';
        var params;
        var optionsRouter = options.router;
        var routes = Object.keys(optionsRouter);
        var length = routes.length;

        for (var i = 0; i < length; i = i + 1) {
          rout = routes[i];
          params = addMatch(url, routes[i]);

          if (params) {
            break;
          }
        }

        var item = optionsRouter[rout];
        storeMatches.set(url, {
          params: params,
          title: item.title || noop,
          view: item.view || noop
        });
      }

      return storeMatches.get(url);
    }
  };
}

function app(options) {
  var _appContainer$parentN;

  var plugin = options.router && router(options);
  var view = plugin && plugin.view || options.view;
  var fragment = new DocumentFragment();
  var tempContainer = document.createElement('div');
  var appContainer = document.getElementById(options.id || APP_ID);
  if (appContainer === null || appContainer === void 0 ? void 0 : appContainer.hasAttribute('data-skip')) return;
  fragment.appendChild(tempContainer);
  patch(fragment.querySelector('div'), view());
  appContainer === null || appContainer === void 0 ? void 0 : (_appContainer$parentN = appContainer.parentNode) === null || _appContainer$parentN === void 0 ? void 0 : _appContainer$parentN.replaceChild(tempContainer, appContainer);
}

var schedule$1 = /*#__PURE__*/quicktask();
function componentFactory(_ref) {
  var hooks = _ref.hooks,
      newProps = _ref.newProps,
      key = _ref.key,
      onCreate = _ref.onCreate,
      onDelete = _ref.onDelete,
      render = _ref.render;

  var noop = function noop() {};

  var keys = new Set();
  var element;
  var _created = noop;
  var _deleted = noop;
  var props = {};

  var _update = function update(currentHook) {
    return function (initialState) {
      var setStateHookIndex = currentHook;

      var setState = function setState(newState) {
        schedule$1(function () {
          hooks.set(setStateHookIndex, newState);
          patch(element, renderElement(props));
        });
      };

      if (!hooks.has(currentHook)) {
        hooks.set(currentHook, initialState);
        keys.add(currentHook);
      }

      return [hooks.get(currentHook), setState];
    };
  };

  var _execute = function execute(currentHook) {
    return function (callback, depArray) {
      var hasNoDeps = !depArray;
      var deps = hooks.get(currentHook);
      var hasChangedDeps = deps ? !depArray.every(function (item, i) {
        return JSON.stringify(item) === JSON.stringify(deps[i]);
      }) : true;

      if (hasNoDeps || hasChangedDeps) {
        schedule$1(function () {
          hooks.set(currentHook, depArray);
          keys.add(currentHook);
          callback();
        });
      }
    };
  };

  var renderElement = function renderElement(nextProps) {
    var currentHook = 0;
    props = nextProps || {};
    var reRender = render({
      created: function created(callback) {
        return _created = callback || _created;
      },
      deleted: function deleted(callback) {
        return _deleted = callback || _deleted;
      },
      execute: function execute(callback, deps) {
        return _execute("execute-" + key + "-" + currentHook++)(callback, deps);
      },
      key: key,
      props: props,
      update: function update(initialState) {
        return _update("update-" + key + "-" + currentHook++)(initialState);
      }
    });

    if (reRender === null) {
      return function () {
        return null;
      };
    }

    return function elementCallback() {
      element = reRender({
        key: key,
        elementAttached: function elementAttached() {
          var e = element;
          e.__hooks = keys;
          e.__deleted = _deleted;

          if (props.view) {
            e.dataset.view = props.view;
          }

          _created(element);

          onCreate(key, element);
        },
        elementDetached: function elementDetached() {
          onDelete(key, element);
        }
      });
      return element;
    };
  };

  return renderElement(newProps);
}

var keyCounter = 1;

var keyGenerator = function keyGenerator() {
  return "__" + keyCounter++ + "__";
};

var contains = /*#__PURE__*/new Map();
var elements = /*#__PURE__*/new Map();
var hooks = /*#__PURE__*/new Map();

var onDelete = function onDelete(key) {
  (contains.get(key) || []).forEach(function (k) {
    var containedElement = elements.get(k);

    if (containedElement) {
      containedElement.__deleted(containedElement);

      containedElement.__hooks.forEach(function (h) {
        return hooks["delete"](h);
      });
    }

    contains["delete"](k);
    elements["delete"](k);
  });
};

var setChildren = function setChildren(element, key) {
  // Set children and itself
  elements.forEach(function (_, k) {
    var domElement = elements.get(k);

    if (domElement && domElement.contains(element)) {
      contains.set(k, [].concat(contains.get(k) || [], [key]));
    }
  });
};

var onCreate = function onCreate(key, element) {
  elements.set(key, element);
  setChildren(element, key);
};

function component(render) {
  function factory(key, newProps) {
    var _key = newProps && newProps.key ? newProps.key + key : key;

    return componentFactory({
      hooks: hooks,
      key: _key,
      newProps: newProps || {},
      onCreate: onCreate,
      onDelete: onDelete,
      render: render
    });
  }

  function init() {
    return factory.bind(null, keyGenerator());
  }

  return init;
}

exports.app = app;
exports.attrIDom = attrIDom;
exports.attributesIDom = attributesIDom;
exports.component = component;
exports.elementCloseIDom = elementCloseIDom;
exports.elementOpenEndIDom = elementOpenEndIDom;
exports.elementOpenStartIDom = elementOpenStartIDom;
exports.h = h;
exports.notificationsIDom = notificationsIDom;
exports.patch = patch;
exports.redirect = redirect;
exports.renderToStringIDom = renderToStringIDom;
exports.router = router;
exports.skipIDom = skipIDom;
exports.skipNodeIDom = skipNodeIDom;
exports.textIDom = textIDom;
exports.to = to;
//# sourceMappingURL=h-h.cjs.development.js.map
