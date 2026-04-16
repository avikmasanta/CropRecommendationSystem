import React, { useState, useEffect, useContext } from 'react'
import { Bell, CloudRain, Sun, Info, X, ExternalLink, Zap, Timer, MapPin } from 'lucide-react'
import { LangContext } from '../App'

export default function AlertSystem({ weather }) {
  const { t, lang } = useContext(LangContext)
  const [activeAlert, setActiveAlert] = useState(null)
  const [showPopup, setShowPopup] = useState(false)

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
            title: lang === 'hi' ? 'कल बारिश का अलर्ट!' : 'Rain Expected Tomorrow',
            msg: lang === 'hi' ? `कल ${tomorrow.rain}mm बारिश होने की संभावना है। अपनी फसलों को सुरक्षित रखें।` : `Expect ${tomorrow.rain}mm of rain tomorrow. Secure your crops and plan accordingly.`,
            icon: <CloudRain size={18} />,
            color: '#4a90d9',
            day: 'tomorrow'
        })
    } else if (tomorrow && tomorrow.maxTemp > 35) {
        setActiveAlert({
            type: 'weather',
            title: lang === 'hi' ? 'कल तेज गर्मी की चेतावनी' : 'High Heat Tomorrow',
            msg: lang === 'hi' ? `कल तापमान ${tomorrow.maxTemp}°C तक जा सकता है। सिंचाई का ध्यान रखें।` : `Temperatures will hit ${tomorrow.maxTemp}°C tomorrow. Plan your irrigation early.`,
            icon: <Sun size={18} />,
            color: '#d4a026',
            day: 'tomorrow'
        })
    } else if (weather.rain > 0) {
        setActiveAlert({
            type: 'weather',
            title: lang === 'hi' ? 'आज बारिश हो रही है' : 'It is Raining Now',
            msg: lang === 'hi' ? 'क्षेत्र में वर्तमान में वर्षा हो रही है।' : 'Rain is currently being detected in your location.',
            icon: <CloudRain size={18} />,
            color: '#4a90d9',
            day: 'today'
        })
    } else {
        const randomScheme = SCHEME_NEWS[Math.floor(Math.random() * SCHEME_NEWS.length)]
        setActiveAlert({
            type: 'scheme',
            title: randomScheme.title,
            msg: randomScheme.desc,
            icon: <Zap size={18} />,
            color: 'var(--clr-primary)',
            data: randomScheme
        })
    }
  }, [weather, lang])

  if (!activeAlert) return null

  return (
    <div className="alert-system-container">
      <div className="alert-bar" style={{ borderLeft: `3px solid ${activeAlert.color}` }}>
        <div className="alert-icon-wrap" style={{ background: `${activeAlert.color}12`, color: activeAlert.color }}>
          {activeAlert.icon}
        </div>
        <div className="alert-content">
          <div className="alert-title">{activeAlert.title}</div>
          <div className="alert-msg">{activeAlert.msg}</div>
        </div>
        <button className="btn btn-sm btn-primary-alt" onClick={() => setShowPopup(true)} style={{ marginLeft: 'auto', gap: 5 }}>
          <Info size={13} /> {lang === 'hi' ? 'देखें' : 'View'}
        </button>
      </div>

      {showPopup && (
        <div className="alert-modal-overlay" onClick={() => setShowPopup(false)}>
          <div className="alert-modal-card" onClick={e => e.stopPropagation()}>
            <button className="alert-modal-close" onClick={() => setShowPopup(false)}><X size={18} /></button>
            <div className="alert-modal-banner" style={{ 
                background: activeAlert.type === 'scheme' 
                    ? `url(${activeAlert.data.image}) center/cover` 
                    : `linear-gradient(135deg, ${activeAlert.color}, #1e293b)`
            }}>
                <div className="alert-modal-banner-overlay">
                    <div className="badge" style={{ background: activeAlert.color, color: 'white' }}>{activeAlert.type.toUpperCase()}</div>
                </div>
            </div>
            <div className="alert-modal-body">
              <h2 className="alert-modal-title">{activeAlert.title}</h2>
              <p className="alert-modal-desc">{activeAlert.msg}</p>
              
              {activeAlert.type === 'scheme' && (
                <div>
                  <a href={activeAlert.data.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-full" style={{ gap: 8 }}>
                    Official Website <ExternalLink size={14} />
                  </a>
                </div>
              )}

              {activeAlert.type === 'weather' && weather.forecast && (
                 <div className="weather-forecast-mini">
                    {weather.forecast.map((f, i) => (
                        <div className="forecast-item" key={i} style={{ opacity: i === 0 ? 0.6 : 1 }}>
                            <span className="forecast-label">{i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : 'Next Day'}</span>
                            <span className="forecast-val">{f.maxTemp}°C | {f.rain}mm</span>
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
          margin-bottom: 1.5rem;
          animation: revealUp 0.4s ease;
        }
        .alert-bar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1.25rem;
          border-radius: var(--r-md);
          background: var(--bg-surface);
          border: 1px solid var(--border);
          box-shadow: var(--shadow-xs);
        }
        .alert-icon-wrap {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .alert-title {
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--txt-primary);
        }
        .alert-msg {
          font-size: 0.8rem;
          color: var(--txt-muted);
          line-height: 1.4;
        }

        /* Modal */
        .alert-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          animation: fadeIn 0.15s ease;
        }
        .alert-modal-card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--r-xl);
          width: 100%;
          max-width: 480px;
          overflow: hidden;
          position: relative;
          box-shadow: var(--shadow-lg);
          animation: modalSlide 0.25s ease;
        }
        .alert-modal-close {
          position: absolute;
          top: 1rem; right: 1rem;
          background: rgba(0,0,0,0.4);
          color: white;
          border: none;
          width: 32px; height: 32px;
          border-radius: 50%;
          cursor: pointer;
          z-index: 10;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.15s;
        }
        .alert-modal-close:hover { background: #c53030; }
        .alert-modal-banner {
          height: 180px;
          position: relative;
        }
        .alert-modal-banner-overlay {
          position: absolute;
          top: 1rem; left: 1rem;
        }
        .alert-modal-body {
          padding: 1.75rem;
        }
        .alert-modal-title {
          font-family: var(--font-head);
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 0.6rem;
          color: var(--txt-primary);
        }
        .alert-modal-desc {
          color: var(--txt-secondary);
          line-height: 1.6;
          margin-bottom: 1.5rem;
          font-size: var(--text-base);
        }
        .weather-forecast-mini {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
          background: var(--bg-input);
          padding: 1rem;
          border-radius: var(--r-md);
          border: 1px solid var(--border);
        }
        .forecast-item {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .forecast-label {
          font-size: 0.7rem;
          color: var(--txt-muted);
          text-transform: uppercase;
          letter-spacing: 0.04em;
          font-weight: 600;
        }
        .forecast-val {
          font-size: 1rem;
          font-weight: 700;
          color: var(--clr-primary);
        }
      `}</style>
    </div>
  )
}
