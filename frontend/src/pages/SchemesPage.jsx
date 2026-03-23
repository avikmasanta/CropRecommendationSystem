import React, { useContext } from 'react'
import { ExternalLink, Landmark, CreditCard, Droplets, Leaf, Sprout, ShieldCheck, Globe, Info, Zap } from 'lucide-react'
import Particles from '../components/Particles'
import { LangContext } from '../App'

export default function SchemesPage() {
  const { t } = useContext(LangContext)

  const SCHEMES = [
    {
      id: 'pm-kisan',
      name: t.scheme_pmkisan_name,
      fullname: 'Pradhan Mantri Kisan Samman Nidhi',
      desc: t.scheme_pmkisan_desc,
      link: 'https://pmkisan.gov.in/',
      icon: <Landmark size={24} />,
      color: '#4ade80',
      category: t.schemeFinancial
    },
    {
      id: 'pmfby',
      name: t.scheme_pmfby_name,
      fullname: 'Pradhan Mantri Fasal Bima Yojana',
      desc: t.scheme_pmfby_desc,
      link: 'https://pmfby.gov.in/',
      icon: <ShieldCheck size={24} />,
      color: '#60a5fa',
      category: t.schemeInsurance
    },
    {
      id: 'soil-health',
      name: t.scheme_soil_name,
      fullname: 'Soil Health Card Scheme',
      desc: t.scheme_soil_desc,
      link: 'https://www.soilhealth.dac.gov.in/',
      icon: <Leaf size={24} />,
      color: '#fbbf24',
      category: t.schemeResource
    },
    {
      id: 'enam',
      name: t.scheme_enam_name,
      fullname: 'National Agriculture Market',
      desc: t.scheme_enam_desc,
      link: 'https://www.enam.gov.in/',
      icon: <Globe size={24} />,
      color: '#f472b6',
      category: t.schemeMarket
    },
    {
      id: 'kcc',
      name: t.scheme_kcc_name,
      fullname: 'Kisan Credit Card',
      desc: t.scheme_kcc_desc,
      link: 'https://agriwelfare.gov.in/',
      icon: <CreditCard size={24} />,
      color: '#a78bfa',
      category: t.schemeFinancial
    },
    {
      id: 'pmksy',
      name: t.scheme_pmksy_name,
      fullname: 'Pradhan Mantri Krishi Sinchayee Yojana',
      desc: t.scheme_pmksy_desc,
      link: 'https://pmksy.gov.in/',
      icon: <Droplets size={24} />,
      color: '#2dd4bf',
      category: t.schemeResource
    },
    {
      id: 'pmkmy',
      name: t.scheme_pmkmy_name,
      fullname: 'PRADHAN MANTRI KISAN MAANDHAN YOJANA',
      desc: t.scheme_pmkmy_desc,
      link: 'https://pmkmy.gov.in/',
      icon: <Sprout size={24} />,
      color: '#fb7185',
      category: t.schemeFinancial
    }
  ]

  return (
    <>
      <Particles />
      <div className="main" style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '1rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'var(--clr-primary-glow)', padding: '6px 16px', borderRadius: 99, color: 'var(--clr-primary)', marginBottom: 20, fontSize: '0.85rem', fontWeight: 700, border: '1px solid var(--clr-primary-border)' }}>
            <Landmark size={14} /> {t.heroBadge}
          </div>
          <h1 className="dashboard-title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{t.schemesTitle}</h1>
          <p className="dashboard-subtitle" style={{ maxWidth: 700, margin: '0 auto', fontSize: '1.1rem' }}>{t.schemesSub}</p>
        </div>

        <div className="schemes-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
          gap: '2rem' 
        }}>
          {SCHEMES.map(s => (
            <div key={s.id} className="card scheme-card" style={{ 
              padding: '2rem',
              position: 'relative',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: 24
            }}>
              {/* Category Badge */}
              <div style={{ 
                position: 'absolute', 
                top: 24, 
                right: 24, 
                fontSize: '0.7rem', 
                fontWeight: 800, 
                textTransform: 'uppercase', 
                letterSpacing: '0.1em',
                padding: '4px 12px',
                borderRadius: 8,
                background: s.color + '20',
                color: s.color,
                border: `1px solid ${s.color}30`
              }}>
                {s.category}
              </div>

              <div style={{ 
                width: 64, 
                height: 64, 
                borderRadius: 20, 
                background: `linear-gradient(135deg, ${s.color}20, ${s.color}05)`, 
                color: s.color, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '1.5rem',
                border: `1px solid ${s.color}30`
              }}>
                {React.cloneElement(s.icon, { size: 28 })}
              </div>
              
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 8, fontFamily: 'var(--font-head)' }}>{s.name}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--txt-muted)', fontWeight: 500, marginBottom: '1rem', fontStyle: 'italic' }}>
                {s.fullname}
              </p>
              
              <p style={{ fontSize: '1rem', color: 'var(--txt-secondary)', lineHeight: 1.6, marginBottom: '2rem', flex: 1 }}>
                {s.desc}
              </p>
              
              <a href={s.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-full" style={{ 
                gap: 12, 
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${s.color}, ${s.color}dd)`,
                borderColor: 'transparent',
                boxShadow: `0 8px 20px ${s.color}30`,
                height: 52
              }}>
                {t.schemesVisitBtn} <ExternalLink size={18} />
              </a>

              {/* Decorative background element */}
              <div style={{ 
                position: 'absolute', 
                bottom: -20, 
                right: -20, 
                opacity: 0.03, 
                color: s.color,
                transform: 'rotate(-15deg)'
              }}>
                {React.cloneElement(s.icon, { size: 120 })}
              </div>
            </div>
          ))}
        </div>
        
        <div className="card" style={{ 
          marginTop: '5rem', 
          textAlign: 'center', 
          padding: '4rem 2rem', 
          background: 'linear-gradient(145deg, var(--clr-primary-glow), transparent)',
          border: '1px solid var(--clr-primary-border)',
          borderRadius: 32,
          position: 'relative',
          overflow: 'hidden'
        }}>
           <div style={{ position: 'relative', zIndex: 1 }}>
             <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🇮🇳</div>
             <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', fontWeight: 900 }}>{t.schemesMoreInfoTitle}</h2>
             <p style={{ color: 'var(--txt-secondary)', maxWidth: 700, margin: '0 auto 2.5rem', fontSize: '1.1rem', lineHeight: 1.7 }}>
               {t.schemesMoreInfoDesc}
             </p>
             <a href="https://agriwelfare.gov.in/" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg" style={{ paddingInline: 48, height: 60, fontSize: '1.1rem', borderRadius: 16 }}>
               {t.schemesAgriWelfareBtn}
             </a>
           </div>

           {/* Background Accents */}
           <div style={{ position: 'absolute', top: '10%', left: '5%', opacity: 0.1, color: 'var(--clr-primary)' }}><Info size={80} /></div>
           <div style={{ position: 'absolute', bottom: '10%', right: '5%', opacity: 0.1, color: 'var(--clr-primary)' }}><Zap size={80} /></div>
        </div>
      </div>
      
      <style>{`
        .scheme-card:hover {
          transform: translateY(-12px) scale(1.02);
          border-color: rgba(255, 255, 255, 0.2) !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
        }
        .scheme-card::after {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(225deg, rgba(255,255,255,0.05) 0%, transparent 50%);
          pointer-events: none;
        }
      `}</style>
    </>
  )
}
