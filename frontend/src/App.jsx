import React, { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Sun, Moon, LogOut, ChevronDown, Leaf, Sprout, CloudSun, Bug, TrendingUp,
  Store, Landmark, Search, Menu, X, PanelLeftClose, PanelLeft,
  User, Settings, MessageSquare, BarChart3, Bell, Github
} from 'lucide-react'
import DashboardPage from './pages/DashboardPage'
import CropRecommendPage from './pages/CropRecommendPage'
import WeatherPage from './pages/WeatherPage'
import DiseaseDiagnosisPage from './pages/DiseaseDiagnosisPage'
import PricePredictionPage from './pages/PricePredictionPage'
import MarketPage from './pages/MarketPage'
import SchemesPage from './pages/SchemesPage'
import CropGuidePage from './pages/CropGuidePage'
import FeedbackPage from './pages/FeedbackPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import { translations, LANGUAGES } from './i18n'
import './Animations.css'

export const LangContext = createContext({ lang: 'en', t: translations.en, setLang: () => {} })
export const useLang = () => useContext(LangContext)

/* ── Sidebar nav config ──────────────────── */
const AI_TOOLS = [
  { path: '/price-predict', label: 'Price Prediction', icon: TrendingUp },
  { path: '/disease', label: 'Disease Diagnosis', icon: Bug },
  { path: '/recommend', label: 'Crop Recommendation', icon: Sprout },
  { path: '/weather', label: 'Weather & Advice', icon: CloudSun },
]
const PLATFORM = [
  { path: '/market', label: 'Marketplace', icon: Store },
  { path: '/schemes', label: 'Govt Schemes', icon: Landmark },
  { path: '/feedback', label: 'Feedback', icon: MessageSquare },
]

