import React, { useState, useContext } from 'react'
import { MessageSquare, Star, Send, Sparkles, User, Mail, MessageCircle } from 'lucide-react'
import { LangContext } from '../App'

export default function FeedbackPage() {
  const { t } = useContext(LangContext)
  const [formData, setFormData] = useState({ name: '', email: '', rating: '5', message: '' })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        setSubmitted(true)
        setFormData({ name: '', email: '', rating: '5', message: '' })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Sample "Blog-like" existing feedback
  const sampleFeedback = [
    { id: 1, name: 'Amit Sharma', rating: 5, message: 'The crop recommendation is incredibly accurate! Helped me plan my mustard crop perfectly.', date: '2 days ago' },
    { id: 2, name: 'Sujata Patil', rating: 4, message: 'Market prices tracker is very useful. I saved 15% on my last sale by waiting for the right price.', date: '1 week ago' },
    { id: 3, name: 'Rajesh Kumar', rating: 5, message: 'Premium design and very easy to use even on mobile.', date: '3 days ago' },
  ]

  return (
    <div className="page-content">
      {/* Hero Banner — Using the 3D Landscape background */}
      <div className="hero-banner" style={{ 
        animation: 'revealUp 0.5s ease', 
        backgroundImage: 'url(/farm-landscape-3d.png)', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        position: 'relative', 
        overflow: 'hidden',
        minHeight: '220px'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,22,40,0.95) 0%, rgba(10,22,40,0.6) 50%, rgba(10,22,40,0.1) 100%)', zIndex: 1 }}></div>
        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.75rem 2rem' }}>
          <div className="dash-hero-badge" style={{ width: 'fit-content' }}>
            <Sparkles size={12} /> Community Feedback
          </div>
          <h1 className="hero-banner-title">Share Your <span>Experience</span></h1>
          <p className="hero-banner-text">Your feedback helps us grow. Tell us how we can improve your farming journey.</p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Feedback Form Card */}
        <div className="card" style={{ animation: 'revealUp 0.5s ease 0.1s both' }}>
          <div className="card-header">
            <div className="card-header-icon"><MessageSquare size={16} /></div>
            <div>
              <div className="card-title">Write a Review</div>
              <div className="card-subtitle">Share your thoughts with the community</div>
            </div>
          </div>
          <div className="card-body">
            {submitted ? (
              <div className="success-message" style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                <h3>Thank You!</h3>
                <p>Your feedback has been recorded and saved to our database.</p>
                <button className="btn btn-primary" onClick={() => setSubmitted(false)} style={{ marginTop: '1rem' }}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="feedback-form">
                <div className="form-group">
                  <label><User size={14} /> Full Name</label>
                  <input 
                    type="text" 
                    placeholder="E.g. John Doe"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label><Mail size={14} /> Email Address</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label><Star size={14} /> Rating</label>
                  <select 
                    value={formData.rating}
                    onChange={e => setFormData({...formData, rating: e.target.value})}
                  >
                    <option value="5">Excellent ⭐⭐⭐⭐⭐</option>
                    <option value="4">Very Good ⭐⭐⭐⭐</option>
                    <option value="3">Average ⭐⭐⭐</option>
                    <option value="2">Poor ⭐⭐</option>
                    <option value="1">Bad ⭐</option>
                  </select>
                </div>
                <div className="form-group">
                  <label><MessageCircle size={14} /> Your Message</label>
                  <textarea 
                    rows="4" 
                    placeholder="What do you think about Farmingo?"
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                  {loading ? 'Submitting...' : <><Send size={16} /> Submit Feedback</>}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Blog-like Feed of Feedback */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="card" style={{ animation: 'revealUp 0.5s ease 0.2s both' }}>
            <div className="card-header">
              <div className="card-header-icon" style={{ background: 'rgba(16,185,129,0.1)', color: '#10B981' }}>
                <Sparkles size={16} />
              </div>
              <div className="card-title">Recent Stories</div>
            </div>
            <div className="card-body" style={{ padding: '0' }}>
              <div className="feedback-feed">
                {sampleFeedback.map((item, idx) => (
                  <div key={item.id} className="feed-item" style={{ 
                    padding: '1.25rem',
                    borderBottom: idx === sampleFeedback.length - 1 ? 'none' : '1px solid var(--border)',
                    animation: `revealUp 0.4s ease ${0.3 + idx * 0.1}s both`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--txt-primary)' }}>{item.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--txt-muted)' }}>{item.date}</span>
                    </div>
                    <div style={{ color: '#F59E0B', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                      {'⭐'.repeat(item.rating)}
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--txt-secondary)', lineHeight: 1.5, margin: 0 }}>
                      "{item.message}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Quick Tip Card */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', color: 'white', animation: 'revealUp 0.5s ease 0.4s both' }}>
            <div className="card-body" style={{ padding: '1.5rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} /> Excel Export
              </h3>
              <p style={{ fontSize: '0.85rem', opacity: 0.9, lineHeight: 1.4, margin: 0 }}>
                Every feedback you submit is automatically saved to a <strong>feedback.csv</strong> file in the backend, which you can open directly in Microsoft Excel!
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .feedback-form .form-group {
          margin-bottom: 1.25rem;
        }
        .feedback-form label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--txt-secondary);
          margin-bottom: 0.5rem;
        }
        .feedback-form input, 
        .feedback-form select, 
        .feedback-form textarea {
          width: 100%;
          padding: 0.75rem;
          border-radius: var(--r-sm);
          background: var(--bg-input);
          border: 1px solid var(--border);
          color: var(--txt-primary);
          font-family: inherit;
          transition: border-color 0.2s;
        }
        .feedback-form input:focus, 
        .feedback-form select:focus, 
        .feedback-form textarea:focus {
          outline: none;
          border-color: var(--clr-primary);
        }
        .feed-item:hover {
          background: var(--bg-hover);
        }
      `}</style>
    </div>
  )
}
