import React, { useState } from 'react'
import { TrendingUp, MapPin, Loader2, BarChart4, Calendar, Leaf, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'

const CROPS = [
  'Rice', 'Wheat', 'Maize', 'Cotton', 'Jute', 'Apple', 'Mango', 'Banana',
  'Grapes', 'Coffee', 'Coconut', 'Papaya', 'Orange', 'Pomegranate',
  'Watermelon', 'Lentil', 'Blackgram', 'Mungbean', 'Chickpea'
]

const REGIONS = [
  'Punjab', 'Haryana', 'Uttar Pradesh', 'Maharashtra', 'West Bengal',
  'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Rajasthan', 'Gujarat',
  'Madhya Pradesh', 'Bihar', 'Odisha', 'Kerala', 'Assam'
]

export default function PricePredictionPage() {
  const [region, setRegion] = useState('')
  const [crop, setCrop] = useState('')
  const [date, setDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handlePredict = async () => {
    if (!region || !crop) return
    setLoading(true); setError(null); setResult(null)
    try {
      const res = await fetch('/api/predict-price', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ region, crop, date: date || new Date().toISOString().split('T')[0] })
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-content">
      <div className="page-header" style={{ animation: 'revealUp 0.4s ease' }}>
        <h1 className="page-title">Crop Price Prediction</h1>
        <p className="page-subtitle">Predict the price of a crop based on region and date using our AI model.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Input Panel */}
        <div className="card" style={{ animation: 'revealUp 0.4s ease 60ms both' }}>
          <div className="card-header">
            <div className="card-header-icon" style={{ background: 'linear-gradient(135deg, #9C27B0, #BA68C8)' }}>
              <BarChart4 size={16} />
            </div>
            <div>
              <div className="card-title">Prediction Parameters</div>
              <div className="card-subtitle">Enter crop and region details</div>
            </div>
          </div>
          <div className="card-body">
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label><MapPin size={12} style={{ display: 'inline', marginRight: 4 }} /> Region</label>
              <div className="input-wrap">
                <span className="input-icon"><MapPin size={14} /></span>
                <select className="field" value={region} onChange={e => setRegion(e.target.value)}>
                  <option value="">Select region...</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label><Leaf size={12} style={{ display: 'inline', marginRight: 4 }} /> Crop</label>
              <div className="input-wrap">
                <span className="input-icon"><Leaf size={14} /></span>
                <select className="field" value={crop} onChange={e => setCrop(e.target.value)}>
                  <option value="">Select crop...</option>
                  {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label><Calendar size={12} style={{ display: 'inline', marginRight: 4 }} /> Target Date</label>
              <div className="input-wrap">
                <span className="input-icon"><Calendar size={14} /></span>
                <input className="field" type="date" value={date} onChange={e => setDate(e.target.value)} />
              </div>
            </div>

            <button className="btn btn-primary btn-full" onClick={handlePredict} disabled={!region || !crop || loading}>
              {loading ? <><Loader2 size={16} className="spin" /> Predicting...</> : <><TrendingUp size={16} /> Predict Price</>}
            </button>

            {error && <div className="error-box" style={{ marginTop: '1rem' }}>{error}</div>}
          </div>
        </div>

        {/* Results Panel */}
        <div className="card" style={{ animation: 'revealUp 0.4s ease 120ms both' }}>
          <div className="card-header">
            <div className="card-header-icon" style={{ background: 'linear-gradient(135deg, #2D6A4F, #40916C)' }}>
              <TrendingUp size={16} />
            </div>
            <div>
              <div className="card-title">Prediction Result</div>
              <div className="card-subtitle">AI-powered price forecast</div>
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="empty-state">
                <div className="empty-icon" style={{ color: 'var(--clr-primary)' }}>
                  <Loader2 size={24} className="spin" />
                </div>
                <p style={{ fontWeight: 600, color: 'var(--clr-primary)' }}>Analyzing market data...</p>
                <p>Our AI is processing historical and real-time data.</p>
              </div>
            ) : result ? (
              <div>
                {/* Predicted Price */}
                <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--bg-input)', borderRadius: 'var(--r-md)', marginBottom: '1.25rem', border: '1px solid var(--clr-primary-border)' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                    Predicted Price
                  </div>
                  <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--clr-primary)', fontFamily: 'var(--font-head)' }}>
                    ₹{result.predictedPrice?.toFixed(2)}/kg
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 6 }}>
                    {result.trend === 'up' ? (
                      <><ArrowUpRight size={16} color="#2D6A4F" /><span style={{ color: '#2D6A4F', fontWeight: 600, fontSize: '0.9rem' }}>+{result.changePercent}%</span></>
                    ) : result.trend === 'down' ? (
                      <><ArrowDownRight size={16} color="#c53030" /><span style={{ color: '#c53030', fontWeight: 600, fontSize: '0.9rem' }}>-{result.changePercent}%</span></>
                    ) : (
                      <><Minus size={16} color="var(--txt-muted)" /><span style={{ color: 'var(--txt-muted)', fontWeight: 600, fontSize: '0.9rem' }}>Stable</span></>
                    )}
                  </div>
                </div>

                {/* Recommended Listing */}
                {result.recommendation && (
                  <div style={{ background: 'var(--clr-primary-subtle)', padding: '1rem', borderRadius: 'var(--r-md)', borderLeft: '3px solid var(--clr-primary)', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--clr-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Recommended Listing</div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--txt-secondary)', margin: 0, lineHeight: 1.6 }}>{result.recommendation}</p>
                  </div>
                )}

                {/* Factors */}
                {result.factors && result.factors.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                      Top Influencing Factors
                    </div>
                    {result.factors.map((f, idx) => (
                      <div key={idx} style={{
                        display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                        borderBottom: idx < result.factors.length - 1 ? '1px solid var(--border)' : 'none'
                      }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--clr-primary)', flexShrink: 0 }} />
                        <span style={{ fontSize: '0.88rem', color: 'var(--txt-secondary)' }}>{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon"><TrendingUp size={24} /></div>
                <p style={{ fontWeight: 600, color: 'var(--txt-primary)' }}>Awaiting Prediction</p>
                <p>Select a region and crop to get AI-powered price prediction.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .page-content > div:last-of-type:not(.page-header) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
