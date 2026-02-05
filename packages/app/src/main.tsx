import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "@catalogue-lab/app/app";
import "@catalogue-lab/shared/styles/theme.css";
import "@catalogue-lab/shared/styles/base.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
