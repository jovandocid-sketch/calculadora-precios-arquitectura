// src/App.jsx
import React, { useMemo, useState } from "react";

const RANGOS = {
  "Vivienda unifamiliar": [0.8, 0.9, 1.0],
  "Vivienda en condominio": [0.9, 1.0, 1.1],
  "Comercial / Oficinas": [1.0, 1.2, 1.4],
};

function formatUF(n) {
  return `${n.toFixed(3)} UF`;
}

function formatCLP(n) {
  return n.toLocaleString("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });
}

export default function App() {
  const [tipo, setTipo] = useState("Vivienda unifamiliar");
  const [m2, setM2] = useState(100);
  const [ufCLP, setUfCLP] = useState(39428); // puedes cambiarlo después a automático SII
  const [recargo, setRecargo] = useState(0); // %

  const tasas = RANGOS[tipo];

  const cards = useMemo(() => {
    const factor = 1 + (Number(recargo) || 0) / 100;
    return tasas.map((t) => {
      const uf = (Number(m2) || 0) * t * factor;
      const clp = uf * (Number(ufCLP) || 0);
      return { t, uf, clp };
    });
  }, [tasas, m2, ufCLP, recargo]);

  return (
    <div style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto", padding: "24px", maxWidth: 960, margin: "0 auto" }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>Calculadora de Precios · UF/m² → UF & CLP</h1>
        <div style={{ color: "#555", marginTop: 6 }}>
          Rango UF/m² para <strong>{tipo}</strong>: {tasas.map((t) => t.toFixed(3)).join(" · ")} UF
        </div>
      </header>

      <div style={{ display: "grid", gap: 16 }}>
        <div>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Tipo / destino</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} style={inputStyle}>
            {Object.keys(RANGOS).map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Superficie (m²)</label>
          <input type="number" value={m2} onChange={(e) => setM2(e.target.value)} style={inputStyle} />
        </div>

        <div>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Valor UF (CLP)</label>
          <input type="number" value={ufCLP} onChange={(e) => setUfCLP(e.target.value)} style={inputStyle} />
          <div style={{ color: "#777", fontSize: 13, marginTop: 6 }}>
            (Luego lo podemos vincular al valor mensual del SII automáticamente)
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontWeight: 600, marginBottom: 6 }}>Recargo (%)</label>
          <input type="number" value={recargo} onChange={(e) => setRecargo(e.target.value)} style={inputStyle} />
        </div>
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", marginTop: 24 }}>
        {cards.map(({ t, uf, clp }, i) => (
          <div key={i} style={cardStyle}>
            <div style={{ fontSize: 12, color: "#555", letterSpacing: 1, textTransform: "uppercase", marginBottom: 8 }}>
              {i === 0 ? "Bajo" : i === 1 ? "Medio" : "Alto"}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{formatUF(uf)}</div>
            <div style={{ color: "#111", fontWeight: 600, marginBottom: 8 }}>{formatCLP(clp)}</div>
            <div style={{ fontSize: 12, color: "#666" }}>
              Base: {t.toFixed(3)} UF · m²: {Number(m2) || 0} {recargo ? `· recargo: ${recargo}%` : ""}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <a href="mailto:contacto@jovandocid.com" style={btnStyle}>Solicitar cotización por correo</a>
      </div>

      <footer style={{ marginTop: 28, color: "#666", fontSize: 13 }}>
        Desarrollado por <strong>J. Ovando Cid & Arquitectos · Do+Lab</strong>
      </footer>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 10,
  border: "1px solid #ccc",
  fontSize: 16,
  outline: "none",
};

const cardStyle = {
  border: "1px solid #e5e5e5",
  borderRadius: 16,
  padding: 16,
  background: "#fff",
  boxShadow: "0 1px 2px rgba(0,0,0,.04)",
};

const btnStyle = {
  display: "inline-block",
  padding: "12px 16px",
  borderRadius: 12,
  background: "#111",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 600,
};
