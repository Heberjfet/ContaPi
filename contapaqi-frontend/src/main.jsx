import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const root = document.getElementById("root");
const rootElement = createRoot(root);
rootElement.render(
  <StrictMode>
    <App />
  </StrictMode>
);
