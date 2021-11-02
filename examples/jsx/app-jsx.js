import { h as hh } from "../src/h.js";
var fragment = "__FRAGMENT__";
import { app } from "../src/app.js";
import { component } from "../src/component.js";
const App = component(() => {
  return /* @__PURE__ */ h(fragment, null, /* @__PURE__ */ h("h1", {
    className: "bold"
  }, "h-h"));
})();
app(document.getElementById("app"), App());
