import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer, Sprout, Droplets, Bug, AlertTriangle, Loader2, Sparkles, CheckCircle2, Info } from 'lucide-react'
import { LangContext } from '../App'
import { getCropGuide } from '../data/cropGuides'

const CROP_IMAGES = {
  rice: '/crops/rice.jpg', wheat: '/crops/wheat.jpg', jute: '/crops/jute.jpg', cotton: '/crops/cotton.jpg',
  maize: '/crops/maize.jpg', apple: '/crops/apple.jpg', grapes: '/crops/grapes.jpg', mango: '/crops/mango.jpg',
  orange: '/crops/orange.jpg', banana: '/crops/banana.jpg', papaya: '/crops/papaya.jpg', watermelon: '/crops/watermelon.jpg',
  muskmelon: '/crops/muskmelon.jpg', pomegranate: '/crops/pomegranate.jpg', coconut: '/crops/coconut.jpg', coffee: '/crops/coffee.jpg',
  chickpea: '/crops/chickpea.jpg', kidneybeans: '/crops/kidneybeans.jpg', lentil: '/crops/lentil.jpg', mungbean: '/crops/mungbean.jpg',
  blackgram: '/crops/blackgram.jpg', pigeonpeas: '/crops/pigeonpeas.jpg', mothbeans: '/crops/mothbeans.jpg',
}
const FALLBACK = '/crops/fallback.jpg'

