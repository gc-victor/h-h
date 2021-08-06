import {h} from "../src/h.js";
import {app} from "../src/app.js";
import {component} from "../src/component.js";
const App = component(() => {
  return /* @__PURE__ */ h("h1", {
    className: "bold"
  }, "h-h");
})();
app(document.getElementById("app"), App());
