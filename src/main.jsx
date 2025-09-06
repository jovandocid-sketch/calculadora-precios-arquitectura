// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

const el = document.getElementById("app");
createRoot(el).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
