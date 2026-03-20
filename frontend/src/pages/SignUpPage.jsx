import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sprout, Mail, Lock, User, Eye, EyeOff, ArrowRight, Loader2, Check } from 'lucide-react'
import Particles from '../components/Particles'
import { translations, LANGUAGES } from '../i18n'

const HERO_IMAGE = '/assets/hero2.jpg'

function getStrength(pw, t) {
  if (!pw) return { score: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const labels = ['', t.signupPwStrengthWeak, t.signupPwStrengthFair, t.signupPwStrengthGood, t.signupPwStrengthStrong]
  const colors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#22c55e']
  return { score, label: labels[score], color: colors[score] }
}

export default function SignUpPage({ lang, setLang }) {
  const navigate = useNavigate()
  const t = translations[lang] || translations.en
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const strength = getStrength(password, t)

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('')
    if (!agree) { setError('Please accept the terms to continue.'); return }
    if (strength.score < 2) { setError('Please choose a stronger password.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setLoading(false)
    localStorage.setItem('farmcrop_user', JSON.stringify({ email, name }))
    navigate('/')
  }

  return (
    <>
      <Particles />
      <div className="auth-page">
        {/* Left – Visual */}
        <div className="auth-visual">
          <img className="auth-visual-img" src={HERO_IMAGE} alt="Crop field" />
          <div className="auth-visual-overlay" />
          <div className="auth-visual-logo">
            <div className="auth-visual-logo-icon"><Sprout size={20} color="white" /></div>
            <span>{t.appName}</span>
          </div>
          <div className="auth-visual-content">
            <div className="auth-testimonial">
              <p style={{ color: 'white', fontWeight: 700, fontSize: '1.05rem', marginBottom: '1rem', fontFamily: 'var(--font-head)' }}>{t.signupBenefitTitle}</p>
              {[t.signupBenefit1, t.signupBenefit2, t.signupBenefit3, t.signupBenefit4].map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                  <Check size={14} color="#86efac" style={{ marginTop: 3, flexShrink: 0 }} />
                  <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem', lineHeight: 1.5 }}>{b}</span>
                </div>
              ))}
            </div>
            <div className="auth-stats">
              <div><div className="auth-stat-val">{t.statFree}</div><div className="auth-stat-lbl">{t.statAlways}</div></div>
              <div><div className="auth-stat-val">5K+</div><div className="auth-stat-lbl">{t.statFarmers}</div></div>
              <div><div className="auth-stat-val">22+</div><div className="auth-stat-lbl">{t.statCrops}</div></div>
            </div>
          </div>
        </div>

        {/* Right – Form */}
        <div className="auth-form-panel">
          {/* Language pill row */}
          <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {LANGUAGES.map(l => (
              <button key={l.code} onClick={() => setLang(l.code)}
                style={{ padding: '4px 10px', borderRadius: 999, border: '1px solid var(--border)', fontSize: '0.78rem', fontFamily: 'var(--font-body)', cursor: 'pointer', transition: 'all 0.2s', background: lang === l.code ? 'var(--clr-primary-glow)' : 'transparent', color: lang === l.code ? 'var(--clr-primary)' : 'var(--txt-muted)', fontWeight: lang === l.code ? 700 : 400 }}>
                {l.flag} {l.native}
              </button>
            ))}
          </div>

          <div className="auth-form-box">
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--clr-primary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--clr-primary)', marginBottom: 16 }}>
                <Sprout size={22} />
              </div>
              <h2>{t.signupTitle}</h2>
              <p className="auth-sub">{t.signupSub}</p>
            </div>

            <button className="social-btn" style={{ marginBottom: '1rem' }} type="button">
              <span style={{ fontSize: 18 }}>🌐</span> {t.signupGoogleBtn}
            </button>
            <div className="auth-divider">{t.signupOrEmail}</div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>{t.signupNameLabel}</label>
                <div className="input-wrap">
                  <span className="input-icon"><User size={14} /></span>
                  <input className="field" type="text" placeholder={t.signupNamePlaceholder} value={name} onChange={e => setName(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label>{t.loginEmailLabel}</label>
                <div className="input-wrap">
                  <span className="input-icon"><Mail size={14} /></span>
                  <input className="field" type="email" placeholder={t.signupEmailPlaceholder} value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
              </div>
              <div className="form-group">
                <label>{t.loginPasswordLabel}</label>
                <div className="input-wrap">
                  <span className="input-icon"><Lock size={14} /></span>
                  <input className="field" type={showPw ? 'text' : 'password'} placeholder={t.signupPasswordPlaceholder} value={password} onChange={e => setPassword(e.target.value)} required style={{ paddingRight: 42 }} />
                  <button type="button" className="pw-toggle" onClick={() => setShowPw(s => !s)}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {password && (
                  <>
                    <div className="pw-strength-bar"><div className="pw-strength-fill" style={{ width: `${strength.score * 25}%`, background: strength.color }} /></div>
                    <div className="pw-strength-label" style={{ color: strength.color }}>{strength.label}</div>
                  </>
                )}
              </div>
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', fontSize: '0.82rem', color: 'var(--txt-secondary)' }}>
                <div onClick={() => setAgree(a => !a)} style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1, border: `2px solid ${agree ? 'var(--clr-primary)' : 'var(--border)'}`, background: agree ? 'var(--clr-primary)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease', cursor: 'pointer' }}>
                  {agree && <Check size={11} color="white" strokeWidth={3} />}
                </div>
                <span>{t.signupTerms} <a href="#" style={{ color: 'var(--clr-primary)', fontWeight: 600 }}>{t.signupTermsLink}</a> {t.signupAnd} <a href="#" style={{ color: 'var(--clr-primary)', fontWeight: 600 }}>{t.signupPrivacy}</a></span>
              </label>
              {error && <div className="error-box" style={{ fontSize: '0.82rem' }}>⚠ {error}</div>}
              <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading}>
                {loading ? <><Loader2 size={18} className="spin" /> {t.signupLoading}</> : <><ArrowRight size={18} /> {t.signupBtn}</>}
              </button>
            </form>
            <div className="auth-switch">
              {t.signupHaveAccount} <a onClick={() => navigate('/login')}>{t.signupSignIn}</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
