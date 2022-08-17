import ReactDOM from "react-dom/client";
import ApolloProvider from "./ApolloProvider";

import "./index.css";
import * as serviceWorker from "./serviceWorker";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(ApolloProvider);

serviceWorker.unregister();
