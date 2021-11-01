import { h as hh } from "../src/h.js";
function h(type, props, children) {
  return hh(type, props, arguments.length > 3 ? [].slice.call(arguments, 2) : children);
}
import { app } from "../src/app.js";
import { component } from "../src/component.js";
const App = component(() => {
  return /* @__PURE__ */ h("h1", {
    className: "bold"
  }, "h-h");
})();
app(document.getElementById("app"), App());
