import React, { useState, useEffect, useContext } from 'react'
import { Bell, CloudRain, Sun, Info, X, ExternalLink, Zap, Timer, MapPin } from 'lucide-react'
import { LangContext } from '../App'

export default function AlertSystem({ weather }) {
  const { t, lang } = useContext(LangContext)
  const [activeAlert, setActiveAlert] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const [forecast, setForecast] = useState(null)

  // Simulation of a "Live Scheme Feed"
  const SCHEME_NEWS = [
    {
      id: 1,
      title: lang === 'hi' ? 'नई पीएम-किसान किस्त जारी!' : 'New PM-Kisan Installment Released!',
      desc: lang === 'hi' ? 'भारत सरकार ने किसानों के खातों में ₹2,000 की अगली किस्त भेज दी है। अभी अपना स्टेटस चेक करें।' : 'Government of India has released the next installment of ₹2,000 to farmer accounts. Check your status now.',
      image: 'https://images.unsplash.com/photo-1590634331662-660d37539072?auto=format&fit=crop&q=80&w=800',
      link: 'https://pmkisan.gov.in/'
    },
    {
      id: 2,
      title: lang === 'hi' ? 'ड्रोन सब्सिडी योजना 2026' : 'Drone Subsidy Scheme 2026',
      desc: lang === 'hi' ? 'खेती में ड्रोन के उपयोग के लिए सरकार 50% तक की सब्सिडी दे रही है। आज ही आवेदन करें।' : 'Government is offering up to 50% subsidy for using drones in agriculture. Apply today.',
      image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800',
      link: 'https://agriwelfare.gov.in/'
    }
  ]

  useEffect(() => {
    const tomorrow = weather.forecast?.[1]
    
    if (tomorrow && tomorrow.rain > 0.5) {
        setActiveAlert({
            type: 'weather',
            title: lang === 'hi' ? 'कल बारिश का अलर्ट!' : 'Rainy Day Tomorrow!',
            msg: lang === 'hi' ? `कल ${tomorrow.rain}mm बारिश होने की संभावना है। अपनी फसलों को सुरक्षित रखें।` : `Expect ${tomorrow.rain}mm of rain tomorrow. Secure your crops and planning accordingly.`,
            icon: <CloudRain className="pulse-icon" size={20} />,
            color: '#60a5fa',
            day: 'tomorrow'
        })
    } else if (tomorrow && tomorrow.maxTemp > 35) {
        setActiveAlert({
            type: 'weather',
            title: lang === 'hi' ? 'कल तेज गर्मी की चेतावनी' : 'High Heat Tomorrow',
            msg: lang === 'hi' ? `कल तापमान ${tomorrow.maxTemp}°C तक जा सकता है। सिंचाई का ध्यान रखें।` : `Temperatures will hit ${tomorrow.maxTemp}°C tomorrow. Plan your irrigation early.`,
            icon: <Sun className="pulse-icon" size={20} />,
            color: '#fbbf24',
            day: 'tomorrow'
        })
    } else if (weather.rain > 0) {
        setActiveAlert({
            type: 'weather',
            title: lang === 'hi' ? 'आज बारिश हो रही है' : 'It is Raining Now',
            msg: lang === 'hi' ? 'क्षेत्र में वर्तमान में वर्षा हो रही है।' : 'Rain is currently being detected in your location.',
            icon: <CloudRain className="pulse-icon" size={20} />,
            color: '#38bdf8',
            day: 'today'
        })
    } else {
        // Fallback to a scheme alert if no major weather event tomorrow
        const randomScheme = SCHEME_NEWS[Math.floor(Math.random() * SCHEME_NEWS.length)]
        setActiveAlert({
            type: 'scheme',
            title: randomScheme.title,
            msg: randomScheme.desc,
            icon: <Zap className="pulse-icon" size={20} />,
            color: '#4ade80',
            data: randomScheme
        })
    }
  }, [weather, lang])

  if (!activeAlert) return null

  return (
    <div className="alert-system-container">
      <div className="alert-bar glass" style={{ borderLeft: `4px solid ${activeAlert.color}` }}>
        <div className="alert-icon-wrap" style={{ background: `${activeAlert.color}20`, color: activeAlert.color }}>
          {activeAlert.icon}
        </div>
        <div className="alert-content">
          <div className="alert-title">{activeAlert.title}</div>
          <div className="alert-msg">{activeAlert.msg}</div>
        </div>
        <button className="btn btn-sm btn-primary-alt" onClick={() => setShowPopup(true)} style={{ marginLeft: 'auto', gap: 6 }}>
          <Info size={14} /> {lang === 'hi' ? 'देखें' : 'View'}
        </button>
      </div>

      {showPopup && (
        <div className="alert-modal-overlay fade-in" onClick={() => setShowPopup(false)}>
          <div className="alert-modal-card slide-up" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowPopup(false)}><X size={20} /></button>
            <div className="modal-banner" style={{ 
                background: activeAlert.type === 'scheme' 
                    ? `url(${activeAlert.data.image}) center/cover` 
                    : `linear-gradient(135deg, ${activeAlert.color}, #1e293b)`
            }}>
                <div className="modal-banner-overlay">
                    <div className="badge" style={{ background: activeAlert.color }}>{activeAlert.type.toUpperCase()}</div>
                </div>
            </div>
            <div className="modal-body">
              <h2 className="modal-title">{activeAlert.title}</h2>
              <p className="modal-desc">{activeAlert.msg}</p>
              
              {activeAlert.type === 'scheme' && (
                <div className="modal-actions">
                  <a href={activeAlert.data.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-full" style={{ gap: 10 }}>
                    Official Website <ExternalLink size={16} />
                  </a>
                </div>
              )}

              {activeAlert.type === 'weather' && (
                 <div className="weather-forecast-mini">
                    {weather.forecast.map((f, i) => (
                        <div className="forecast-item" key={i} style={{ opacity: i === 0 ? 0.6 : 1 }}>
                            <span className="label">{i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : 'Next Day'}</span>
                            <span className="val">{f.maxTemp}°C | {f.rain}mm</span>
                        </div>
                    ))}
                 </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .alert-system-container {
          margin-bottom: 2rem;
          animation: fadeSlideDown 0.5s ease-out;
        }
        .alert-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border-radius: 1.25rem;
          background: var(--bg-surface);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-sm);
        }
        .alert-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .alert-title {
          font-weight: 800;
          font-size: 0.95rem;
          color: var(--txt-main);
        }
        .alert-msg {
          font-size: 0.85rem;
          color: var(--txt-muted);
        }
        .pulse-icon {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }

        /* Modal Styles */
        .alert-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
        }
        .alert-modal-card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: 2rem;
          width: 100%;
          max-width: 500px;
          overflow: hidden;
          position: relative;
          box-shadow: var(--shadow-2xl);
        }
        .modal-close {
          position: absolute;
          top: 1.25rem; right: 1.25rem;
          background: rgba(0,0,0,0.5);
          color: white;
          border: none;
          width: 36px; height: 36px;
          border-radius: 50%;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s;
        }
        .modal-close:hover { background: #ef4444; }
        .modal-banner {
          height: 200px;
          position: relative;
        }
        .modal-banner-overlay {
          position: absolute;
          top: 1.25rem; left: 1.25rem;
        }
        .modal-body {
          padding: 2rem;
        }
        .modal-title {
          font-size: 1.5rem;
          font-weight: 900;
          margin-bottom: 0.75rem;
          color: var(--txt-main);
        }
        .modal-desc {
          color: var(--txt-secondary);
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .weather-forecast-mini {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          background: var(--bg-accent);
          padding: 1.25rem;
          border-radius: 1.25rem;
        }
        .forecast-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .forecast-item .label {
          font-size: 0.75rem;
          color: var(--txt-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
        }
        .forecast-item .val {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--clr-primary);
        }

        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .slide-up { animation: slideUp 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); }
      `}</style>
    </div>
  )
}
