import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Animated Background layers */}
      <div className="landing-bg"></div>
      <div className="landing-overlay"></div>

      {/* 3D Farmer Element (Animated float) */}
      <img src="/farmer-3d.png" alt="3D Modern Farmer" className="floating-element" />

      {/* Floating Glass Navbar */}
      <div className="glass-nav-container">
        <nav className="glass-nav">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Logo size={24} fontSize="1.25rem" color="#ffffff" />
          </div>
          
          <div className="glass-nav-links hidden-mobile">
            <Link to="#products" className="glass-nav-link">Products</Link>
            <Link to="#science" className="glass-nav-link">Science</Link>
            <Link to="/schemes" className="glass-nav-link">Government Schemes</Link>
            <Link to="/market" className="glass-nav-link">Marketplace</Link>
          </div>

          <div>
            <Link to="/login" className="glass-btn-solid">Discover</Link>
          </div>
        </nav>
      </div>

      {/* Main Hero Content */}
      <div className="landing-hero">
        <div className="hero-content">
          <div className="hero-label">Precision Agriculture</div>
          <h1 className="hero-title">
            Reveal your <br />
            <span>natural balance</span>
          </h1>
          <p className="hero-text">
            A scientific and caring approach to restore your farm's harmony. 
            Discover research-based, AI-driven crop recommendations tailored specifically for your soil.
          </p>
          <div className="hero-buttons">
            <button 
              className="glass-btn-solid" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              onClick={() => navigate('/dashboard')}
            >
              Start your journey <ArrowRight size={16} />
            </button>
            <button 
              className="glass-btn-outline"
              onClick={() => navigate('/market')}
            >
              Learn more
            </button>
          </div>
          
          <div style={{ marginTop: '40px', fontSize: '0.9rem', opacity: 0.7, color: '#fff' }}>
            Developed by <strong>Avik Masanta</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
