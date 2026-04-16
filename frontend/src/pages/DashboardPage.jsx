import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sprout, CloudSun, Bug, TrendingUp, Store, Landmark, ArrowRight, Sparkles, ShoppingBag, ChevronRight, IndianRupee, Shield, BookOpen } from 'lucide-react'
import { LangContext } from '../App'

/* ── Government Schemes ──────────────────────── */
const GOV_SCHEMES = [
  { id: 1, name: 'PM-KISAN', category: 'CENTRAL', status: 'ACTIVE', benefit: '₹6,000/yr', desc: 'Direct income support of ₹6,000 per year in 3 installments to small and marginal farmers.', color: '#10B981' },
  { id: 2, name: 'PMFBY – Crop Insurance', category: 'INSURANCE', status: 'ACTIVE', benefit: 'Upto 100%', desc: 'Comprehensive crop insurance against natural calamities, pests & diseases at minimal premium.', color: '#3B82F6' },
  { id: 3, name: 'Kisan Credit Card (KCC)', category: 'CREDIT', status: 'ACTIVE', benefit: '4% Interest', desc: 'Agricultural loans at subsidized 4% annual interest rate for crop cultivation and farm expenses.', color: '#F59E0B' },
  { id: 4, name: 'Soil Health Card Scheme', category: 'ADVISORY', status: 'ACTIVE', benefit: 'Free', desc: 'Free soil testing and nutrient-based recommendations to improve productivity and reduce costs.', color: '#8B5CF6' },
]

/* ── Sample market finds ─────────────────────── */
const MARKET_FINDS = [
  { name: 'Rice', price: '₹42/kg', location: 'Punjab', tag: 'BEST', img: '/crops/rice.jpg' },
  { name: 'Wheat', price: '₹28/kg', location: 'Haryana', tag: 'FRESH', img: '/crops/wheat.jpg' },
  { name: 'Mango', price: '₹120/kg', location: 'Maharashtra', tag: 'SEASON', img: '/crops/mango.jpg' },
]

