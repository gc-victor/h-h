import { app } from '../src/app.js';
import { component } from '../src/component.js';

const App = component(() => {
    return <><h1 className="bold">h-h</h1></>;
})();

app(document.getElementById('app'), App());
