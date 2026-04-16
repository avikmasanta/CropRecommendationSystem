import React, { useState, useContext } from 'react'
import { CloudSun, MapPin, Loader2, Thermometer, Droplets, Wind, CloudRain, Sprout, Sun, Umbrella } from 'lucide-react'
import { LangContext } from '../App'

export default function WeatherPage({ weather, setWeather }) {
  const { t } = useContext(LangContext)
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [forecast, setForecast] = useState([])
  const [locationName, setLocationName] = useState('')
  const [tips, setTips] = useState(null)
  const [tipsLoading, setTipsLoading] = useState(false)

  const fetchWeather = async () => {
    if (!location.trim()) return
    setLoading(true); setError(null)
    try {
      const geo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`).then(r => r.json())
      if (!geo.results?.length) throw new Error('Location not found')
      const { latitude, longitude, name, country } = geo.results[0]
      setLocationName(`${name}, ${country}`)

      const wx = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto&forecast_days=7`).then(r => r.json())
      const c = wx.current
      const d = wx.daily || {}

      setWeather({ temp: c.temperature_2m, humidity: c.relative_humidity_2m, rain: c.rain, wind: c.wind_speed_10m })

      const fc = (d.time || []).map((time, i) => ({
        date: time,
        maxTemp: d.temperature_2m_max?.[i],
        minTemp: d.temperature_2m_min?.[i],
        rain: d.precipitation_sum?.[i],
        wind: d.wind_speed_10m_max?.[i],
      }))
      setForecast(fc)

      // Get farming tips from Gemini
      setTipsLoading(true)
      try {
        const tipsRes = await fetch('/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            features: { temperature: c.temperature_2m, humidity: c.relative_humidity_2m, rainfall: c.rain, wind: c.wind_speed_10m, location: `${name}, ${country}` },
            prediction: 'weather-advice',
            language: 'English'
          })
        })
        const tipsData = await tipsRes.json()
        setTips(tipsData.explanation)
      } catch { setTips(null) }
      finally { setTipsLoading(false) }

    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }

  const getActivity = () => {
    if (!weather.temp) return []
    const acts = []
    if (weather.temp >= 15 && weather.temp <= 35) acts.push({ label: 'Planting', ok: true })
    else acts.push({ label: 'Planting', ok: false })
    if (weather.rain < 5 && weather.humidity < 80) acts.push({ label: 'Harvesting', ok: true })
    else acts.push({ label: 'Harvesting', ok: false })
    if (weather.wind < 20) acts.push({ label: 'Spraying', ok: true })
    else acts.push({ label: 'Spraying', ok: false })
    acts.push({ label: 'Irrigation', ok: weather.rain < 2 })
    return acts
  }

  return (
    <div className="page-content">
      <div className="page-header" style={{ animation: 'revealUp 0.4s ease' }}>
        <h1 className="page-title">Weather & Advice</h1>
        <p className="page-subtitle">Get forecasts and actionable farming tips for your location.</p>
      </div>

      {/* Location Input */}
      <div className="card" style={{ marginBottom: '1.5rem', animation: 'revealUp 0.4s ease 60ms both' }}>
        <div className="card-body">
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: 200 }}>
              <label><MapPin size={12} style={{ display: 'inline', marginRight: 4 }} /> Location</label>
              <div className="input-wrap">
                <span className="input-icon"><MapPin size={14} /></span>
                <input className="field" type="text" placeholder="e.g., Delhi, India"
                  value={location} onChange={e => setLocation(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), fetchWeather())} />
              </div>
            </div>
            <button className="btn btn-primary" onClick={fetchWeather} disabled={loading} style={{ height: 48 }}>
              {loading ? <><Loader2 size={15} className="spin" /> Analyzing...</> : <><CloudSun size={16} /> Get Analysis</>}
            </button>
          </div>
          {error && <div className="error-box" style={{ marginTop: 12 }}>{error}</div>}
        </div>
      </div>

      {weather.temp !== null && (
        <>
          {/* Current Weather */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {locationName && (
              <div className="card" style={{ padding: '1.5rem', gridColumn: '1 / -1', animation: 'revealUp 0.4s ease 120ms both' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                  Current Weather
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-head)' }}>
                  Weather for {locationName}
                </div>
              </div>
            )}

            {[
              { label: 'Temperature', value: `${weather.temp}°C`, icon: Thermometer, color: '#e65100', bg: 'rgba(230, 81, 0, 0.08)' },
              { label: 'Humidity', value: `${weather.humidity}%`, icon: Droplets, color: '#0277bd', bg: 'rgba(2,119,189,0.08)' },
              { label: 'Rainfall', value: `${weather.rain} mm`, icon: CloudRain, color: '#2e7d32', bg: 'rgba(46,125,50,0.08)' },
              { label: 'Wind Speed', value: `${weather.wind} km/h`, icon: Wind, color: '#6a1b9a', bg: 'rgba(106,27,154,0.08)' },
            ].map((item, idx) => (
              <div key={item.label} className="card" style={{ padding: '1.25rem', animation: `revealUp 0.4s ease ${(idx + 2) * 60}ms both` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <item.icon size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-head)', color: 'var(--txt-primary)' }}>{item.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Suitable Activities */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.5rem' }}>
            <div className="card" style={{ padding: '1.5rem', animation: 'revealUp 0.4s ease 360ms both' }}>
              <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sprout size={16} color="var(--clr-primary)" /> Suitable Activities
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {getActivity().map(act => (
                  <div key={act.label} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                    borderRadius: 8, background: act.ok ? 'rgba(45,106,79,0.06)' : 'rgba(197,48,48,0.05)',
                    border: `1px solid ${act.ok ? 'rgba(45,106,79,0.15)' : 'rgba(197,48,48,0.12)'}`
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: act.ok ? '#2D6A4F' : '#c53030' }} />
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: act.ok ? 'var(--clr-primary)' : '#c53030' }}>{act.label}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'var(--txt-muted)' }}>{act.ok ? 'Recommended' : 'Not Ideal'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Farming Tips */}
            <div className="card" style={{ padding: '1.5rem', animation: 'revealUp 0.4s ease 420ms both' }}>
              <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sun size={16} color="#D4A373" /> Farming Recommendations
              </h3>
              {tipsLoading ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--txt-muted)' }}>
                  <Loader2 size={24} className="spin" style={{ marginBottom: 8 }} />
                  <p>Generating AI farming tips...</p>
                </div>
              ) : tips ? (
                <div style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--txt-secondary)', whiteSpace: 'pre-wrap' }}>{tips}</div>
              ) : (
                <div style={{ fontSize: '0.9rem', color: 'var(--txt-muted)', textAlign: 'center', padding: '1.5rem' }}>
                  AI farming tips will appear here after weather analysis.
                </div>
              )}
            </div>
          </div>

          {/* 7-Day Forecast */}
          {forecast.length > 0 && (
            <div className="card" style={{ padding: '1.5rem', animation: 'revealUp 0.4s ease 480ms both' }}>
              <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, fontSize: '1.05rem', marginBottom: '1.25rem' }}>
                7-Day Forecast
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                {forecast.map((day, idx) => (
                  <div key={day.date} style={{
                    background: 'var(--bg-input)', borderRadius: 12, padding: '1rem', textAlign: 'center',
                    border: '1px solid var(--border)', transition: 'all 0.2s',
                    animation: `revealUp 0.3s ease ${idx * 40}ms both`
                  }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--txt-muted)', fontWeight: 600, marginBottom: 8 }}>
                      {new Date(day.date).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 6 }}>
                      {day.rain > 5 ? <Umbrella size={18} color="#0277bd" /> : <Sun size={18} color="#e65100" />}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', fontFamily: 'var(--font-head)' }}>
                      {day.maxTemp}°
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--txt-muted)' }}>
                      {day.minTemp}° / {day.rain}mm
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {!weather.temp && (
        <div className="card" style={{ padding: '4rem 2rem', textAlign: 'center', animation: 'revealUp 0.4s ease 120ms both' }}>
          <CloudSun size={48} color="var(--txt-muted)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontFamily: 'var(--font-head)', fontWeight: 700, marginBottom: 8 }}>Enter Your Location</h3>
          <p style={{ color: 'var(--txt-muted)', maxWidth: 400, margin: '0 auto' }}>
            Type your city or village name above to get weather data and farming recommendations.
          </p>
        </div>
      )}
    </div>
  )
}
