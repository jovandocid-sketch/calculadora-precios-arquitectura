import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <main style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1>Calculadora de Precios · UF/m² → UF & CLP</h1>
      <p>App cargada. (Si ves esto, Vite + React están funcionando)</p>
    </main>
  );
}

createRoot(document.getElementById("app")).render(<App />);
