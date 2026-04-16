import React, { useState, useEffect, useContext } from 'react'
import { TrendingUp, TrendingDown, Search, ArrowLeft, RefreshCw, BarChart4, Calculator, X, Minus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LangContext } from '../App'

export default function MarketPage() {
  const { t } = useContext(LangContext)
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  
  const [isCalcOpen, setIsCalcOpen] = useState(false)
  const [calcCropId, setCalcCropId] = useState('')
  const [calcQty, setCalcQty] = useState(100)
  const [totalPrice, setTotalPrice] = useState(0)

  const fetchMarketData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/market-prices')
      const result = await res.json()
      setData(result)
    } catch (err) {
      console.error("Failed to fetch market data:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMarketData()
    const interval = setInterval(fetchMarketData, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const crop = data.find(c => c.id === parseInt(calcCropId))
    if (crop) {
      setTotalPrice(crop.price * (parseFloat(calcQty) || 0))
    } else {
      setTotalPrice(0)
    }
  }, [calcCropId, calcQty, data])

  useEffect(() => {
    if (data.length > 0 && !calcCropId) {
      const rice = data.find(c => c.name.toLowerCase() === 'rice')
      setCalcCropId(rice ? rice.id.toString() : data[0].id.toString())
    }
  }, [data, calcCropId])

  const filtered = data.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="page-content" style={{ maxWidth: 1200 }}>
      <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="dashboard-title">Live Market Prices</h1>
          <p className="dashboard-subtitle">Track real-time prices and trends across agricultural markets</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div className="input-wrap" style={{ margin: 0, width: 220 }}>
            <span className="input-icon"><Search size={14} /></span>
            <input
              className="field"
              placeholder="Search crop..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ height: 38, borderRadius: 8 }}
            />
          </div>
          <button className="icon-btn" onClick={fetchMarketData} disabled={loading} style={{ width: 38, height: 38 }}>
            <RefreshCw size={15} className={loading ? 'spin' : ''} />
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="market-table">
          <thead>
            <tr>
              <th>Crop Name</th>
              <th>Symbol</th>
              <th>Price (per kg)</th>
              <th>24h Change</th>
              <th>Market Trend</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((crop, idx) => (
              <tr key={crop.id} style={{ animation: `revealUp 0.3s ease ${idx * 20}ms both` }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 600 }}>
                    <div style={{ 
                      width: 32, height: 32, borderRadius: 8, 
                      background: 'var(--bg-input)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      fontSize: '0.85rem', fontWeight: 700, color: 'var(--clr-primary)',
                      fontFamily: 'var(--font-head)'
                    }}>
                      {crop.name[0]}
                    </div>
                    {crop.name}
                  </div>
                </td>
                <td><span style={{ color: 'var(--txt-muted)', fontWeight: 500, fontSize: '0.85rem' }}>{crop.symbol}</span></td>
                <td><span style={{ fontWeight: 700 }}>₹{crop.price.toFixed(2)}</span></td>
                <td>
                  <span className={`trend-badge ${crop.change >= 0 ? 'up' : 'down'}`}>
                    {crop.change >= 0 ? '+' : ''}{crop.change.toFixed(1)}%
                  </span>
                </td>
                <td>
                  <div className="trend-line">
                    {crop.trend === 'up' && <TrendingUp size={16} color="var(--clr-primary)" />}
                    {crop.trend === 'down' && <TrendingDown size={16} color="#c53030" />}
                    {crop.trend === 'stable' && <Minus size={16} color="var(--txt-muted)" />}
                    <span style={{ marginLeft: 6, fontSize: '0.85rem', color: 'var(--txt-secondary)' }}>
                      {crop.trend === 'up' ? 'Buy' : crop.trend === 'down' ? 'Sell' : 'Hold'}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Calculator FAB */}
      <button 
        className="calc-fab" 
        onClick={() => setIsCalcOpen(true)}
        title="Price Calculator"
      >
        <Calculator size={20} />
      </button>

      {/* Calculator Modal */}
      {isCalcOpen && (
        <div className="modal-overlay" onClick={() => setIsCalcOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <div className="modal-title">
                <div className="modal-title-icon" style={{ background: 'var(--clr-primary-subtle)', color: 'var(--clr-primary)' }}>
                  <Calculator size={16} />
                </div>
                <h3>Price Calculator</h3>
              </div>
              <button className="modal-close" onClick={() => setIsCalcOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label>Select Crop</label>
                <select 
                  className="field" 
                  value={calcCropId} 
                  onChange={e => setCalcCropId(e.target.value)}
                  style={{ paddingLeft: 14 }}
                >
                  {data.map(crop => (
                    <option key={crop.id} value={crop.id}>{crop.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label>Quantity (kg)</label>
                <div className="input-wrap">
                  <input 
                    type="number"
                    className="field"
                    value={calcQty}
                    onChange={e => setCalcQty(e.target.value)}
                    placeholder="Enter quantity..."
                    style={{ paddingLeft: 14 }}
                  />
                </div>
              </div>
              <div style={{ 
                background: 'var(--bg-input)', 
                padding: '1.25rem', 
                borderRadius: 'var(--r-md)', 
                border: '1px solid var(--clr-primary-border)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--txt-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4, letterSpacing: '0.04em' }}>
                  Estimated Total
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--clr-primary)', fontFamily: 'var(--font-head)' }}>
                  ₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--txt-muted)', marginTop: 3 }}>
                  at current market rate
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .market-table { width: 100%; border-collapse: collapse; text-align: left; }
        .market-table th { 
          padding: 1rem 1.25rem; 
          border-bottom: 1px solid var(--border); 
          color: var(--txt-muted); 
          font-size: 0.78rem; 
          text-transform: uppercase; 
          letter-spacing: 0.04em;
          font-weight: 600;
          font-family: var(--font-head);
        }
        .market-table td { 
          padding: 0.875rem 1.25rem; 
          border-bottom: 1px solid var(--border); 
          font-size: 0.9rem; 
          vertical-align: middle; 
        }
        .market-table tbody tr { transition: background 0.15s; }
        .market-table tbody tr:hover { background: var(--bg-hover); }
        .market-table tbody tr:last-child td { border-bottom: none; }
        .trend-badge { 
          padding: 3px 8px; 
          border-radius: 4px; 
          font-weight: 700; 
          font-size: 0.8rem; 
        }
        .trend-badge.up { background: rgba(58,125,68,0.08); color: #2d6335; }
        .trend-badge.down { background: rgba(197,48,48,0.08); color: #c53030; }
        .trend-line { display: flex; align-items: center; }
        
        .calc-fab {
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          width: 52px;
          height: 52px;
          border-radius: var(--r-md);
          background: var(--clr-primary);
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-lg);
          cursor: pointer;
          transition: all var(--t-fast);
          z-index: 90;
        }
        .calc-fab:hover {
          transform: translateY(-2px);
          background: var(--clr-primary-dark);
          box-shadow: var(--shadow-lg);
        }
        .calc-fab:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  )
}
