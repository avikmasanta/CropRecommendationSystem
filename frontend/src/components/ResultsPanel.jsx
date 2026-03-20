import { useContext } from 'react'
import { Wheat, BarChart2, Loader2, Sparkles, AlertCircle } from 'lucide-react'
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
  const hasResults = predictions && !predictions.error && predictions.all_predictions
  return (
    <div className="card">
      <div className="card-header">
        <div className="card-header-icon"><Wheat size={18} /></div>
        <div>
          <div className="card-title">{t.resultsTitle}</div>
          <div className="card-subtitle">{t.resultsSub}</div>
        </div>
      </div>
      <div className="card-body">
        {loading && (
          <div className="empty-state">
            <div className="empty-icon" style={{ background: 'var(--clr-primary-glow)', color: 'var(--clr-primary)' }}>
              <Loader2 size={28} className="spin" />
            </div>
            <p style={{ color: 'var(--txt-secondary)' }}>{t.loadingText}</p>
          </div>
        )}
        {!loading && !predictions && (
          <div className="empty-state">
            <div className="empty-icon"><BarChart2 size={28} /></div>
            <p style={{ fontWeight: 600 }}>{t.emptyTitle}</p>
            <p style={{ fontSize: '0.8rem' }}>{t.emptyDesc}</p>
          </div>
        )}
        {!loading && predictions?.error && (
          <div className="error-box"><AlertCircle size={16} /><span>{predictions.error}</span></div>
        )}
        {!loading && hasResults && (
          <>
            <div className="crop-list">
              {predictions.all_predictions.map((item, idx) => {
                const badge = getBadge(item.probability, t)
                const progCls = getProgClass(item.probability)
                const imgUrl = CROP_IMAGES[item.crop.toLowerCase()] || FALLBACK
                return (
                  <div key={item.crop} className={`crop-item ${idx === 0 ? 'rank-1' : ''}`} style={{ animationDelay: `${idx * 80}ms` }}>
                    <div className="crop-item-inner">
                      <div className="crop-avatar">
                        <img src={imgUrl} alt={item.crop} loading="lazy" />
                      </div>
                      <div className="crop-info">
                        <div className="crop-name">
                          {item.crop}
                          {idx === 0 && <span className="crown-badge">{t.bestMatch}</span>}
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
                      <span className={`badge ${badge.cls}`}>{badge.label}</span>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="ai-cta">
              <button className="btn-ai" onClick={onAskAI}>
                <Sparkles size={16} /> {t.askAiBtn}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