/* ── Language Dropdown ──────────────────────── */
function LangSwitcher({ lang, setLang }) {
  const [open, setOpen] = useState(false)
  const current = LANGUAGES.find(l => l.code === lang)
  return (
    <div style={{ position: 'relative' }}>
      <button className="topbar-icon-btn" onClick={() => setOpen(o => !o)} title="Language">
        <span style={{ fontSize: 15 }}>{current.flag}</span>
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 199 }} onClick={() => setOpen(false)} />
          <div className="lang-dropdown">
            {LANGUAGES.map(l => (
              <button key={l.code} className={`lang-option ${lang === l.code ? 'active' : ''}`}
                onClick={() => { setLang(l.code); setOpen(false) }}>
                <span style={{ fontSize: 15 }}>{l.flag}</span>
                <span>{l.native}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ── Main App Shell ──────────────────────────── */
function AppShell({ theme, toggleTheme, lang, setLang, weather, setWeather, autoDetectWeather, autoLocation, setAutoLocation }) {
  const t = translations[lang]
  const navigate = useNavigate()
  const location = useLocation()
  let user = null
  try { user = JSON.parse(localStorage.getItem('farmcrop_user') || 'null') } catch (e) {}

  const [models, setModels] = useState([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    fetch('/models').then(r => r.json()).then(d => setModels(d.models || [])).catch(() => setModels([]))
    if (user && !weather.temp) autoDetectWeather()
  }, [])

  const handleLogout = () => { localStorage.removeItem('farmcrop_user'); navigate('/login') }

  const isActive = (path) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      <div className={`app-shell ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>

        {/* ═══ SIDEBAR ═══ */}
        <aside className="sidebar">
          {/* Logo */}
          <div className="sidebar-logo" onClick={() => navigate('/')}>
            <div className="sidebar-logo-icon"><Leaf size={16} /></div>
            <span className="sidebar-logo-text">{t.appName || 'Kishanbandhu'}</span>
          </div>

          {/* Dashboard */}
          <nav className="sidebar-nav">
            <Link to="/" className={`sidebar-item ${isActive('/') ? 'active' : ''}`}>
              <BarChart3 size={17} /> <span>Dashboard</span>
            </Link>

            <div className="sidebar-group-label">AI Tools</div>
            {AI_TOOLS.map(item => (
              <Link key={item.path} to={item.path} className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}>
                <item.icon size={17} /> <span>{item.label}</span>
              </Link>
            ))}

            <div className="sidebar-group-label">Platform</div>
            {PLATFORM.map(item => (
              <Link key={item.path} to={item.path} className={`sidebar-item ${isActive(item.path) ? 'active' : ''}`}>
                <item.icon size={17} /> <span>{item.label}</span>
              </Link>
            ))}

            <div className="sidebar-group-label">Account</div>
            <div className="sidebar-item" style={{ cursor: 'default', opacity: 0.5 }}>
              <User size={17} /> <span>Profile</span>
            </div>
            <div className="sidebar-item" style={{ cursor: 'default', opacity: 0.5 }}>
              <Settings size={17} /> <span>Settings</span>
            </div>

            <div className="sidebar-group-label">Resources</div>
            <a 
              href="https://github.com/avikmasanta/CropRecommendationSystem" 
              target="_blank" 
              rel="noopener noreferrer"
              className="sidebar-item"
            >
              <Github size={17} /> <span>GitHub Source</span>
            </a>
          </nav>

          {/* Logout & Credits */}
          <div className="sidebar-bottom">
            {user && (
              <button className="sidebar-item sidebar-logout" onClick={handleLogout}>
                <LogOut size={17} /> <span>Logout</span>
              </button>
            )}
            <div className="sidebar-credits" style={{ 
              padding: '12px 16px', 
              fontSize: '0.7rem', 
              opacity: 0.6,
              borderTop: '1px solid var(--border-color)',
              marginTop: '4px'
            }}>
              <div>Developed by <strong>Avik Masanta</strong></div>
              <div>Period: 2025 - 2026</div>
            </div>
          </div>
        </aside>

        {/* ═══ MAIN ═══ */}
        <div className="main-panel">
          {/* Top Bar */}
          <header className="topbar">
            <div className="topbar-left">
              <button className="topbar-icon-btn" onClick={() => setSidebarCollapsed(s => !s)} title="Toggle sidebar">
                {sidebarCollapsed ? <PanelLeft size={17} /> : <PanelLeftClose size={17} />}
              </button>
              <div className="topbar-search">
                <Search size={14} className="topbar-search-icon" />
                <input placeholder="Search dashboard features..." />
              </div>
            </div>
            <div className="topbar-right">
              <button className="topbar-icon-btn" onClick={toggleTheme} title="Toggle theme">
                {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
              </button>
              <LangSwitcher lang={lang} setLang={setLang} />
              <button className="topbar-icon-btn"><Bell size={17} /></button>
              {user ? (
                <div className="topbar-user">
                  <div className="topbar-avatar">{(user.name || 'F')[0].toUpperCase()}</div>
                </div>
              ) : (
                <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>
                  {t.signIn}
                </button>
              )}
            </div>
          </header>

          {/* Content Routes */}
          <div className="content-scroll">
            <Routes>
              <Route path="/" element={<DashboardPage user={user} weather={weather} />} />
              <Route path="/recommend" element={
                <CropRecommendPage weather={weather} setWeather={setWeather} autoLocation={autoLocation} models={models} autoDetectWeather={autoDetectWeather} />
              } />
              <Route path="/weather" element={<WeatherPage weather={weather} setWeather={setWeather} />} />
              <Route path="/disease" element={<DiseaseDiagnosisPage />} />
              <Route path="/price-predict" element={<PricePredictionPage />} />
              <Route path="/market" element={<MarketPage />} />
              <Route path="/schemes" element={<SchemesPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/guide/:crop" element={<CropGuidePage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </LangContext.Provider>
  )
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [lang, setLang] = useState(() => localStorage.getItem('ui_lang') || 'en')
  const [weather, setWeather] = useState({ temp: null, humidity: null, rain: null, wind: null, forecast: [] })
  const [autoLocation, setAutoLocation] = useState(localStorage.getItem('farmcrop_location') || '')

  const autoDetectWeather = async () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords
      try {
        const geo = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,rain,wind_speed_10m&daily=temperature_2m_max,precipitation_sum&timezone=auto`).then(r => r.json())
        const c = geo.current; const d = geo.daily || {}
        const forecast = (d.time || []).slice(0, 3).map((time, i) => ({ date: time, maxTemp: d.temperature_2m_max[i], rain: d.precipitation_sum[i] }))
        setWeather({ temp: c.temperature_2m, humidity: c.relative_humidity_2m, rain: c.rain, wind: c.wind_speed_10m, forecast })
        const loc = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`).then(r => r.json())
        const addr = loc.address || {}; const city = addr.city || addr.town || addr.village || addr.suburb || addr.state || ''
        if (city) { setAutoLocation(city); localStorage.setItem('farmcrop_location', city) }
      } catch (e) { console.error("Auto-weather failed", e) }
    })
  }

  useEffect(() => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('theme', theme) }, [theme])
  useEffect(() => { localStorage.setItem('ui_lang', lang); document.documentElement.lang = lang }, [lang])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage lang={lang} setLang={setLang} onLogin={autoDetectWeather} />} />
        <Route path="/signup" element={<SignUpPage lang={lang} setLang={setLang} onSignup={autoDetectWeather} />} />
        <Route path="/*" element={
          <AppShell theme={theme} toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
            lang={lang} setLang={setLang} weather={weather} setWeather={setWeather}
            autoDetectWeather={autoDetectWeather} autoLocation={autoLocation} setAutoLocation={setAutoLocation} />
        } />
      </Routes>
    </BrowserRouter>
  )
}
