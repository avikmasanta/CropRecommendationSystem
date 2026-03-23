import React, { useState, useEffect, useContext } from 'react'
import { TrendingUp, TrendingDown, Search, ArrowLeft, RefreshCw, BarChart4 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { LangContext } from '../App'



export default function MarketPage() {
  const { t } = useContext(LangContext)
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

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

      <style>{`
        .market-table { width: 100%; border-collapse: collapse; text-align: left; }
        .market-table th { padding: 1.25rem 1.5rem; border-bottom: 2px solid var(--border); color: var(--txt-muted); font-size: 0.85rem; text-transform: uppercase; letter-spacing: 1px; }
        .market-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid var(--border); font-size: 0.95rem; vertical-align: middle; }
        .market-table tr:hover { background: var(--bg-input); }
        .trend-badge { padding: 4px 10px; border-radius: 6px; font-weight: 800; font-size: 0.85rem; }
        .trend-badge.up { background: #dcfce7; color: #166534; }
        .trend-badge.down { background: #fee2e2; color: #991b1b; }
        .trend-line { display: flex; alignItems: center; }
      `}</style>
    </div>
  )
}
