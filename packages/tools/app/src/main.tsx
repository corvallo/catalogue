import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "@catalogue/app/app";
import "@catalogue/shared/styles/theme.css";
import "@catalogue/shared/styles/base.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
