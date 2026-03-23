import React, { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer, Sprout, Droplets, Bug, AlertTriangle, Loader2, Sparkles, CheckCircle2, Info } from 'lucide-react'
import { LangContext } from '../App'
import Particles from '../components/Particles'
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
    // Generate guide instantly from local dynamic templates with photos
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
    }, 600); // Small artificial delay for smooth UI transition
  }, [crop, lang])

  const handlePrint = () => window.print()

  if (loading) return (
    <div className="main" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <Particles />
      <div className="loading-spinner">
        <Loader2 size={48} className="spin" color="var(--clr-primary)" />
      </div>
      <h2 style={{ marginTop: '2rem' }}>{t.guideLoading}</h2>
      <p style={{ color: 'var(--txt-muted)' }}>Asking Gemini AI for the best farming practices for {crop}...</p>
    </div>
  )

  if (error) return (
    <div className="main" style={{ textAlign: 'center', padding: '4rem' }}>
       <Particles />
       <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⚠️</div>
       <h2>Something went wrong</h2>
       <p style={{ color: 'var(--txt-muted)', marginBottom: '2rem', maxWidth: 600, marginInline: 'auto' }}>{error}</p>
       <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
         <button className="btn btn-primary" onClick={() => window.location.reload()}>🔄 Retry</button>
         <button className="btn btn-secondary" onClick={() => navigate('/')}>{t.guideBack}</button>
       </div>
    </div>
  )

  return (
    <>
      <Particles />
      <div className="main guide-page" style={{ maxWidth: 900, margin: '0 auto', padding: '2rem' }}>
        
        {/* Header Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
           <button className="btn btn-secondary" onClick={() => navigate('/')} style={{ gap: 8, height: 44, paddingInline: 16 }}>
             <ArrowLeft size={18} /> {t.guideBack}
           </button>
           <button className="btn btn-secondary no-print" onClick={handlePrint} style={{ gap: 8, height: 44, paddingInline: 16 }}>
             <Printer size={18} /> {t.guidePrint}
           </button>
        </div>

        {/* Hero Section */}
        <div className="guide-hero card" style={{ 
          padding: 0, 
          overflow: 'hidden', 
          marginBottom: '3rem', 
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 24,
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative'
        }}>
           <div style={{ 
             height: 380, 
             background: `linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%), url(${CROP_IMAGES[crop.toLowerCase()] || FALLBACK}) center/cover`,
             display: 'flex',
             flexDirection: 'column',
             alignItems: 'center',
             justifyContent: 'flex-end',
             padding: '3rem 2rem',
             color: 'white',
             textAlign: 'center'
           }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'linear-gradient(135deg, var(--clr-primary), #2dd4bf)', padding: '8px 20px', borderRadius: 99, marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 800, letterSpacing: 1, boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}>
                <Sparkles size={16} /> AI GENERATED GUIDE
              </div>
              <h1 style={{ fontSize: '4.5rem', marginBottom: '0.5rem', textTransform: 'capitalize', fontWeight: 900, textShadow: '0 10px 30px rgba(0,0,0,0.5)', lineHeight: 1.1 }}>{crop} {t.guideTitle}</h1>
              <p style={{ fontSize: '1.4rem', opacity: 0.85, fontWeight: 500, maxWidth: 600 }}>{t.guideHowToGrow} {crop} {t.guideSteps?.toLowerCase()}</p>
           </div>
        </div>

        <div className="guide-content-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem' }}>
          
          {/* Main Steps */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '2rem' }}>
              <span style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--clr-primary-glow)', color: 'var(--clr-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sprout size={24} />
              </span>
              <h2 style={{ fontSize: '1.8rem' }}>{t.guideSteps}</h2>
            </div>

            <div className="steps-container" style={{ position: 'relative', paddingLeft: '3rem', marginTop: '1rem' }}>
               <div style={{ position: 'absolute', left: '1.2rem', top: 10, bottom: 0, width: 3, background: 'linear-gradient(to bottom, var(--clr-primary) 0%, rgba(16, 185, 129, 0.1) 100%)', borderRadius: 3 }} />
               {guide?.steps?.map((step, idx) => (
                 <div key={idx} className="step-item fade-in-up" style={{ marginBottom: '3rem', position: 'relative', animationDelay: `${idx * 0.1}s` }}>
                    <div style={{ 
                      position: 'absolute', left: '-3.6rem', top: 0, 
                      width: 44, height: 44, borderRadius: '50%', 
                      background: 'linear-gradient(135deg, var(--clr-primary), #059669)', color: 'white', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.1rem', fontWeight: 900, zIndex: 1,
                      border: '4px solid var(--bg-main)',
                      boxShadow: '0 0 0 2px rgba(16, 185, 129, 0.3), 0 10px 20px rgba(0,0,0,0.2)'
                    }}>
                      {idx + 1}
                    </div>
                    <div className="card step-card" style={{ padding: '1.8rem', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' }}>
                       {(() => {
                         let stepObj = step;
                         if (typeof step === 'string') {
                           try { stepObj = JSON.parse(step); } catch (e) { /* ignore */ }
                         }
                         if (typeof stepObj === 'object' && stepObj !== null) {
                           return (
                             <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                               {stepObj.title && <strong style={{ color: 'var(--clr-primary)', fontSize: '1.25rem' }}>{stepObj.title}</strong>}
                               {stepObj.image && (
                                 <img 
                                   src={stepObj.image}
                                   alt={stepObj.title || 'Step illustration'}
                                   style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}
                                   loading="lazy"
                                 />
                               )}
                               <p style={{ margin: 0, color: 'var(--txt-primary)', fontSize: '1.05rem', lineHeight: 1.6 }}>{stepObj.description || stepObj.desc || stepObj.text}</p>
                             </div>
                           )
                         }
                         return (
                           <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                             <img 
                               src={`https://loremflickr.com/400/250/${crop},farming`}
                               alt="Step illustration"
                               style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)' }}
                               loading="lazy"
                             />
                             <p style={{ margin: 0, color: 'var(--txt-primary)', fontSize: '1.05rem', lineHeight: 1.6 }}>{step}</p>
                           </div>
                         );
                       })()}
                    </div>
                 </div>
               ))}
               {(!guide?.steps || !Array.isArray(guide.steps)) && <p style={{ opacity: 0.5 }}>No steps available.</p>}
            </div>
          </section>

          {/* Sidebar: Fertilizers & Diseases */}
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
             
             {/* Fertilizers */}
             <div className="card hover-glow" style={{ padding: '2rem', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: 24, background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.05) 0%, rgba(0,0,0,0) 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem', color: '#38bdf8' }}>
                   <div style={{ padding: 10, background: 'rgba(56, 189, 248, 0.1)', borderRadius: 12 }}>
                     <Droplets size={24} />
                   </div>
                   <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{t.guideFertilizers}</h3>
                </div>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: 'var(--txt-secondary)', margin: 0 }}>
                   {guide?.fertilizers}
                </p>
             </div>

             {/* Diseases */}
             <div className="card hover-glow" style={{ padding: '2rem', border: '1px solid rgba(248, 113, 113, 0.2)', borderRadius: 24, background: 'linear-gradient(180deg, rgba(248, 113, 113, 0.05) 0%, rgba(0,0,0,0) 100%)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '1.5rem', color: '#f87171' }}>
                   <div style={{ padding: 10, background: 'rgba(248, 113, 113, 0.1)', borderRadius: 12 }}>
                     <Bug size={24} />
                   </div>
                   <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>{t.guideDiseases}</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                   {Array.isArray(guide?.diseases) ? guide.diseases.map((d, idx) => (
                     <div key={idx} className="disease-item" style={{ borderBottom: idx < guide.diseases.length - 1 ? '1px dashed rgba(255,255,255,0.1)' : 'none', paddingBottom: idx < guide.diseases.length - 1 ? '1.5rem' : 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8, color: '#fca5a5' }}>
                           <AlertTriangle size={16} /> {d.name || 'Unknown Disease'}
                        </div>
                        {d.image && (
                          <img 
                            src={d.image}
                            alt={`${d.name} symptom`}
                            style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 12, marginBottom: 16, border: '1px solid rgba(248, 113, 113, 0.2)' }}
                            loading="lazy"
                          />
                        )}
                        <p style={{ fontSize: '0.95rem', color: 'var(--txt-muted)', marginBottom: 12, lineHeight: 1.5 }}>
                           <strong style={{ color: 'white' }}>Symptoms:</strong> {d.symptoms || 'N/A'}
                        </p>
                        <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px 16px', borderRadius: 12, borderLeft: '4px solid var(--clr-primary)' }}>
                           <p style={{ fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
                             <strong style={{ color: 'var(--clr-primary)' }}>Treatment:</strong> {d.treatment || 'N/A'}
                           </p>
                        </div>
                        {d.image_desc && (
                          <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.2)', padding: '8px 12px', borderRadius: 8, display: 'flex', gap: 8 }}>
                             <Info size={14} style={{ flexShrink: 0, marginTop: 2 }} />
                             <span>{d.image_desc}</span>
                          </div>
                        )}
                     </div>
                   )) : <p style={{ opacity: 0.5 }}>No disease info available.</p>}
                </div>
             </div>

          </aside>
        </div>

        <div style={{ marginTop: '5rem', padding: '2rem', background: 'var(--clr-primary-glow)', borderRadius: 20, textAlign: 'center', opacity: 0.8 }}>
           <p style={{ fontSize: '0.9rem', color: 'var(--clr-primary)', fontWeight: 600, margin: 0 }}>
             <Info size={16} style={{ display: 'inline', marginRight: 8, verticalAlign: 'text-bottom' }} />
             {t.guideDisclaimer}
           </p>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print, header, .Particles, footer { display: none !important; }
          .main { padding: 0 !important; margin: 0 !important; max-width: 100% !important; background: white !important; color: black !important; }
          .card { border: 1px solid #ddd !important; box-shadow: none !important; color: black !important; background: white !important; }
          .guide-hero { border: 2px solid #333 !important; }
          .guide-hero h1, .guide-hero p { text-shadow: none !important; color: black !important; }
          .guide-hero > div { background: white !important; }
          .step-item .card { background: white !important; border-bottom: 2px solid #eee !important; box-shadow: none !important; }
        }
        
        .fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .step-item:hover .step-card {
          transform: translateX(12px) scale(1.01);
          border-color: rgba(16, 185, 129, 0.4) !important;
          box-shadow: 0 15px 35px -5px rgba(16, 185, 129, 0.15) !important;
          background: rgba(255,255,255,0.04) !important;
        }
        
        .hover-glow {
          transition: all 0.3s ease;
        }
        .hover-glow:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.4);
        }

        @media (max-width: 900px) {
          .guide-content-grid { grid-template-columns: 1fr !important; }
          .guide-hero { height: auto; }
          .guide-hero > div { padding: 3rem 1.5rem !important; height: auto !important; }
          .guide-hero h1 { fontSize: 3rem !important; }
        }
      `}</style>
    </>
  )
}
