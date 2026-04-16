import { useContext } from 'react'
import { CloudSun, Thermometer, Droplets, CloudRain, Wind } from 'lucide-react'
import { LangContext } from '../App'

export default function WeatherPanel({ weather }) {
  const { t } = useContext(LangContext)
  const stats = [
    { key: 'temp', label: t.tempStat, unit: '°C', icon: <Thermometer size={16} /> },
    { key: 'humidity', label: t.humidityStat, unit: '%', icon: <Droplets size={16} /> },
    { key: 'rain', label: t.rainStat, unit: 'mm', icon: <CloudRain size={16} /> },
    { key: 'wind', label: t.windStat, unit: 'km/h', icon: <Wind size={16} /> },
  ]
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-icon"><CloudSun size={16} /></div>
        <div>
          <div className="card-title">{t.weatherTitle}</div>
          <div className="card-subtitle">{t.weatherSub}</div>
        </div>
      </div>
      <div className="card-body" style={{ padding: '0.75rem 1.5rem' }}>
        <div className="weather-stats">
          {stats.map(s => {
            const val = weather[s.key]
            const hasValue = val !== null && val !== undefined && val !== ''
            return (
              <div className="stat-item" key={s.key}>
                <div className="stat-icon">{s.icon}</div>
                <div>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value" style={{ color: hasValue ? 'var(--txt-primary)' : 'var(--txt-muted)' }}>
                    {hasValue
                      ? <span>{val} {s.unit}</span>
                      : <span style={{ fontWeight: 400, fontSize: '0.8rem' }}>—</span>
                    }
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
