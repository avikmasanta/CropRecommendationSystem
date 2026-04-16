import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Sprout, CloudSun, Bug, TrendingUp,
  Store, Landmark, Sun, Moon, LogOut, ChevronLeft, ChevronRight,
  Globe, Leaf, Github
} from 'lucide-react'
import { LangContext } from '../App'

const AI_TOOLS = [
  { path: '/recommend', icon: Sprout, label: 'Crop Recommendation' },
  { path: '/weather', icon: CloudSun, label: 'Weather & Advice' },
  { path: '/disease', icon: Bug, label: 'Disease Diagnosis' },
  { path: '/price-predict', icon: TrendingUp, label: 'Price Prediction' },
]

const PLATFORM = [
  { path: '/market', icon: Store, label: 'Marketplace' },
  { path: '/schemes', icon: Landmark, label: 'Gov. Schemes' },
]

export default function Sidebar({ collapsed, setCollapsed, theme, toggleTheme, lang, setLang, onLogout, user }) {
  const location = useLocation()
  const { t } = useContext(LangContext)

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <Leaf size={18} />
        </div>
        <span className="sidebar-logo-text">Kishanbandhu</span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {/* Dashboard */}
        <Link to="/" className={`sidebar-nav-item ${isActive('/') && location.pathname === '/' ? 'active' : ''}`}>
          <span className="sidebar-nav-icon"><LayoutDashboard size={18} /></span>
          <span className="sidebar-nav-label">Dashboard</span>
        </Link>

        {/* AI Tools Section */}
        <div className="sidebar-section-label">AI Tools</div>
        {AI_TOOLS.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <span className="sidebar-nav-icon"><item.icon size={18} /></span>
            <span className="sidebar-nav-label">{item.label}</span>
          </Link>
        ))}

        {/* Platform Section */}
        <div className="sidebar-section-label">Platform</div>
        {PLATFORM.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <span className="sidebar-nav-icon"><item.icon size={18} /></span>
            <span className="sidebar-nav-label">{item.label}</span>
          </Link>
        ))}

        <div className="sidebar-section-label">Resources</div>
        <a 
          href="https://github.com/avikmasanta/CropRecommendationSystem" 
          target="_blank" 
          rel="noopener noreferrer"
          className="sidebar-nav-item"
          style={{ textDecoration: 'none' }}
        >
          <span className="sidebar-nav-icon"><Github size={18} /></span>
          <span className="sidebar-nav-label">GitHub Source</span>
        </a>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-actions">
          <button className="icon-btn theme-btn" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          {user && (
            <button className="icon-btn" onClick={onLogout} title="Logout">
              <LogOut size={15} />
            </button>
          )}
        </div>
        <button className="sidebar-collapse-btn hidden-mobile" onClick={() => setCollapsed(c => !c)}>
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span className="sidebar-nav-label" style={{ marginLeft: 6, fontSize: '0.8rem' }}>Collapse</span></>}
        </button>
      </div>
    </aside>
  )
}
