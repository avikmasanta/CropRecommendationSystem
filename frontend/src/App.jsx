import React, { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, Link, useLocation } from 'react-router-dom'
import { Sun, Moon, Sprout, LogIn, LogOut, UserPlus, Globe, LayoutDashboard, Store, Landmark } from 'lucide-react'
import SoilForm from './components/SoilForm'
import WeatherPanel from './components/WeatherPanel'
import ResultsPanel from './components/ResultsPanel'
import AiModal from './components/AiModal'
import Particles from './components/Particles'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import MarketPage from './pages/MarketPage'
import SchemesPage from './pages/SchemesPage'
import CropGuidePage from './pages/CropGuidePage'
import Logo from './components/Logo'
import { translations, LANGUAGES } from './i18n'

// ─── Language Context ───────────────────────────────────
export const LangContext = createContext({ lang: 'en', t: translations.en, setLang: () => {} })
export const useLang = () => useContext(LangContext)

// ─── Language Dropdown ──────────────────────────────────
function LangSwitcher({ lang, setLang }) {
  const [open, setOpen] = useState(false)
  const current = LANGUAGES.find(l => l.code === lang)
  return (
    <div style={{ position: 'relative' }}>
      <button
        className="icon-btn"
        onClick={() => setOpen(o => !o)}
        title="Change Language"
        style={{ gap: 6, width: 'auto', paddingInline: 14, borderRadius: 24, fontSize: '0.9rem' }}
      >
        <Globe size={16} />
        <span className="hidden-mobile">{current.native}</span>
        <span>{current.flag}</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 10px)',
          background: 'var(--bg-surface)', border: '2px solid var(--border)',
          borderRadius: 'var(--r-md)', overflow: 'hidden', zIndex: 200,
          boxShadow: 'var(--shadow-md)', minWidth: 200,
          animation: 'fadeSlideUp 0.1s ease'
        }}>
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false) }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 18px', background: lang === l.code ? 'var(--clr-primary-glow)' : 'transparent',
                border: 'none', cursor: 'pointer', color: lang === l.code ? 'var(--clr-primary)' : 'var(--txt-secondary)',
                fontSize: '0.95rem', textAlign: 'left',
                fontWeight: lang === l.code ? 700 : 500
              }}
            >
              <span style={{ fontSize: 20 }}>{l.flag}</span>
              <span>{l.native}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Dashboard Content ──────────────────────────────────
