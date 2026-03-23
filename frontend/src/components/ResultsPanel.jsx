import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wheat, BarChart2, Loader2, Sparkles, AlertCircle, Sprout, ArrowRight } from 'lucide-react'
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

const CROP_EMOJIS = {
  rice: '🌾', wheat: '🌾', maize: '🌽', cotton: '🪴', jute: '🪴',
  apple: '🍎', mango: '🥭', banana: '🍌', grapes: '🍇', orange: '🍊',
  papaya: '🍈', watermelon: '🍉', muskmelon: '🍈', pomegranate: '🍎',
  coconut: '🥥', coffee: '☕', chickpea: '🫘', kidneybeans: '🫘',
  lentil: '🫘', mungbean: '🫘', blackgram: '🫘', pigeonpeas: '🫘', mothbeans: '🫘',
}

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
        <div className="card-header-icon">🌿</div>
        <div>
          <div className="card-title">{t.resultsTitle}</div>
          <div className="card-subtitle">{t.resultsSub}</div>
        </div>
      </div>
      <div className="card-body">
        {loading && (
          <div className="empty-state">
            <div className="empty-icon" style={{ background: 'var(--clr-primary-glow)', color: 'var(--clr-primary)', fontSize: '2rem' }}>
              🔍
            </div>
            <p style={{ color: 'var(--clr-primary)', fontWeight: 700, fontSize: '1rem' }}>Analyzing your soil...</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--txt-muted)' }}>Please wait a moment</p>
          </div>
        )}
        {!loading && !predictions && (
          <div className="empty-state">
            <div className="empty-icon" style={{ fontSize: '2.5rem' }}>🌱</div>
            <p style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--txt-primary)' }}>{t.emptyTitle}</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--txt-muted)' }}>{t.emptyDesc}</p>
          </div>
        )}
        {!loading && predictions?.error && (
          <div className="error-box"><AlertCircle size={18} /><span>{predictions.error}</span></div>
        )}
        {!loading && hasResults && (() => {
          const topItem = predictions.all_predictions[0]
          const topImg = CROP_IMAGES[topItem.crop.toLowerCase()] || FALLBACK
          const topEmoji = CROP_EMOJIS[topItem.crop.toLowerCase()] || '🌾'

          return (
            <>
              {/* Big top crop hero */}
              <div className="top-crop-hero">
                <img
                  src={topImg}
                  alt={topItem.crop}
                  className="top-crop-img"
                  onError={e => { e.target.src = FALLBACK }}
                />
                <div className="top-crop-info">
                  <div className="top-crop-tag">🏆 {t.bestMatch ?? 'Best Match'}</div>
                  <div className="top-crop-name">{topEmoji} {topItem.crop}</div>
                  <div style={{ marginTop: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.9rem', color: 'var(--txt-secondary)', fontWeight: 600 }}>
                        {t.confidence ?? 'Confidence'}
                      </span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--clr-primary)' }}>
                        {topItem.probability}%
                      </span>
                    </div>
                    <div className="progress-track" style={{ height: 10 }}>
                      <div
                        className={`progress-bar ${getProgClass(topItem.probability)}`}
                        style={{ width: `${topItem.probability}%` }}
                      />
                    </div>
                  </div>
                  
                  <button 
                    className="btn btn-primary btn-full" 
                    onClick={() => navigate(`/guide/${topItem.crop.toLowerCase()}`)}
                    style={{ marginTop: '1.5rem', background: 'white', color: 'var(--clr-primary)', fontWeight: 800, gap: 10 }}
                  >
                    <Sprout size={18} /> {t.guideHowToGrow} {topItem.crop} <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              {/* Other suggestions */}
              {predictions.all_predictions.length > 1 && (
                <div style={{ marginBottom: 4 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                    Other Options
                  </div>
                  <div className="crop-list">
                    {predictions.all_predictions.slice(1).map((item, idx) => {
                      const badge = getBadge(item.probability, t)
                      const progCls = getProgClass(item.probability)
                      const imgUrl = CROP_IMAGES[item.crop.toLowerCase()] || FALLBACK
                      const emoji = CROP_EMOJIS[item.crop.toLowerCase()] || '🌾'
                      return (
                        <div key={item.crop} className="crop-item" style={{ animationDelay: `${idx * 80}ms` }}>
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
                                {emoji} {item.crop}
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
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                               <span className={`badge ${badge.cls}`}>{badge.label}</span>
                               <button 
                                 className="icon-btn" 
                                 title={t.guideHowToGrow}
                                 onClick={() => navigate(`/guide/${item.crop.toLowerCase()}`)}
                                 style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--clr-primary-glow)', color: 'var(--clr-primary)' }}
                               >
                                 <Sprout size={16} />
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
                  <Sparkles size={18} /> {t.askAiBtn}
                </button>
              </div>
            </>
          )
        })()}
      </div>
    </div>
  )
}
