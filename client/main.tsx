import { render } from "hono/jsx/dom";
import { App } from "./component/App.tsx";

const AppContainer = () => {
  return <App />;
};

render(<AppContainer />, document.body);