function DashboardContent({ weather, setWeather, predictions, setPredictions, loading, setLoading, setAiOpen, setLastData, models, t, user, autoLocation }) {
  const handlePredict = async (formValues) => {
    setLoading(true); setPredictions(null); setLastData(formValues)
    try {
      const fd = new FormData()
      Object.entries(formValues).forEach(([k, v]) => fd.append(k, v))
      const res = await fetch('/predict', { method: 'POST', body: fd })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setPredictions(json)
    } catch (e) { setPredictions({ error: e.message }) }
    finally { setLoading(false) }
  }

  return (
    <div className="main">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back, {user?.name || 'Farmer'} 👋</p>
      </div>

      <div className="dashboard-grid">
        <div className="dash-main">
          {/* Soil Analysis Card */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
             <div className="card-banner-img" style={{ margin: 0, borderRadius: 0, background: 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.1)), url("https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1200") center/cover' }} />
             <div style={{ padding: '1.5rem' }}>
                <div className="card-header" style={{ marginBottom: '1.5rem', padding: 0 }}>
                  <div className="card-header-icon" style={{ background: 'var(--clr-primary-glow)', color: 'var(--clr-primary)' }}>🌱</div>
                  <div>
                    <div className="card-title">Soil Analysis</div>
                    <div className="card-subtitle">Enter your field parameters below</div>
                  </div>
                </div>
                <SoilForm models={models} weather={weather} onWeatherFetched={setWeather} onSubmit={handlePredict} loading={loading} initialLocation={autoLocation} />
             </div>
          </div>
        </div>

        <div className="dash-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <WeatherPanel weather={weather} />
          <ResultsPanel predictions={predictions} loading={loading} onAskAI={() => setAiOpen(true)} />
        </div>
      </div>
    </div>
  )
}

// ─── Main App Shell ─────────────────────────────────────
function AppShell({ theme, toggleTheme, lang, setLang, weather, setWeather, autoDetectWeather, autoLocation, setAutoLocation }) {
  const t = translations[lang]
  const navigate = useNavigate()
  const location = useLocation()
  let user = null
  try {
    user = JSON.parse(localStorage.getItem('farmcrop_user') || 'null')
  } catch (e) { console.error("User parse failed", e) }
  
  const [predictions, setPredictions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lastData, setLastData] = useState(null)
  const [aiOpen, setAiOpen] = useState(false)
  const [models, setModels] = useState([])

  useEffect(() => {
    fetch('/models').then(r => r.json()).then(d => setModels(d.models || [])).catch(() => setModels([]))
    // If logged in but no weather, try auto-detect
    if (user && !weather.temp) autoDetectWeather()
  }, [])

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      <Particles />
      <div className="app-wrapper">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div className="header-brand" onClick={() => navigate('/')}>
            <Logo size={24} fontSize="1.3rem" />
          </div>
            <nav style={{ display: 'flex', gap: 8 }} className="hidden-mobile">
              <Link to="/" className={`btn ${location.pathname === '/' ? 'btn-primary' : 'btn-secondary'}`} style={{ height: 40, paddingInline: 16, fontSize: '0.9rem', gap: 8 }}>
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <Link to="/market" className={`btn ${location.pathname === '/market' ? 'btn-primary' : 'btn-secondary'}`} style={{ height: 40, paddingInline: 16, fontSize: '0.9rem', gap: 8 }}>
                <Store size={16} /> Marketplace
              </Link>
              <Link to="/schemes" className={`btn ${location.pathname === '/schemes' ? 'btn-primary' : 'btn-secondary'}`} style={{ height: 40, paddingInline: 16, fontSize: '0.9rem', gap: 8 }}>
                <Landmark size={16} /> Government Schemes
              </Link>
            </nav>
          </div>
          <div className="header-actions">
            <LangSwitcher lang={lang} setLang={setLang} />
            <button className="icon-btn theme-btn" onClick={toggleTheme}>
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user
              ? <button className="icon-btn" onClick={() => { localStorage.removeItem('farmcrop_user'); navigate('/login') }}><LogOut size={17} /></button>
              : <button className="btn btn-primary" style={{ height: 44, paddingInline: 20 }} onClick={() => navigate('/login')}>{t.signIn}</button>
            }
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<DashboardContent {...{ weather, setWeather, predictions, setPredictions, loading, setLoading, setAiOpen, setLastData, models, t, user, autoLocation }} />} />
            <Route path="/market" element={<MarketPage />} />
            <Route path="/schemes" element={<SchemesPage />} />
            <Route path="/guide/:crop" element={<CropGuidePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      {aiOpen && (
        <AiModal features={lastData} prediction={predictions?.top_prediction} onClose={() => setAiOpen(false)} />
      )}
    </LangContext.Provider>
  )
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [lang, setLang] = useState(() => localStorage.getItem('ui_lang') || 'en')
  const [weather, setWeather] = useState({ temp: null, humidity: null, rain: null, wind: null })
  const [autoLocation, setAutoLocation] = useState(localStorage.getItem('farmcrop_location') || '')

  const autoDetectWeather = async () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords
      try {
        const geo = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m`).then(r => r.json())
        const c = geo.current
        setWeather({ temp: c.temperature_2m, humidity: c.relative_humidity_2m, rain: c.rain, wind: c.wind_speed_10m })
        
        const loc = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`).then(r => r.json())
        const addr = loc.address || {}
        const city = addr.city || addr.town || addr.village || addr.suburb || addr.state || ''
        if (city) {
          setAutoLocation(city)
          localStorage.setItem('farmcrop_location', city)
        }
      } catch (e) { console.error("Auto-weather failed", e) }
    })
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('ui_lang', lang)
    document.documentElement.lang = lang
  }, [lang])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage lang={lang} setLang={setLang} onLogin={autoDetectWeather} />} />
        <Route path="/signup" element={<SignUpPage lang={lang} setLang={setLang} onSignup={autoDetectWeather} />} />
        <Route path="/*" element={<AppShell theme={theme} toggleTheme={toggleTheme} lang={lang} setLang={setLang} weather={weather} setWeather={setWeather} autoDetectWeather={autoDetectWeather} autoLocation={autoLocation} setAutoLocation={setAutoLocation} />} />
      </Routes>
    </BrowserRouter>
  )
}
