import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart2, Loader2, Sparkles, AlertCircle, Sprout, ArrowRight, Award, Leaf } from 'lucide-react'
import { LangContext } from '../App'

const CROP_IMAGES = {
  rice: '/crops/rice.jpg',
  wheat: '/crops/wheat.jpg',
  jute: '/crops/jute.jpg',
  cotton: '/crops/cotton.jpg',
  maize: '/crops/maize.jpg',
  apple: '/crops/apple.jpg',
  grapes: '/crops/grapes.jpg',
  mango: '/crops/mango.jpg',
  orange: '/crops/orange.jpg',
  banana: '/crops/banana.jpg',
  papaya: '/crops/papaya.jpg',
  watermelon: '/crops/watermelon.jpg',
  muskmelon: '/crops/muskmelon.jpg',
  pomegranate: '/crops/pomegranate.jpg',
  coconut: '/crops/coconut.jpg',
  coffee: '/crops/coffee.jpg',
  chickpea: '/crops/chickpea.jpg',
  kidneybeans: '/crops/kidneybeans.jpg',
  lentil: '/crops/lentil.jpg',
  mungbean: '/crops/mungbean.jpg',
  blackgram: '/crops/blackgram.jpg',
  pigeonpeas: '/crops/pigeonpeas.jpg',
  mothbeans: '/crops/mothbeans.jpg',
}
const FALLBACK = '/crops/fallback.jpg'

function getBadge(prob, t) {
  if (prob > 60) return { cls: 'badge-high', label: t.badgeHigh }
  if (prob > 20) return { cls: 'badge-medium', label: t.badgeMedium }
  return { cls: 'badge-low', label: t.badgeLow }
}
function getProgClass(prob) {
  if (prob > 60) return 'prog-high'
  if (prob > 20) return 'prog-medium'
  return 'prog-low'
}

export default function ResultsPanel({ predictions, loading, onAskAI }) {
  const { t } = useContext(LangContext)
  const navigate = useNavigate()
  const hasResults = predictions && !predictions.error && predictions.all_predictions

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-icon"><BarChart2 size={16} /></div>
        <div>
          <div className="card-title">{t.resultsTitle}</div>
          <div className="card-subtitle">{t.resultsSub}</div>
        </div>
      </div>
      <div className="card-body">
        {loading && (
          <div className="empty-state">
            <div className="empty-icon" style={{ color: 'var(--clr-primary)' }}>
              <Loader2 size={24} className="spin" />
            </div>
            <p style={{ color: 'var(--clr-primary)', fontWeight: 600 }}>Analyzing your soil...</p>
            <p>Please wait a moment</p>
          </div>
        )}
        {!loading && !predictions && (
          <div className="empty-state">
            <div className="empty-icon"><Leaf size={24} /></div>
            <p style={{ fontWeight: 600, color: 'var(--txt-primary)' }}>{t.emptyTitle}</p>
            <p>{t.emptyDesc}</p>
          </div>
        )}
        {!loading && predictions?.error && (
          <div className="error-box"><AlertCircle size={16} /><span>{predictions.error}</span></div>
        )}
        {!loading && hasResults && (() => {
          const topItem = predictions.all_predictions[0]
          const topImg = CROP_IMAGES[topItem.crop.toLowerCase()] || FALLBACK

          return (
            <>
              {/* Top crop hero */}
              <div className="top-crop-hero">
                <img
                  src={topImg}
                  alt={topItem.crop}
                  className="top-crop-img"
                  onError={e => { e.target.src = FALLBACK }}
                />
                <div className="top-crop-info">
                  <div className="top-crop-tag"><Award size={12} /> {t.bestMatch ?? 'Best Match'}</div>
                  <div className="top-crop-name">{topItem.crop}</div>
                  <div style={{ marginTop: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: '0.82rem', color: 'var(--txt-secondary)', fontWeight: 500 }}>
                        {t.confidence ?? 'Confidence'}
                      </span>
                      <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--clr-primary)' }}>
                        {topItem.probability}%
                      </span>
                    </div>
                    <div className="progress-track" style={{ height: 6 }}>
                      <div
                        className={`progress-bar ${getProgClass(topItem.probability)}`}
                        style={{ width: `${topItem.probability}%` }}
                      />
                    </div>
                  </div>
                  
                  <button 
                    className="btn btn-primary btn-full" 
                    onClick={() => navigate(`/guide/${topItem.crop.toLowerCase()}`)}
                    style={{ marginTop: '1rem', gap: 8 }}
                  >
                    <Sprout size={16} /> How to Grow {topItem.crop} <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Other suggestions */}
              {predictions.all_predictions.length > 1 && (
                <div style={{ marginBottom: 4 }}>
                  <div className="section-label" style={{ marginTop: 4 }}>
                    Other Options
                  </div>
                  <div className="crop-list">
                    {predictions.all_predictions.slice(1).map((item, idx) => {
                      const badge = getBadge(item.probability, t)
                      const progCls = getProgClass(item.probability)
                      const imgUrl = CROP_IMAGES[item.crop.toLowerCase()] || FALLBACK
                      return (
                        <div key={item.crop} className="crop-item" style={{ animationDelay: `${idx * 60}ms` }}>
                          <div className="crop-item-inner">
                            <div className="crop-avatar">
                              <img
                                src={imgUrl}
                                alt={item.crop}
                                loading="lazy"
                                onError={e => { e.target.src = FALLBACK }}
                              />
                            </div>
                            <div className="crop-info">
                              <div className="crop-name">
                                {item.crop}
                              </div>
                              <div className="progress-wrap">
                                <div className="progress-track">
                                  <div className={`progress-bar ${progCls}`} style={{ width: `${item.probability}%` }} />
                                </div>
                                <div className="progress-label">
                                  <span>{t.confidence}</span>
                                  <span className="pct">{item.probability}%</span>
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, alignItems: 'flex-end' }}>
                               <span className={`badge ${badge.cls}`}>{badge.label}</span>
                               <button 
                                 className="icon-btn" 
                                 title={t.guideHowToGrow}
                                 onClick={() => navigate(`/guide/${item.crop.toLowerCase()}`)}
                                 style={{ width: 30, height: 30, borderRadius: 6 }}
                               >
                                 <Sprout size={14} />
                               </button>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              <div className="ai-cta">
                <button className="btn-ai" onClick={onAskAI}>
                  <Sparkles size={16} /> {t.askAiBtn}
                </button>
              </div>
            </>
          )
        })()}
      </div>
    </div>
  )
}
