import React, { useContext } from 'react'
import { ExternalLink, Landmark, CreditCard, Droplets, Leaf, Sprout, ShieldCheck, Globe, Info, Zap } from 'lucide-react'
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
      icon: <Landmark size={22} />,
      color: '#3a7d44',
      category: t.schemeFinancial
    },
    {
      id: 'pmfby',
      name: t.scheme_pmfby_name,
      fullname: 'Pradhan Mantri Fasal Bima Yojana',
      desc: t.scheme_pmfby_desc,
      link: 'https://pmfby.gov.in/',
      icon: <ShieldCheck size={22} />,
      color: '#4a7dc9',
      category: t.schemeInsurance
    },
    {
      id: 'soil-health',
      name: t.scheme_soil_name,
      fullname: 'Soil Health Card Scheme',
      desc: t.scheme_soil_desc,
      link: 'https://www.soilhealth.dac.gov.in/',
      icon: <Leaf size={22} />,
      color: '#c77b30',
      category: t.schemeResource
    },
    {
      id: 'enam',
      name: t.scheme_enam_name,
      fullname: 'National Agriculture Market',
      desc: t.scheme_enam_desc,
      link: 'https://www.enam.gov.in/',
      icon: <Globe size={22} />,
      color: '#b05580',
      category: t.schemeMarket
    },
    {
      id: 'kcc',
      name: t.scheme_kcc_name,
      fullname: 'Kisan Credit Card',
      desc: t.scheme_kcc_desc,
      link: 'https://agriwelfare.gov.in/',
      icon: <CreditCard size={22} />,
      color: '#7c5bbf',
      category: t.schemeFinancial
    },
    {
      id: 'pmksy',
      name: t.scheme_pmksy_name,
      fullname: 'Pradhan Mantri Krishi Sinchayee Yojana',
      desc: t.scheme_pmksy_desc,
      link: 'https://pmksy.gov.in/',
      icon: <Droplets size={22} />,
      color: '#2d8a8a',
      category: t.schemeResource
    },
    {
      id: 'pmkmy',
      name: t.scheme_pmkmy_name,
      fullname: 'Pradhan Mantri Kisan Maandhan Yojana',
      desc: t.scheme_pmkmy_desc,
      link: 'https://pmkmy.gov.in/',
      icon: <Sprout size={22} />,
      color: '#c9555e',
      category: t.schemeFinancial
    }
  ]

  return (
    <div className="page-content" style={{ maxWidth: 1200 }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', marginTop: '0.5rem' }}>
        <div style={{ 
          display: 'inline-flex', alignItems: 'center', gap: 6, 
          background: 'var(--clr-primary-subtle)', padding: '5px 14px', 
          borderRadius: 6, color: 'var(--clr-primary)', marginBottom: 16, 
          fontSize: '0.78rem', fontWeight: 600, 
          border: '1px solid var(--clr-primary-border)' 
        }}>
          <Landmark size={13} /> {t.heroBadge}
        </div>
        <h1 className="dashboard-title" style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>{t.schemesTitle}</h1>
        <p className="dashboard-subtitle" style={{ maxWidth: 600, margin: '0 auto', fontSize: '1rem' }}>{t.schemesSub}</p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '1.25rem' 
      }}>
        {SCHEMES.map((s, idx) => (
          <div key={s.id} className="card scheme-card" style={{ 
            padding: '1.75rem',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 16,
            animation: `revealUp 0.4s ease ${idx * 50}ms both`
          }}>
            {/* Category Badge */}
            <div style={{ 
              position: 'absolute', 
              top: 20, 
              right: 20, 
              fontSize: '0.68rem', 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              padding: '3px 10px',
              borderRadius: 4,
              background: s.color + '10',
              color: s.color,
              border: `1px solid ${s.color}20`
            }}>
              {s.category}
            </div>

            <div style={{ 
              width: 48, 
              height: 48, 
              borderRadius: 12, 
              background: `${s.color}0d`, 
              color: s.color, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: '1.25rem',
              border: `1px solid ${s.color}18`
            }}>
              {React.cloneElement(s.icon, { size: 22 })}
            </div>
            
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 6, fontFamily: 'var(--font-head)' }}>{s.name}</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--txt-muted)', fontWeight: 500, marginBottom: '0.75rem', fontStyle: 'italic' }}>
              {s.fullname}
            </p>
            
            <p style={{ fontSize: '0.9rem', color: 'var(--txt-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
              {s.desc}
            </p>
            
            <a href={s.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-full" style={{ 
              gap: 8, 
              justifyContent: 'center',
              background: s.color,
              height: 44
            }}>
              {t.schemesVisitBtn} <ExternalLink size={14} />
            </a>
          </div>
        ))}
      </div>
      
      <div className="card" style={{ 
        marginTop: '3rem', 
        textAlign: 'center', 
        padding: '3rem 2rem', 
        borderRadius: 20,
        position: 'relative',
        overflow: 'hidden'
      }}>
         <div style={{ position: 'relative', zIndex: 1 }}>
           <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-head)' }}>{t.schemesMoreInfoTitle}</h2>
           <p style={{ color: 'var(--txt-secondary)', maxWidth: 600, margin: '0 auto 2rem', fontSize: '1rem', lineHeight: 1.7 }}>
             {t.schemesMoreInfoDesc}
           </p>
           <a href="https://agriwelfare.gov.in/" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg" style={{ paddingInline: 36 }}>
             {t.schemesAgriWelfareBtn}
           </a>
         </div>
      </div>

      <style>{`
        .scheme-card {
          transition: all 0.25s ease;
        }
        .scheme-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-lg);
        }
      `}</style>
    </div>
  )
}
