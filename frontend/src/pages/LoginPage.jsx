import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, Globe } from 'lucide-react'
import Logo from '../components/Logo'
import { translations, LANGUAGES } from '../i18n'

const HERO_IMAGE = '/assets/hero3.jpg'

export default function LoginPage({ lang, setLang, onLogin }) {
  const navigate = useNavigate()
  const t = translations[lang] || translations.en
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    localStorage.setItem('farmcrop_user', JSON.stringify({ email, name: email.split('@')[0] }))
    if (onLogin) onLogin()
    navigate('/')
  }

  return (
    <div className="auth-page">
      {/* Left – Visual */}
      <div className="auth-visual">
        <img className="auth-visual-img" src={HERO_IMAGE} alt="Farm field" />
        <div className="auth-visual-overlay" />
        <div className="auth-visual-logo">
          <Logo size={18} fontSize="1rem" />
        </div>
        <div className="auth-visual-content">
          <div className="auth-testimonial">
            <p className="auth-quote">{t.testimonialQuote}</p>
            <div className="auth-author">
              <img className="auth-author-avatar"
                src="/assets/author.jpg"
                alt="Farmer" />
              <div>
                <div className="auth-author-name">{t.testimonialName}</div>
                <div className="auth-author-role">{t.testimonialRole}</div>
              </div>
            </div>
          </div>
          <div className="auth-stats">
            <div><div className="auth-stat-val">22+</div><div className="auth-stat-lbl">{t.statCrops}</div></div>
            <div><div className="auth-stat-val">98%</div><div className="auth-stat-lbl">{t.statAccuracy}</div></div>
            <div><div className="auth-stat-val">9</div><div className="auth-stat-lbl">{t.statLangs}</div></div>
          </div>
        </div>
      </div>

      {/* Right – Form */}
      <div className="auth-form-panel">
        {/* Language picker */}
        <div style={{ position: 'absolute', top: 16, left: 16, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {LANGUAGES.map(l => (
            <button key={l.code} onClick={() => setLang(l.code)}
              style={{ 
                padding: '3px 9px', borderRadius: 6, 
                border: '1px solid var(--border)', fontSize: '0.73rem', 
                fontFamily: 'var(--font-body)', cursor: 'pointer', 
                transition: 'all 0.15s', 
                background: lang === l.code ? 'var(--clr-primary-subtle)' : 'transparent', 
                color: lang === l.code ? 'var(--clr-primary)' : 'var(--txt-muted)', 
                fontWeight: lang === l.code ? 600 : 400 
              }}>
              {l.flag} {l.native}
            </button>
          ))}
        </div>

        <div className="auth-form-box">
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ marginBottom: 14 }}>
              <Logo size={22} fontSize="1.3rem" />
            </div>
            <h2>{t.loginTitle}</h2>
            <p className="auth-sub">{t.loginSub}</p>
          </div>

          <button className="social-btn" style={{ marginBottom: '0.75rem' }} type="button">
            <Globe size={16} /> {t.loginGoogleBtn}
          </button>
          <div className="auth-divider">{t.loginOrEmail}</div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>{t.loginEmailLabel}</label>
              <div className="input-wrap">
                <span className="input-icon"><Mail size={14} /></span>
                <input className="field" type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                <label style={{ margin: 0 }}>{t.loginPasswordLabel}</label>
                <button type="button" style={{ background: 'none', border: 'none', fontSize: '0.73rem', color: 'var(--clr-primary)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600 }}>{t.loginForgot}</button>
              </div>
              <div className="input-wrap">
                <span className="input-icon"><Lock size={14} /></span>
                <input className="field" type={showPw ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: 38 }} />
                <button type="button" className="pw-toggle" onClick={() => setShowPw(s => !s)}>
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            {error && <div className="error-box" style={{ fontSize: '0.8rem' }}>{error}</div>}
            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
              {loading ? <><Loader2 size={16} className="spin" /> {t.loginLoading}</> : <><ArrowRight size={16} /> {t.loginBtn}</>}
            </button>
          </form>
          <div className="auth-switch">
            {t.loginNoAccount} <a onClick={() => navigate('/signup')}>{t.loginCreateFree}</a>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', opacity: 0.5 }}>
            Developed by <strong>Avik Masanta</strong> | 2025 - 2026
          </div>
        </div>
      </div>
    </div>
  )
}
