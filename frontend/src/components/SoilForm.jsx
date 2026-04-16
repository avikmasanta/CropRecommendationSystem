import { useState, useRef, useContext, useEffect } from 'react'
import { Thermometer, Droplets, CloudRain, CloudSun, Loader2, Wand2, Search, MapPin, ChevronDown, FlaskConical, Leaf, Gauge } from 'lucide-react'
import { LangContext } from '../App'

const SAMPLE = { N: 85, P: 58, K: 41, temperature: 21.77, humidity: 80.31, ph: 7.03, rainfall: 226.65 }

export default function SoilForm({ models, weather, onWeatherFetched, onSubmit, loading, initialLocation }) {
  const { t } = useContext(LangContext)
  const [values, setValues] = useState({ N: '', P: '', K: '', ph: '', temperature: '', humidity: '', rainfall: '', model: '' })
  const [location, setLocation] = useState(initialLocation || '')
  const [wxLoading, setWxLoading] = useState(false)
  const [wxStatus, setWxStatus] = useState(null)
  const locRef = useRef(null)

  useEffect(() => {
    if (initialLocation) setLocation(initialLocation)
  }, [initialLocation])

  useEffect(() => {
    if (weather.temp !== null && !values.temperature) {
      setValues(prev => ({ 
        ...prev, 
        temperature: weather.temp, 
        humidity: weather.humidity, 
        rainfall: weather.rain 
      }))
    }
  }, [weather])

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

  const RANGES = {
    N: { min: 0, max: 140 },
    P: { min: 5, max: 145 },
    K: { min: 5, max: 205 },
    ph: { min: 0, max: 14 },
    temperature: { min: 0, max: 60 },
    humidity: { min: 0, max: 100 },
    rainfall: { min: 0, max: 1000 }
  }

  const FIELDS = [
    { name: 'N', label: t.nitrogenLabel,   unit: 'mg/kg', placeholder: 'e.g. 85',  helpText: 'Nitrogen content in soil', ...RANGES.N },
    { name: 'P', label: t.phosphorusLabel, unit: 'mg/kg', placeholder: 'e.g. 58',  helpText: 'Phosphorus content in soil', ...RANGES.P },
    { name: 'K', label: t.potassiumLabel,  unit: 'mg/kg', placeholder: 'e.g. 41',  helpText: 'Potassium content in soil', ...RANGES.K },
    { name: 'ph', label: t.phLabel,         unit: '0–14',  placeholder: 'e.g. 7.0', helpText: '7 is neutral (ideal for most crops)', ...RANGES.ph },
  ]
  const CLIMATE = [
    { name: 'temperature', label: t.tempLabel,     unit: '°C', placeholder: 'e.g. 25',  helpText: 'Average temperature in your area', icon: <Thermometer size={14} />, ...RANGES.temperature },
    { name: 'humidity',    label: t.humidityLabel,  unit: '%',  placeholder: 'e.g. 70',  helpText: 'Average humidity percentage',         icon: <Droplets size={14} />, ...RANGES.humidity },
    { name: 'rainfall',    label: t.rainfallLabel,  unit: 'mm', placeholder: 'e.g. 150', helpText: 'Annual rainfall in millimeters',       icon: <CloudRain size={14} />, ...RANGES.rainfall },
  ]

  const isOutOfRange = (name, val) => val !== '' && (parseFloat(val) < RANGES[name]?.min || parseFloat(val) > RANGES[name]?.max)

  return (
    <form onSubmit={handleSubmit}>

      {/* Step 1: Soil nutrients */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div className="form-step-label">
          <FlaskConical size={15} />
          Soil Nutrients
        </div>
        <div className="form-grid">
          {FIELDS.map(f => (
            <div className="form-group" key={f.name}>
              <label>
                {f.label} <span className="unit">({f.unit})</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon"><Leaf size={14} /></span>
                <input className="field" type="number" step="any" required placeholder={f.placeholder}
                  min={f.min} max={f.max}
                  value={values[f.name]} onChange={e => set(f.name, e.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div style={{ fontSize: '0.78rem', color: isOutOfRange(f.name, values[f.name]) ? '#c53030' : 'var(--txt-muted)', marginTop: 4, paddingLeft: 2 }}>
                {isOutOfRange(f.name, values[f.name])
                  ? `Value must be between ${f.min} and ${f.max}`
                  : f.helpText
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 2: Weather / climate */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div className="form-step-label">
          <CloudSun size={15} />
          Weather & Climate
        </div>
        {/* Location auto-fill */}
        <div className="weather-fetch-panel" style={{ marginBottom: '1.25rem' }}>
          <div className="form-group" style={{ flex: 1, margin: 0 }}>
            <label style={{ color: 'var(--clr-primary)', fontWeight: 600 }}>
              <MapPin size={12} style={{ display: 'inline', marginRight: 4, verticalAlign: 'text-bottom' }} />
              Auto-fill from your city / village
            </label>
            <div className="input-wrap">
              <span className="input-icon"><MapPin size={14} /></span>
              <input className="field" type="text" ref={locRef}
                placeholder="Type your city or village name..."
                value={location}
                onChange={e => setLocation(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), fetchWeather())} />
            </div>
          </div>
          <button type="button"
            className={`btn ${wxStatus === 'success' ? 'btn-secondary' : 'btn-primary'}`}
            onClick={fetchWeather} disabled={wxLoading} style={{ flexShrink: 0, height: 44 }}>
            {wxLoading
              ? <><Loader2 size={15} className="spin" /> Getting...</>
              : wxStatus === 'success' ? <><Search size={15} /> Done</>
              : wxStatus === 'error' ? <>Not found</>
              : <><CloudSun size={15} /> Get Weather</>
            }
          </button>
        </div>

        <div className="form-grid">
          {CLIMATE.map(f => (
            <div className="form-group" key={f.name}>
              <label>
                {f.label} <span className="unit">({f.unit})</span>
              </label>
              <div className="input-wrap">
                <span className="input-icon">{f.icon}</span>
                <input className="field" type="number" step="any" required placeholder={f.placeholder}
                  min={f.min} max={f.max}
                  value={values[f.name]} onChange={e => set(f.name, e.target.value)}
                  inputMode="decimal"
                />
              </div>
              <div style={{ fontSize: '0.78rem', color: isOutOfRange(f.name, values[f.name]) ? '#c53030' : 'var(--txt-muted)', marginTop: 4, paddingLeft: 2 }}>
                {isOutOfRange(f.name, values[f.name])
                  ? `Value must be between ${f.min} and ${f.max}`
                  : f.helpText || ''
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 3: Model selection */}
      <div style={{ marginBottom: '0.5rem' }}>
        <div className="form-step-label">
          <Gauge size={15} />
          Prediction Model
        </div>
        <div className="form-group">
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

      {/* Action Buttons */}
      <div className="form-actions">
        <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
          {loading
            ? <><Loader2 size={16} className="spin" /> Analyzing...</>
            : <><Search size={16} /> Analyze Soil</>
          }
        </button>
        <button type="button" className="btn btn-secondary btn-lg" onClick={fillSample}
          title="Fill with sample values for demo"
          style={{ flexShrink: 0, paddingInline: 18 }}>
          <Wand2 size={16} /> Sample
        </button>
      </div>

      <div style={{ textAlign: 'center', marginTop: 10, fontSize: '0.8rem', color: 'var(--txt-muted)' }}>
        Click <strong>Sample</strong> to auto-fill demo values
      </div>

    </form>
  )
}
