import { useState, useRef, useContext } from 'react'
import { FlaskConical, Thermometer, Droplets, CloudRain, CloudSun, Loader2, Wand2, ArrowRight, MapPin, ChevronDown, Info } from 'lucide-react'
import { LangContext } from '../App'

const SAMPLE = { N: 85, P: 58, K: 41, temperature: 21.77, humidity: 80.31, ph: 7.03, rainfall: 226.65 }

function Tooltip({ text }) {
  const [show, setShow] = useState(false)
  return (
    <span style={{ position: 'relative', display: 'inline-flex', marginLeft: 6, verticalAlign: 'middle' }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <Info size={12} style={{ color: 'var(--txt-muted)', cursor: 'help' }} />
      {show && (
        <div style={{
          position: 'absolute', bottom: '130%', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 8,
          padding: '8px 12px', fontSize: '0.75rem', color: 'var(--txt-secondary)', whiteSpace: 'nowrap',
          zIndex: 100, boxShadow: 'var(--shadow-md)', pointerEvents: 'none',
          animation: 'fadeIn 0.15s ease'
        }}>
          {text}
          <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '5px solid var(--border)' }} />
        </div>
      )}
    </span>
  )
}

export default function SoilForm({ models, weather, onWeatherFetched, onSubmit, loading }) {
  const { t } = useContext(LangContext)
  const [values, setValues] = useState({ N: '', P: '', K: '', ph: '', temperature: '', humidity: '', rainfall: '', model: '' })
  const [location, setLocation] = useState('')
  const [wxLoading, setWxLoading] = useState(false)
  const [wxStatus, setWxStatus] = useState(null)
  const locRef = useRef(null)

  const set = (k, v) => setValues(prev => ({ ...prev, [k]: v }))

  const fillSample = () => {
    setValues(prev => ({ ...prev, ...SAMPLE }))
    onWeatherFetched({ temp: SAMPLE.temperature, humidity: SAMPLE.humidity, rain: SAMPLE.rainfall, wind: null })
  }

  const fetchWeather = async () => {
    if (!location.trim()) { locRef.current?.focus(); return }
    setWxLoading(true); setWxStatus(null)
    try {
      const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`).then(r => r.json())
      if (!geo.results?.length) throw new Error('Location not found')
      const { latitude, longitude, name, country } = geo.results[0]
      setLocation(`${name}, ${country}`)
      const wx = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m`).then(r => r.json())
      const c = wx.current
      setValues(prev => ({ ...prev, temperature: c.temperature_2m, humidity: c.relative_humidity_2m, rainfall: c.rain }))
      onWeatherFetched({ temp: c.temperature_2m, humidity: c.relative_humidity_2m, rain: c.rain, wind: c.wind_speed_10m })
      setWxStatus('success')
      setTimeout(() => setWxStatus(null), 3000)
    } catch {
      setWxStatus('error')
      setTimeout(() => setWxStatus(null), 3000)
    } finally { setWxLoading(false) }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const model = values.model || (models[0] ?? '')
    onSubmit({ ...values, model })
  }

  const FIELDS = [
    { name: 'N', label: t.nitrogenLabel, unit: 'mg/kg', placeholder: 'e.g. 85', icon: <FlaskConical size={14} />, tip: t.nitrogenTip },
    { name: 'P', label: t.phosphorusLabel, unit: 'mg/kg', placeholder: 'e.g. 58', icon: <FlaskConical size={14} />, tip: t.phosphorusTip },
    { name: 'K', label: t.potassiumLabel, unit: 'mg/kg', placeholder: 'e.g. 41', icon: <FlaskConical size={14} />, tip: t.potassiumTip },
    { name: 'ph', label: t.phLabel, unit: '0–14', placeholder: 'e.g. 7.0', icon: <FlaskConical size={14} />, tip: t.phTip },
  ]
  const CLIMATE = [
    { name: 'temperature', label: t.tempLabel, unit: '°C', placeholder: 'e.g. 25', icon: <Thermometer size={14} />, tip: t.tempTip },
    { name: 'humidity', label: t.humidityLabel, unit: '%', placeholder: 'e.g. 70', icon: <Droplets size={14} />, tip: t.humidityTip },
    { name: 'rainfall', label: t.rainfallLabel, unit: 'mm', placeholder: 'e.g. 150', icon: <CloudRain size={14} />, tip: t.rainfallTip },
  ]

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-icon"><FlaskConical size={18} /></div>
        <div>
          <div className="card-title">{t.soilCardTitle}</div>
          <div className="card-subtitle">{t.soilCardSub}</div>
        </div>
      </div>
      <div className="card-body">
        {/* Steps guide */}
        <div className="form-steps">
          <div className="form-step-label">{t.step1}</div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            {FIELDS.map(f => (
              <div className="form-group" key={f.name}>
                <label>
                  {f.label} <span className="unit">({f.unit})</span>
                  <Tooltip text={f.tip} />
                </label>
                <div className="input-wrap">
                  <span className="input-icon">{f.icon}</span>
                  <input className="field" type="number" step="any" required placeholder={f.placeholder}
                    value={values[f.name]} onChange={e => set(f.name, e.target.value)} />
                </div>
              </div>
            ))}

            {/* Weather fetch */}
            <div className="form-full">
              <div className="form-step-label" style={{ marginBottom: 10 }}>{t.step2}</div>
              <div className="weather-fetch-panel">
                <div className="form-group" style={{ flex: 1, margin: 0 }}>
                  <label style={{ color: '#86efac' }}>
                    <MapPin size={11} style={{ display: 'inline', marginRight: 4 }} />
                    {t.locationLabel}
                  </label>
                  <div className="input-wrap">
                    <span className="input-icon"><MapPin size={14} /></span>
                    <input className="field" type="text" ref={locRef}
                      placeholder={t.locationPlaceholder} value={location}
                      onChange={e => setLocation(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), fetchWeather())} />
                  </div>
                </div>
                <button type="button"
                  className={`btn ${wxStatus === 'success' ? 'btn-secondary' : 'btn-primary'}`}
                  onClick={fetchWeather} disabled={wxLoading} style={{ flexShrink: 0 }}>
                  {wxLoading
                    ? <><Loader2 size={16} className="spin" /> {t.fetchingBtn}</>
                    : wxStatus === 'success' ? <>{t.weatherSuccess}</>
                    : wxStatus === 'error' ? <>{t.weatherError}</>
                    : <><CloudSun size={16} /> {t.getWeatherBtn}</>
                  }
                </button>
              </div>
            </div>

            {CLIMATE.map(f => (
              <div className="form-group" key={f.name}>
                <label>
                  {f.label} <span className="unit">({f.unit})</span>
                  <Tooltip text={f.tip} />
                </label>
                <div className="input-wrap">
                  <span className="input-icon">{f.icon}</span>
                  <input className="field" type="number" step="any" required placeholder={f.placeholder}
                    value={values[f.name]} onChange={e => set(f.name, e.target.value)} />
                </div>
              </div>
            ))}

            <div className="form-group">
              <div className="form-step-label" style={{ marginBottom: 8 }}>{t.step3}</div>
              <label>{t.modelLabel}</label>
              <div className="input-wrap">
                <span className="input-icon"><ChevronDown size={14} /></span>
                <select className="field" value={values.model} onChange={e => set('model', e.target.value)}>
                  {models.length > 0
                    ? models.map(m => <option key={m} value={m}>{m}</option>)
                    : <option value="">{t.noModels}</option>}
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
              {loading
                ? <><Loader2 size={18} className="spin" /> {t.analyzingBtn}</>
                : <><ArrowRight size={18} /> {t.analyzeSoilBtn}</>
              }
            </button>
            <button type="button" className="btn btn-secondary btn-lg" onClick={fillSample} title={t.fillSampleTitle}>
              <Wand2 size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
