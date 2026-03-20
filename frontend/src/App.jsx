import React, { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Sun, Moon, Sprout, LogIn, LogOut, UserPlus, Globe } from 'lucide-react'
import SoilForm from './components/SoilForm'
import WeatherPanel from './components/WeatherPanel'
import ResultsPanel from './components/ResultsPanel'
import AiModal from './components/AiModal'
import Particles from './components/Particles'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import { translations, LANGUAGES } from './i18n'

// ─── Language Context ───────────────────────────────────
export const LangContext = createContext({ lang: 'en', t: translations.en, setLang: () => {} })
export const useLang = () => useContext(LangContext)

// ─── Scroll Reveal Hook ─────────────────────────────────
function useOnScreen(ref, rootMargin = '0px') {
  const [isIntersecting, setIntersecting] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIntersecting(true)
        observer.unobserve(entry.target)
      }
    }, { rootMargin })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref, rootMargin])
  return isIntersecting
}

function RevealOnScroll({ children, delay = 0 }) {
  const ref = React.useRef()
  const isVisible = useOnScreen(ref, '-50px')
  return (
    <div ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: `all 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Photo Gallery ──────────────────────────────────────
const GALLERY = [
  { src: '/crops/rice.jpg', label: 'rice' },
  { src: '/crops/wheat.jpg', label: 'wheat' },
  { src: '/crops/jute.jpg', label: 'jute' },
  { src: '/crops/cotton.jpg', label: 'cotton' },
  { src: '/crops/maize.jpg', label: 'maize' },
  { src: '/crops/apple.jpg', label: 'apple' },
  { src: '/crops/grapes.jpg', label: 'grapes' },
  { src: '/crops/mango.jpg', label: 'mango' },
  { src: '/crops/orange.jpg', label: 'orange' },
  { src: '/crops/banana.jpg', label: 'banana' },
  { src: '/crops/papaya.jpg', label: 'papaya' },
  { src: '/crops/watermelon.jpg', label: 'watermelon' },
  { src: '/crops/muskmelon.jpg', label: 'muskmelon' },
  { src: '/crops/pomegranate.jpg', label: 'pomegranate' },
  { src: '/crops/coconut.jpg', label: 'coconut' },
  { src: '/crops/coffee.jpg', label: 'coffee' },
  { src: '/crops/chickpea.jpg', label: 'chickpea' },
  { src: '/crops/kidneybeans.jpg', label: 'kidneybeans' },
  { src: '/crops/lentil.jpg', label: 'lentil' },
  { src: '/crops/mungbean.jpg', label: 'mungbean' },
  { src: '/crops/blackgram.jpg', label: 'blackgram' },
  { src: '/crops/pigeonpeas.jpg', label: 'pigeonpeas' },
  { src: '/crops/mothbeans.jpg', label: 'mothbeans' },
]

const HERO_IMGS = [
  '/assets/hero1.jpg',
  '/assets/hero2.jpg',
  '/assets/hero3.jpg',
]

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
        style={{ gap: 6, width: 'auto', paddingInline: 12, borderRadius: 20, fontSize: '0.8rem', fontFamily: 'var(--font-body)' }}
      >
        <Globe size={15} />
        <span className="hidden-mobile">{current.native}</span>
        <span>{current.flag}</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)',
          background: 'var(--bg-surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--r-md)', overflow: 'hidden', zIndex: 200,
          boxShadow: 'var(--shadow-md)', minWidth: 180,
          animation: 'fadeSlideUp 0.2s ease'
        }}>
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false) }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px', background: lang === l.code ? 'var(--clr-primary-glow)' : 'transparent',
                border: 'none', cursor: 'pointer', color: lang === l.code ? 'var(--clr-primary)' : 'var(--txt-secondary)',
                fontSize: '0.875rem', fontFamily: 'var(--font-body)', textAlign: 'left',
                fontWeight: lang === l.code ? 700 : 400, transition: 'all 0.15s'
              }}
              onMouseEnter={e => { if (lang !== l.code) e.currentTarget.style.background = 'var(--bg-glass)' }}
              onMouseLeave={e => { if (lang !== l.code) e.currentTarget.style.background = 'transparent' }}
            >
              <span style={{ fontSize: 18 }}>{l.flag}</span>
              <span>{l.native}</span>
              <span style={{ color: 'var(--txt-muted)', fontSize: '0.75rem', marginLeft: 'auto' }}>{l.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Feature Cards ──────────────────────────────────────
function FeatureCards({ t }) {
  const feats = [
    { icon: '🤖', color: 'rgba(34,197,94,0.15)', title: t.feat1Title, desc: t.feat1Desc },
    { icon: '🌦️', color: 'rgba(56,189,248,0.15)', title: t.feat2Title, desc: t.feat2Desc },
    { icon: '💬', color: 'rgba(167,139,250,0.15)', title: t.feat3Title, desc: t.feat3Desc },
  ]
  return (
    <div className="features-row">
      {feats.map((f, i) => (
        <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.12}s` }}>
          <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
          <h4>{f.title}</h4>
          <p>{f.desc}</p>
        </div>
      ))}
    </div>
  )
}