/* ── AI Insight cards ────────────────────────── */
const AI_CARDS = [
  { id: 'price', title: 'Price Prediction', sub: 'Priority Analysis', icon: TrendingUp, color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', path: '/price-predict' },
  { id: 'disease', title: 'Disease Diagnosis', sub: 'Priority Analysis', icon: Bug, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', path: '/disease' },
  { id: 'crop', title: 'Crop Recommendation', sub: 'AI-Powered', icon: Sprout, color: '#10B981', bg: 'rgba(16,185,129,0.1)', path: '/recommend' },
  { id: 'weather', title: 'Weather & Advice', sub: 'Live Forecast', icon: CloudSun, color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', path: '/weather' },
]

export default function DashboardPage({ user, weather }) {
  const navigate = useNavigate()
  const { t } = useContext(LangContext)
  const userName = user?.name || 'Farmer'

  return (
    <div className="page-content">
      {/* ── Welcome Hero Banner ──────────────── */}
      <div className="dash-hero" style={{ animation: 'revealUp 0.5s ease' }}>
        <div className="dash-hero-bg"></div>
        {/* Botanical leaf decorations */}
        <svg className="dash-hero-leaves" viewBox="0 0 1200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Large leaf circle - right */}
          <circle cx="950" cy="100" r="80" stroke="rgba(255,255,255,0.04)" strokeWidth="1" fill="none"/>
          <path d="M920 60 Q950 30, 980 60 Q1010 90, 980 120 Q950 150, 920 120 Q890 90, 920 60Z" stroke="rgba(255,255,255,0.06)" strokeWidth="0.8" fill="none"/>
          <path d="M950 30 L950 170" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5"/>
          {/* Fern - right side */}
          <path d="M1080 180 Q1090 140, 1100 100 Q1110 60, 1120 20" stroke="rgba(255,255,255,0.05)" strokeWidth="0.8" fill="none"/>
          <path d="M1100 100 Q1120 90, 1130 70" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" fill="none"/>
          <path d="M1100 100 Q1080 85, 1070 65" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" fill="none"/>
          <path d="M1090 140 Q1110 130, 1120 115" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" fill="none"/>
          <path d="M1090 140 Q1070 125, 1060 110" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" fill="none"/>
          {/* Leaf cluster - center-right */}
          <circle cx="800" cy="60" r="50" stroke="rgba(255,255,255,0.03)" strokeWidth="0.8" fill="none"/>
          <path d="M780 40 Q800 20, 820 40 Q840 60, 820 80 Q800 100, 780 80 Q760 60, 780 40Z" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7" fill="none"/>
          {/* Small wheat - far right */}
          <path d="M1160 190 Q1155 150, 1150 110 Q1145 70, 1140 30" stroke="rgba(255,255,255,0.04)" strokeWidth="0.7" fill="none"/>
          <ellipse cx="1150" cy="80" rx="8" ry="15" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" fill="none" transform="rotate(-10 1150 80)"/>
          <ellipse cx="1145" cy="50" rx="7" ry="13" stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" fill="none" transform="rotate(10 1145 50)"/>
          {/* Leaves - center */}
          <path d="M650 170 Q670 130, 660 90" stroke="rgba(255,255,255,0.04)" strokeWidth="0.6" fill="none"/>
          <path d="M660 130 Q680 120, 690 100" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" fill="none"/>
          <path d="M660 130 Q640 115, 635 95" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" fill="none"/>
        </svg>

        <div className="dash-hero-content">
          <div className="dash-hero-badge">
            <Sparkles size={12} /> Powered by AI
          </div>
          <h1 className="dash-hero-title">Welcome, {userName}!</h1>
          <p className="dash-hero-text">Your all-in-one solution for modern farming. What would you like to do today?</p>
        </div>

        <button className="dash-hero-weather-btn" onClick={() => navigate('/weather')}>
          <CloudSun size={14} /> Show Local Weather
        </button>
      </div>

      {/* ── Government Schemes + Market Finds ── */}
      <div className="dash-two-col" style={{ animation: 'revealUp 0.5s ease 80ms both' }}>
        {/* Government Schemes */}
        <div className="dash-section-card">
          <div className="dash-section-header">
            <div className="dash-section-title">
              <Landmark size={16} className="dash-section-icon" /> Government Schemes
            </div>
            <span className="dash-view-all" onClick={() => navigate('/schemes')}>View All →</span>
          </div>
          <div className="scheme-list">
            {GOV_SCHEMES.map((scheme, idx) => (
              <div key={scheme.id} className="scheme-item" onClick={() => navigate('/schemes')}
                style={{ animationDelay: `${idx * 60 + 150}ms` }}>
                <div className="scheme-icon-wrap" style={{ background: `${scheme.color}15`, color: scheme.color }}>
                  {scheme.category === 'CENTRAL' ? <IndianRupee size={18} /> :
                   scheme.category === 'INSURANCE' ? <Shield size={18} /> :
                   scheme.category === 'CREDIT' ? <Store size={18} /> :
                   <BookOpen size={18} />}
                </div>
                <div className="scheme-body">
                  <div className="scheme-top-row">
                    <span className="scheme-cat" style={{ color: scheme.color }}>{scheme.category}</span>
                    <span className="scheme-status">{scheme.status}</span>
                  </div>
                  <div className="scheme-name">{scheme.name}</div>
                  <div className="scheme-desc">{scheme.desc}</div>
                </div>
                <div className="scheme-benefit" style={{ color: scheme.color }}>{scheme.benefit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Finds */}
        <div className="dash-section-card">
          <div className="dash-section-header">
            <div className="dash-section-title">
              <ShoppingBag size={16} className="dash-section-icon" /> Market Finds
            </div>
            <span className="dash-view-all" onClick={() => navigate('/market')}>Browse Market →</span>
          </div>
          <div className="market-list">
            {MARKET_FINDS.map((item, idx) => (
              <div key={item.name} className="market-item" style={{ animationDelay: `${idx * 60 + 150}ms` }}>
                <img src={item.img} alt={item.name} className="market-img" onError={e => { e.target.style.display = 'none' }} />
                <div className="market-info">
                  <div className="market-name">{item.name}</div>
                  <div className="market-loc"><span className="market-tag">{item.tag}</span> {item.location}</div>
                </div>
                <div className="market-price">{item.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── AI-Powered Insights ──────────────── */}
      <div className="dash-ai-section" style={{ animation: 'revealUp 0.5s ease 200ms both' }}>
        <div className="dash-section-title" style={{ marginBottom: '1.25rem' }}>
          <Sparkles size={16} className="dash-section-icon" style={{ color: '#F59E0B' }} /> AI-Powered Insights
        </div>
        <div className="ai-cards-grid">
          {AI_CARDS.map((card, idx) => (
            <div key={card.id} className="ai-insight-card" onClick={() => navigate(card.path)}
              style={{ '--card-accent': card.color, animationDelay: `${idx * 60 + 280}ms` }}>
              <div className="ai-insight-icon" style={{ background: card.bg, color: card.color }}>
                <card.icon size={22} />
              </div>
              <div className="ai-insight-info">
                <div className="ai-insight-title">{card.title}</div>
                <div className="ai-insight-sub" style={{ color: card.color }}>{card.sub}</div>
              </div>
              <ChevronRight size={16} className="ai-insight-arrow" />
            </div>
          ))}
        </div>
      </div>

      {/* ── Dashboard Styles ─── */}
      <style>{`
        /* Hero Banner */
        .dash-hero {
          position: relative;
          border-radius: var(--r-lg);
          overflow: hidden;
          padding: 2.5rem 2rem;
          margin-bottom: 1.5rem;
          min-height: 180px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
        }
        .dash-hero-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #0a1628 0%, #0d1b2a 40%, #0f1f30 70%, #0a1628 100%);
          z-index: 0;
        }
        [data-theme="light"] .dash-hero-bg {
          background: linear-gradient(135deg, #1b4332 0%, #2d6a4f 40%, #40916c 70%, #1b4332 100%);
        }
        .dash-hero-leaves {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          pointer-events: none;
        }
        .dash-hero-content { position: relative; z-index: 2; }
        .dash-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          color: #10B981;
          background: rgba(16,185,129,0.12);
          border: 1px solid rgba(16,185,129,0.2);
          padding: 4px 12px;
          border-radius: 6px;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .dash-hero-title {
          font-family: var(--font-head);
          font-size: 1.85rem;
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 0.4rem;
          line-height: 1.2;
        }
        [data-theme="light"] .dash-hero-title { color: #ffffff; }
        .dash-hero-text {
          font-size: 0.95rem;
          color: rgba(255,255,255,0.55);
          max-width: 480px;
          line-height: 1.5;
        }
        [data-theme="light"] .dash-hero-text { color: rgba(255,255,255,0.7); }
        .dash-hero-weather-btn {
          position: absolute;
          top: 20px;
          right: 20px;
          z-index: 3;
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.78rem;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 8px 16px;
          border-radius: var(--r-sm);
          cursor: pointer;
          font-family: var(--font-body);
          transition: all 0.2s;
        }
        .dash-hero-weather-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #ffffff;
          border-color: rgba(255,255,255,0.2);
        }

        /* Two column layout */
        .dash-two-col {
          display: grid;
          grid-template-columns: 1.4fr 1fr;
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 900px) {
          .dash-two-col { grid-template-columns: 1fr; }
        }

        .dash-section-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          overflow: hidden;
        }
        .dash-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 1.25rem;
          border-bottom: 1px solid var(--border);
        }
        .dash-section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-family: var(--font-head);
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--txt-primary);
        }
        .dash-section-icon { color: var(--clr-primary); flex-shrink: 0; }
        .dash-view-all {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--clr-primary);
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .dash-view-all:hover { opacity: 0.7; }

        /* Government Schemes */
        .scheme-list { padding: 0; }
        .scheme-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
          animation: revealUp 0.4s ease both;
          cursor: pointer;
        }
        .scheme-item:last-child { border-bottom: none; }
        .scheme-item:hover { background: var(--bg-hover); }
        .scheme-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .scheme-body { flex: 1; min-width: 0; }
        .scheme-top-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 3px;
        }
        .scheme-cat {
          font-size: 0.62rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }
        .scheme-status {
          font-size: 0.58rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #10B981;
          background: rgba(16,185,129,0.1);
          padding: 1px 7px;
          border-radius: 3px;
          border: 1px solid rgba(16,185,129,0.2);
        }
        .scheme-name {
          font-weight: 700;
          font-size: 0.88rem;
          color: var(--txt-primary);
          margin-bottom: 3px;
        }
        .scheme-desc {
          font-size: 0.75rem;
          color: var(--txt-muted);
          line-height: 1.5;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 400px;
        }
        .scheme-benefit {
          font-family: var(--font-head);
          font-weight: 800;
          font-size: 0.85rem;
          flex-shrink: 0;
          white-space: nowrap;
        }

        /* Market Finds */
        .market-list { padding: 0; }
        .market-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0.85rem 1.25rem;
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
          animation: revealUp 0.4s ease both;
        }
        .market-item:last-child { border-bottom: none; }
        .market-item:hover { background: var(--bg-hover); }
        .market-img {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          object-fit: cover;
          border: 1px solid var(--border);
        }
        .market-info { flex: 1; }
        .market-name {
          font-weight: 700;
          font-size: 0.88rem;
          color: var(--txt-primary);
        }
        .market-loc {
          font-size: 0.72rem;
          color: var(--txt-muted);
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 2px;
        }
        .market-tag {
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: #10B981;
          background: rgba(16,185,129,0.1);
          padding: 1px 6px;
          border-radius: 3px;
        }
        .market-price {
          font-family: var(--font-head);
          font-weight: 800;
          font-size: 0.95rem;
          color: #10B981;
        }

        /* AI Insight cards */
        .dash-ai-section {
          margin-bottom: 2rem;
        }
        .ai-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1rem;
        }
        .ai-insight-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 14px;
          cursor: pointer;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
          animation: revealUp 0.4s ease both;
        }
        .ai-insight-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--card-accent, var(--clr-primary));
          opacity: 0;
          transition: opacity 0.25s;
        }
        .ai-insight-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-lg);
          border-color: var(--border);
        }
        .ai-insight-card:hover::before { opacity: 1; }
        .ai-insight-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ai-insight-info { flex: 1; }
        .ai-insight-title {
          font-family: var(--font-head);
          font-weight: 700;
          font-size: 0.95rem;
          color: var(--txt-primary);
          margin-bottom: 2px;
        }
        .ai-insight-sub {
          font-size: 0.72rem;
          font-weight: 600;
        }
        .ai-insight-arrow {
          color: var(--txt-muted);
          flex-shrink: 0;
          transition: transform 0.2s;
        }
        .ai-insight-card:hover .ai-insight-arrow {
          transform: translateX(3px);
          color: var(--card-accent);
        }
      `}</style>
    </div>
  )
}
