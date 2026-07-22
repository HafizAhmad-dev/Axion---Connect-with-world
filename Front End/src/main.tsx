import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { store } from "./Store/store.tsx";
import { Provider } from "react-redux";

import "./index.css";
import App from "./App.tsx";
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
);