export default function CropGuidePage() {
  const { crop } = useParams()
  const navigate = useNavigate()
  const { t, lang } = useContext(LangContext)
  const [guide, setGuide] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      try {
        const data = getCropGuide(crop);
        setGuide(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load crop guide.");
        setLoading(false);
      }
    }, 600);
  }, [crop, lang])

  const handlePrint = () => window.print()

  if (loading) return (
    <div className="page-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Loader2 size={40} className="spin" color="var(--clr-primary)" />
      <h2 style={{ marginTop: '1.5rem', fontFamily: 'var(--font-head)', fontWeight: 600 }}>{t.guideLoading}</h2>
      <p style={{ color: 'var(--txt-muted)', fontSize: '0.9rem' }}>Loading farming guide for {crop}...</p>
    </div>
  )

  if (error) return (
    <div className="page-content" style={{ textAlign: 'center', padding: '4rem' }}>
       <AlertTriangle size={48} color="var(--clr-accent)" style={{ marginBottom: '1rem' }} />
       <h2 style={{ fontFamily: 'var(--font-head)' }}>Something went wrong</h2>
       <p style={{ color: 'var(--txt-muted)', marginBottom: '2rem', maxWidth: 500, marginInline: 'auto' }}>{error}</p>
       <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
         <button className="btn btn-primary" onClick={() => window.location.reload()}>Retry</button>
         <button className="btn btn-secondary" onClick={() => navigate('/')}>{t.guideBack}</button>
       </div>
    </div>
  )

  return (
    <>
      <div className="page-content guide-page" style={{ maxWidth: 880 }}>
        
        {/* Header Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
           <button className="btn btn-secondary" onClick={() => navigate('/')} style={{ gap: 6, height: 38, paddingInline: 14, fontSize: '0.85rem' }}>
             <ArrowLeft size={16} /> {t.guideBack}
           </button>
           <button className="btn btn-secondary no-print" onClick={handlePrint} style={{ gap: 6, height: 38, paddingInline: 14, fontSize: '0.85rem' }}>
             <Printer size={16} /> {t.guidePrint}
           </button>
        </div>

        {/* Hero Section */}
        <div className="card" style={{ 
          padding: 0, 
          overflow: 'hidden', 
          marginBottom: '2rem', 
          borderRadius: 16
        }}>
           <div style={{ 
             height: 320, 
             background: `linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%), url(${CROP_IMAGES[crop.toLowerCase()] || FALLBACK}) center/cover`,
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'flex-end',
             padding: '2.5rem 2rem',
             color: 'white',
             textAlign: 'center'
           }}>
              <div style={{ 
                display: 'inline-flex', alignItems: 'center', gap: 6, 
                background: 'var(--clr-primary)', padding: '5px 14px', 
                borderRadius: 6, marginBottom: '1rem', 
                fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                <Sparkles size={13} /> Farming Guide
              </div>
              <h1 style={{ fontSize: '3rem', marginBottom: '0.4rem', textTransform: 'capitalize', fontWeight: 700, fontFamily: 'var(--font-head)', lineHeight: 1.1 }}>{crop}</h1>
              <p style={{ fontSize: '1.1rem', opacity: 0.85, fontWeight: 400, maxWidth: 500 }}>{t.guideHowToGrow} {crop}</p>
           </div>
        </div>

        <div className="guide-content-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem' }}>
          
          {/* Main Steps */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.5rem' }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--clr-primary-subtle)', color: 'var(--clr-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sprout size={18} />
              </span>
              <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-head)', fontWeight: 700 }}>{t.guideSteps}</h2>
            </div>

            <div className="steps-container" style={{ position: 'relative', paddingLeft: '2.5rem', marginTop: '0.75rem' }}>
               <div style={{ position: 'absolute', left: '1rem', top: 8, bottom: 0, width: 2, background: 'var(--border)', borderRadius: 2 }} />
               {guide?.steps?.map((step, idx) => (
                 <div key={idx} className="step-item" style={{ marginBottom: '1.75rem', position: 'relative', animation: `revealUp 0.4s ease ${idx * 80}ms both` }}>
                    <div style={{ 
                      position: 'absolute', left: '-2.95rem', top: 0, 
                      width: 34, height: 34, borderRadius: '50%', 
                      background: 'var(--clr-primary)', color: 'white', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.85rem', fontWeight: 700, zIndex: 1,
                      border: '3px solid var(--bg-base)'
                    }}>
                      {idx + 1}
                    </div>
                    <div className="card" style={{ padding: '1.25rem', borderRadius: 12, transition: 'box-shadow 0.2s' }}>
                       {(() => {
                         let stepObj = step;
                         if (typeof step === 'string') {
                           try { stepObj = JSON.parse(step); } catch (e) { /* ignore */ }
                         }
                         if (typeof stepObj === 'object' && stepObj !== null) {
                           return (
                             <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                               {stepObj.title && <strong style={{ color: 'var(--clr-primary)', fontSize: '1.05rem' }}>{stepObj.title}</strong>}
                               {stepObj.image && (
                                 <img 
                                   src={stepObj.image}
                                   alt={stepObj.title || 'Step illustration'}
                                   style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }}
                                   loading="lazy"
                                 />
                               )}
                               <p style={{ margin: 0, color: 'var(--txt-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{stepObj.description || stepObj.desc || stepObj.text}</p>
                             </div>
                           )
                         }
                         return (
                           <p style={{ margin: 0, color: 'var(--txt-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>{step}</p>
                         );
                       })()}
                    </div>
                 </div>
               ))}
               {(!guide?.steps || !Array.isArray(guide.steps)) && <p style={{ color: 'var(--txt-muted)' }}>No steps available.</p>}
            </div>
          </section>

          {/* Sidebar: Fertilizers & Diseases */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
             
             {/* Fertilizers */}
             <div className="card" style={{ padding: '1.5rem', borderRadius: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem', color: '#4a7dc9' }}>
                   <div style={{ padding: 8, background: 'rgba(74, 125, 201, 0.08)', borderRadius: 8 }}>
                     <Droplets size={18} />
                   </div>
                   <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, fontFamily: 'var(--font-head)' }}>{t.guideFertilizers}</h3>
                </div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--txt-secondary)', margin: 0 }}>
                   {guide?.fertilizers}
                </p>
             </div>

             {/* Diseases */}
             <div className="card" style={{ padding: '1.5rem', borderRadius: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem', color: '#c53030' }}>
                   <div style={{ padding: 8, background: 'rgba(197, 48, 48, 0.06)', borderRadius: 8 }}>
                     <Bug size={18} />
                   </div>
                   <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, fontFamily: 'var(--font-head)' }}>{t.guideDiseases}</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                   {Array.isArray(guide?.diseases) ? guide.diseases.map((d, idx) => (
                     <div key={idx} style={{ borderBottom: idx < guide.diseases.length - 1 ? '1px solid var(--border)' : 'none', paddingBottom: idx < guide.diseases.length - 1 ? '1.25rem' : 0 }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--txt-primary)' }}>
                           <AlertTriangle size={14} color="#c53030" /> {d.name || 'Unknown Disease'}
                        </div>
                        {d.image && (
                          <img 
                            src={d.image}
                            alt={`${d.name} symptom`}
                            style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 8, marginBottom: 10, border: '1px solid var(--border)' }}
                            loading="lazy"
                          />
                        )}
                        <p style={{ fontSize: '0.85rem', color: 'var(--txt-muted)', marginBottom: 8, lineHeight: 1.5 }}>
                           <strong style={{ color: 'var(--txt-secondary)' }}>Symptoms:</strong> {d.symptoms || 'N/A'}
                        </p>
                        <div style={{ background: 'var(--clr-primary-subtle)', padding: '10px 12px', borderRadius: 8, borderLeft: '3px solid var(--clr-primary)' }}>
                           <p style={{ fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
                             <strong style={{ color: 'var(--clr-primary)' }}>Treatment:</strong> {d.treatment || 'N/A'}
                           </p>
                        </div>
                     </div>
                   )) : <p style={{ color: 'var(--txt-muted)' }}>No disease info available.</p>}
                </div>
             </div>

          </aside>
        </div>

        <div style={{ marginTop: '3rem', padding: '1.25rem 1.5rem', background: 'var(--clr-primary-subtle)', borderRadius: 12, textAlign: 'center', border: '1px solid var(--clr-primary-border)' }}>
           <p style={{ fontSize: '0.82rem', color: 'var(--clr-primary)', fontWeight: 500, margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
             <Info size={14} />
             {t.guideDisclaimer}
           </p>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print, header, footer { display: none !important; }
          .main { padding: 0 !important; margin: 0 !important; max-width: 100% !important; background: white !important; color: black !important; }
          .card { border: 1px solid #ddd !important; box-shadow: none !important; color: black !important; background: white !important; }
        }
        
        .step-item:hover .card {
          box-shadow: var(--shadow-md);
        }

        @media (max-width: 900px) {
          .guide-content-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}