// ─── Stats Counter ──────────────────────────────────────
function CounterStat({ end, suffix, label }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(end / 40)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setVal(end); clearInterval(timer) }
      else setVal(start)
    }, 30)
    return () => clearInterval(timer)
  }, [end])
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="auth-stat-val" style={{ color: 'var(--clr-primary)', fontSize: '1.8rem', fontFamily: 'var(--font-head)', fontWeight: 800 }}>
        {val}{suffix}
      </div>
      <div style={{ fontSize: '0.75rem', color: 'var(--txt-muted)', marginTop: 2 }}>{label}</div>
    </div>
  )
}

// ─── Dashboard ──────────────────────────────────────────
function Dashboard({ theme, toggleTheme, lang, setLang }) {
  const t = translations[lang]
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('farmcrop_user') || 'null')
  const [weather, setWeather] = useState({ temp: null, humidity: null, rain: null, wind: null })
  const [predictions, setPredictions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lastData, setLastData] = useState(null)
  const [aiOpen, setAiOpen] = useState(false)
  const [models, setModels] = useState([])

  useEffect(() => {
    fetch('/models').then(r => r.json()).then(d => setModels(d.models || [])).catch(() => setModels([]))
  }, [])

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
    <LangContext.Provider value={{ lang, t, setLang }}>
      <Particles />
      <div className="app-wrapper">
        {/* Header */}
        <header className="header">
          <a className="logo" href="#">
            <div className="logo-icon"><Sprout size={18} color="white" /></div>
            {t.appName}
            <span className="logo-sub hidden-mobile">{t.appTagline}</span>
          </a>
          <div className="header-actions">
            <LangSwitcher lang={lang} setLang={setLang} />
            <button className="icon-btn theme-btn" onClick={toggleTheme} title="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            {user
              ? <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 999, border: '1px solid var(--border)', background: 'var(--bg-glass)', fontSize: '0.82rem', color: 'var(--txt-secondary)', backdropFilter: 'blur(8px)' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--clr-primary-glow)', color: 'var(--clr-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.8rem' }}>
                      {user.name[0].toUpperCase()}
                    </div>
                    <span className="hidden-mobile">{user.name}</span>
                  </div>
                  <button className="icon-btn" onClick={() => { localStorage.removeItem('farmcrop_user'); navigate('/login') }} title={t.logout}><LogOut size={17} /></button>
                </>
              : <>
                  <button className="btn btn-secondary" style={{ height: 38, fontSize: '0.82rem', padding: '0 14px', gap: 6 }} onClick={() => navigate('/login')}>
                    <LogIn size={15} /> {t.signIn}
                  </button>
                  <button className="btn btn-primary" style={{ height: 38, fontSize: '0.82rem', padding: '0 14px', gap: 6 }} onClick={() => navigate('/signup')}>
                    <UserPlus size={15} /> {t.signUp}
                  </button>
                </>
            }
          </div>
        </header>

        <main className="main">
          {/* Hero */}
          <div className="hero">
            <div className="hero-inner">
              <div className="hero-badge"><Sprout size={12} /> {t.heroBadge}</div>
              <h1 className="hero-gradient-text">{t.heroTitle}</h1>
              <p>{t.heroDesc}</p>
              <div className="hero-img-row">
                {HERO_IMGS.map((src, i) => (
                  <div className="hero-img-item" key={i} style={{ animationDelay: `${0.2 + i * 0.15}s` }}>
                    <img src={src} alt={`farm ${i}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Animated stat counters */}
          <RevealOnScroll>
            <div className="stats-row">
              <CounterStat end={22} suffix="+" label={t.statCrops ?? 'Crop Types'} />
              <div className="stats-divider" />
              <CounterStat end={98} suffix="%" label={t.statAccuracy ?? 'Accuracy'} />
              <div className="stats-divider" />
              <CounterStat end={9} suffix="" label={t.statLangs ?? 'Languages'} />
              <div className="stats-divider" />
              <CounterStat end={5000} suffix="+" label={t.statFarmers ?? 'Farmers'} />
            </div>
          </RevealOnScroll>

          {/* Feature cards */}
          <RevealOnScroll delay={0.1}>
            <FeatureCards t={t} />
          </RevealOnScroll>

          {/* Gallery */}
          <RevealOnScroll delay={0.2}>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div className="section-label">{t.galleryLabel}</div>
                <span style={{ fontSize: '0.75rem', color: 'var(--txt-muted)' }}>{t.galleryHint}</span>
              </div>
              <div className="photo-strip">
                {GALLERY.map((item, i) => (
                  <div className="photo-card" key={i} style={{ animationDelay: `${i * 60}ms` }}>
                    <img src={item.src} alt={item.label} loading="lazy" />
                    <div className="photo-card-label">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>

          {/* Main Grid */}
          <RevealOnScroll delay={0.3}>
            <div className="grid-layout">
              <SoilForm models={models} weather={weather} onWeatherFetched={setWeather} onSubmit={handlePredict} loading={loading} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <WeatherPanel weather={weather} />
                <ResultsPanel predictions={predictions} loading={loading} onAskAI={() => setAiOpen(true)} />
              </div>
            </div>
          </RevealOnScroll>

          {/* How it works */}
          <RevealOnScroll delay={0.4}>
            <div className="how-it-works">
              <div className="section-label" style={{ marginBottom: 16 }}>⚡ {lang === 'hi' ? 'यह कैसे काम करता है' : lang === 'bn' ? 'এটি কীভাবে কাজ করে' : lang === 'pa' ? 'ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ' : 'How it Works'}</div>
              <div className="steps-row">
                {[t.step1, t.step2, t.step3].map((s, i) => (
                  <div className="step-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="step-num">{i + 1}</div>
                    <div className="step-text">{s}</div>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnScroll>
        </main>
      </div>
      {aiOpen && (
        <AiModal features={lastData} prediction={predictions?.top_prediction} onClose={() => setAiOpen(false)} />
      )}
    </LangContext.Provider>
  )
}

// ─── Root App with Router ───────────────────────────────
export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  const [lang, setLang] = useState(() => localStorage.getItem('ui_lang') || 'en')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('ui_lang', lang)
    // Set document lang attribute for accessibility
    document.documentElement.lang = lang
  }, [lang])

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

  return (
    <LangContext.Provider value={{ lang, t: translations[lang], setLang }}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage lang={lang} setLang={setLang} />} />
          <Route path="/signup" element={<SignUpPage lang={lang} setLang={setLang} />} />
          <Route path="/" element={<Dashboard theme={theme} toggleTheme={toggleTheme} lang={lang} setLang={setLang} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LangContext.Provider>
  )
}
