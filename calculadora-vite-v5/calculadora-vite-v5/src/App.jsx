import React, { useEffect, useMemo, useState } from 'react'

function formatUF(val){return `${val.toFixed(3)} UF`}
function formatCLP(val){return val.toLocaleString('es-CL',{style:'currency',currency:'CLP',maximumFractionDigits:0})}

export default function App(){
  const [countries, setCountries] = useState({})
  const [countryCode, setCountryCode] = useState('CL')
  const [tipo,setTipo]=useState('')
  const [m2,setM2]=useState(100)
  const [ufValor,setUfValor]=useState(39428)
  const [recargos,setRecargos]=useState([])

  const RECARGOS = [
    { id: 'viajes', label: '🚗 Viajes (+10%)', value: 10 },
    { id: 'urgencia', label: '⏱ Urgencia (+20%)', value: 20 },
    { id: 'complejidad', label: '🧩 Complejidad normativa (+15%)', value: 15 },
    { id: 'especialistas', label: '🤝 +3 especialistas (+10%)', value: 10 },
  ]

  useEffect(()=>{
    fetch('/countries.json').then(r=>r.json()).then(setCountries)
  },[])

  useEffect(()=>{
    if(countries[countryCode]){
      const keys = Object.keys(countries[countryCode].ranges || {})
      if(keys.length){ setTipo(keys[0]) }
    }
  },[countries, countryCode])

  const data = countries[countryCode] || {}
  const RANGOS = data.ranges || {}
  const range = RANGOS[tipo] || [0,0,0]
  const recargoTotal = recargos.reduce((s,r)=>s+r.value,0)

  const resultados = useMemo(()=>{
    const [b,m,a] = range
    const r = (x)=> x*(1+recargoTotal/100)
    return {
      bajo:{ ufm2:b, ufTotal:r(b*m2), clpTotal:r(b*m2)*ufValor },
      medio:{ ufm2:m, ufTotal:r(m*m2), clpTotal:r(m*m2)*ufValor },
      alto:{ ufm2:a, ufTotal:r(a*m2), clpTotal:r(a*m2)*ufValor },
    }
  },[range,m2,ufValor,recargoTotal])

  const disabled = countryCode !== 'CL' and (!RANGOS or Object.keys(RANGOS).length===0)

  return (
    <div className="container">
      <header>
        <div className="brand">
          <img src="/logo_joc.png" alt="J. Ovando Cid & Arquitectos"/>
          <h1>Calculadora de Precios</h1>
        </div>
      </header>
      <h2>Simula el precio de tu proyecto en segundos</h2>

      <div className="grid grid-2">
        <div className="card">
          <label>País</label>
          <select value={countryCode} onChange={e=>setCountryCode(e.target.value)}>
            {Object.entries(countries).map(([code,c])=>(
              <option key={code} value={code}>{c.name}</option>
            ))}
          </select>
          <p className="note">{data?.note || ''}</p>
        </div>
        <div className={"card " + (disabled?'disabled':'')}>
          <label>Tipo / destino</label>
          <select value={tipo} onChange={e=>setTipo(e.target.value)} disabled={disabled}>
            {Object.keys(RANGOS).map(t=><option key={t}>{t}</option>)}
          </select>
        </div>
        <div className={"card " + (disabled?'disabled':'')}>
          <label>Superficie (m²)</label>
          <input type="number" value={m2} onChange={e=>setM2(Math.max(0, Number(e.target.value)))} disabled={disabled}/>
        </div>
        <div className={"card " + (disabled?'disabled':'')}>
          <label>Valor UF (CLP) <small className="muted">(editable)</small></label>
          <input type="number" value={ufValor} onChange={e=>setUfValor(Math.max(1, Number(e.target.value)))} disabled={disabled || !data.uf}/>
        </div>
      </div>

      <div className={"card " + (disabled?'disabled':'')}>
        <label>Recargos adicionales</label>
        <div className="chips">
          {RECARGOS.map(r=>(
            <label key={r.id} className="chip">
              <input type="checkbox" checked={recargos.includes(r)} onChange={()=>{
                setRecargos(prev=>prev.includes(r)?prev.filter(x=>x!==r):[...prev,r])
              }} disabled={disabled}/> {r.label}
            </label>
          ))}
        </div>
      </div>

      <div className={"results " + (disabled?'disabled':'')}>
        {["bajo","medio","alto"].map(n=>(
          <div key={n} className="card">
            <div className="kicker">{n}</div>
            <div style={{fontSize:22,fontWeight:700,marginTop:6}}>{formatUF(resultados[n].ufTotal)}</div>
            <div style={{fontSize:14,opacity:.8}}>{formatCLP(resultados[n].clpTotal)}</div>
            <div style={{fontSize:12,opacity:.6,marginTop:8}}>Base: {formatUF(resultados[n].ufm2)} · m²: {m2}</div>
          </div>
        ))}
      </div>

      <details>
        <summary>📋 Alcance general</summary>
        <ul>
          <li>Planos arquitectónicos completos según DOM</li>
          <li>Coordinación básica de especialidades</li>
          <li>Entrega digital lista para permisos</li>
          <li>No incluye dirección de obra ni tasas municipales</li>
        </ul>
      </details>

      <details>
        <summary>🏗 Valores de construcción por material</summary>
        <ul>
          <li>Madera ligera/prefab: 10–18 UF/m²</li>
          <li>Albañilería: 18–25 UF/m²</li>
          <li>Hormigón armado: 23–30 UF/m²</li>
          <li>Steel frame / mixto: 20–30 UF/m²</li>
        </ul>
        <small className="muted">Valores referenciales, pueden variar según contexto y mercado.</small>
      </details>

      <div className="banner">
        <strong>¿Quieres una propuesta formal?</strong>
        <a className="button" href="mailto:contacto@jovandocid.com?subject=Cotizaci%C3%B3n%20desde%20Calculadora&body=Hola%2C%20me%20interesa%20cotizar%20mi%20proyecto.%20(Agrega%20m%C2%B2%2C%20tipo%20y%20comuna)">Enviar correo</a>
        <span className="muted">J. Ovando Cid & Arquitectos · Ecosistema Do+Lab</span>
      </div>
    </div>
  )
}
