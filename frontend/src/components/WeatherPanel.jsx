import { useContext } from 'react'
import { CloudSun, Thermometer, Droplets, CloudRain, Wind } from 'lucide-react'
import { LangContext } from '../App'

export default function WeatherPanel({ weather }) {
  const { t } = useContext(LangContext)
  const stats = [
    { key: 'temp', label: t.tempStat, unit: '°C', icon: <Thermometer size={18} />, color: 'rgba(248,113,113,0.2)', iconColor: '#f87171' },
    { key: 'humidity', label: t.humidityStat, unit: '%', icon: <Droplets size={18} />, color: 'rgba(56,189,248,0.2)', iconColor: '#38bdf8' },
    { key: 'rain', label: t.rainStat, unit: 'mm', icon: <CloudRain size={18} />, color: 'rgba(129,140,248,0.2)', iconColor: '#818cf8' },
    { key: 'wind', label: t.windStat, unit: 'km/h', icon: <Wind size={18} />, color: 'rgba(34,197,94,0.2)', iconColor: 'var(--clr-primary)' },
  ]
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-icon"><CloudSun size={18} /></div>
        <div>
          <div className="card-title">{t.weatherTitle}</div>
          <div className="card-subtitle">{t.weatherSub}</div>
        </div>
      </div>
      <div className="card-body">
        <div className="weather-stats">
          {stats.map(s => {
            const val = weather[s.key]
            const haValue = val !== null && val !== undefined && val !== ''
            return (
              <div className="stat-item" key={s.key} style={{ borderColor: haValue ? s.iconColor + '44' : 'var(--border)' }}>
                <div className="stat-icon" style={{ background: s.color, color: s.iconColor }}>{s.icon}</div>
                <div>
                  <div className="stat-label">{s.label}</div>
                  <div className="stat-value" style={{ color: haValue ? s.iconColor : 'var(--txt-muted)', transition: 'all 0.5s' }}>
                    {haValue
                      ? <span style={{ animation: 'fadeIn 0.4s ease' }}>{val} {s.unit}</span>
                      : <span style={{ fontWeight: 400, fontSize: '0.85rem' }}>—</span>
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
