import React, { useState, useEffect, useContext } from 'react'
import { TrendingUp, TrendingDown, Search, ArrowLeft, RefreshCw, BarChart4, Calculator, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LangContext } from '../App'



export default function MarketPage() {
  const { t } = useContext(LangContext)
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Calculator State
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
    // Auto-refresh every 30 seconds for live feel
    const interval = setInterval(fetchMarketData, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    fetchMarketData()
  }

  // Calculate total price automatically
  useEffect(() => {
    const crop = data.find(c => c.id === parseInt(calcCropId))
    if (crop) {
      setTotalPrice(crop.price * (parseFloat(calcQty) || 0))
    } else {
      setTotalPrice(0)
    }
  }, [calcCropId, calcQty, data])

  // Set default crop when data is loaded
  useEffect(() => {
    if (data.length > 0 && !calcCropId) {
      const rice = data.find(c => c.name.toLowerCase() === 'rice')
      setCalcCropId(rice ? rice.id.toString() : data[0].id.toString())
    }
  }, [data, calcCropId])

  const filtered = data.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="app-wrapper">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="icon-btn" onClick={() => navigate('/')} title="Back to Dashboard">
            <ArrowLeft size={18} />
          </button>
          <div className="logo">
            <div className="logo-icon">📈</div>
            Marketplace
          </div>
        </div>
        <div className="header-actions">
           <div className="input-wrap" style={{ margin: 0, width: 240 }}>
             <span className="input-icon"><Search size={16} /></span>
             <input
               className="field"
               placeholder="Search crop..."
               value={search}
               onChange={e => setSearch(e.target.value)}
               style={{ height: 40, borderRadius: 20 }}
             />
           </div>
           <button className="icon-btn" onClick={handleRefresh} disabled={loading}>
             <RefreshCw size={18} className={loading ? 'spin' : ''} />
           </button>
        </div>
      </header>

      <main className="main">
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 className="dashboard-title">Live Market Prices</h1>
            <p className="dashboard-subtitle">Track real-time prices and trends across agricultural markets</p>
          </div>
          <div style={{ background: 'var(--clr-primary-glow)', padding: '8px 16px', borderRadius: 'var(--r-md)', display: 'flex', alignItems: 'center', gap: 8, color: 'var(--clr-primary)', fontWeight: 700, fontSize: '0.9rem' }}>
            <BarChart4 size={16} /> Update live every 5m
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
              {filtered.map(crop => (
                <tr key={crop.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontWeight: 700 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-input)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                        {crop.name[0]}
                      </div>
                      {crop.name}
                    </div>
                  </td>
                  <td><span style={{ color: 'var(--txt-muted)', fontWeight: 600 }}>{crop.symbol}</span></td>
                  <td><span style={{ fontWeight: 800 }}>₹{crop.price.toFixed(2)}</span></td>
                  <td>
                    <span className={`trend-badge ${crop.change >= 0 ? 'up' : 'down'}`}>
                      {crop.change >= 0 ? '+' : ''}{crop.change.toFixed(1)}%
                    </span>
                  </td>
                  <td>
                    <div className="trend-line">
                      {crop.trend === 'up' && <TrendingUp size={18} color="#2d8a2d" />}
                      {crop.trend === 'down' && <TrendingDown size={18} color="#ef4444" />}
                      {crop.trend === 'stable' && <RefreshCw size={18} color="var(--txt-muted)" />}
                      <span style={{ marginLeft: 8, fontSize: '0.9rem', color: 'var(--txt-secondary)' }}>
                        {crop.trend === 'up' ? 'Strong Buy' : crop.trend === 'down' ? 'Sell' : 'Hold'}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Calculator FAB */}
      <button 
        className="calc-fab" 
        onClick={() => setIsCalcOpen(true)}
        title="Price Calculator"
      >
        <Calculator size={24} />
      </button>

      {/* Calculator Modal */}
      {isCalcOpen && (
        <div className="modal-overlay" onClick={() => setIsCalcOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 400 }}>
            <div className="modal-header" style={{ background: 'linear-gradient(135deg, var(--clr-primary-glow), transparent)' }}>
              <div className="modal-title">
                <div className="modal-title-icon" style={{ background: 'var(--clr-primary-glow)', color: 'var(--clr-primary)' }}>
                  <Calculator size={20} />
                </div>
                <h3>Price Calculator</h3>
              </div>
              <button className="modal-close" onClick={() => setIsCalcOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Select Crop</label>
                <select 
                  className="field" 
                  value={calcCropId} 
                  onChange={e => setCalcCropId(e.target.value)}
                  style={{ paddingLeft: 16 }}
                >
                  {data.map(crop => (
                    <option key={crop.id} value={crop.id}>{crop.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Quantity (kg)</label>
                <div className="input-wrap">
                  <input 
                    type="number"
                    className="field"
                    value={calcQty}
                    onChange={e => setCalcQty(e.target.value)}
                    placeholder="Enter quantity..."
                    style={{ paddingLeft: 16 }}
                  />
                </div>
              </div>
              <div style={{ 
                background: 'var(--bg-input)', 
                padding: '1.5rem', 
                borderRadius: 'var(--r-md)', 
                border: '2px solid var(--clr-primary)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--txt-muted)', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>
                  Estimated Total
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--clr-primary)', fontFamily: 'var(--font-head)' }}>
                  ₹{totalPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--txt-secondary)', marginTop: 4 }}>
                  at current market rate
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .market-table { width: 100%; border-collapse: collapse; text-align: left; }
        .market-table th { padding: 1.25rem 1.5rem; border-bottom: 2px solid var(--border); color: var(--txt-muted); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }
        .market-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); font-size: 0.95rem; vertical-align: middle; }
        .market-table tr:hover { background: var(--bg-input); }
        .trend-badge { padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 0.85rem; }
        .trend-badge.up { background: #dcfce7; color: #166534; }
        .trend-badge.down { background: #fee2e2; color: #991b1b; }
        .trend-line { display: flex; align-items: center; }
        
        .calc-fab {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--clr-primary), var(--clr-primary-light));
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 32px var(--clr-primary-glow), 0 0 0 4px rgba(255,255,255,0.1);
          cursor: pointer;
          transition: all var(--t-med);
          z-index: 90;
        }
        .calc-fab:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 12px 40px var(--clr-primary-glow), 0 0 0 6px rgba(255,255,255,0.2);
        }
        .calc-fab:active {
          transform: translateY(0) scale(0.95);
        }
      `}</style>
    </div>

  )
}
