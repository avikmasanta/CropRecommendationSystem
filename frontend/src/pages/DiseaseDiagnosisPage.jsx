import React, { useState, useRef } from 'react'
import { Bug, Upload, Loader2, AlertTriangle, CheckCircle2, Leaf, Camera } from 'lucide-react'

export default function DiseaseDiagnosisPage() {
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const fileRef = useRef(null)

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImage(file)
    setResult(null); setError(null)
    const reader = new FileReader()
    reader.onload = (ev) => setImagePreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleDiagnose = async () => {
    if (!image) return
    setLoading(true); setError(null); setResult(null)
    try {
      // Convert image to base64 and send to Gemini for analysis
      const reader = new FileReader()
      reader.onload = async (ev) => {
        try {
          const base64 = ev.target.result.split(',')[1]
          const response = await fetch('/api/diagnose-disease', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64, mimeType: image.type })
          })
          const data = await response.json()
          if (data.error) throw new Error(data.error)
          setResult(data)
        } catch (e) {
          setError(e.message)
        } finally {
          setLoading(false)
        }
      }
      reader.readAsDataURL(image)
    } catch (e) {
      setError(e.message)
      setLoading(false)
    }
  }

  return (
    <div className="page-content">
      <div className="page-header" style={{ animation: 'revealUp 0.4s ease' }}>
        <h1 className="page-title">Crop Disease Diagnosis</h1>
        <p className="page-subtitle">Upload an image to diagnose crop diseases instantly using AI-powered analysis.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Upload Panel */}
        <div className="card" style={{ animation: 'revealUp 0.4s ease 60ms both' }}>
          <div className="card-header">
            <div className="card-header-icon" style={{ background: 'linear-gradient(135deg, #E76F51, #F4A261)' }}>
              <Camera size={16} />
            </div>
            <div>
              <div className="card-title">Upload Crop Photo</div>
              <div className="card-subtitle">For best results, use a clear photo of the affected area</div>
            </div>
          </div>
          <div className="card-body">
            <input type="file" accept="image/*" ref={fileRef} onChange={handleImageSelect} style={{ display: 'none' }} />

            <div
              className={`upload-area ${imagePreview ? 'has-image' : ''}`}
              onClick={() => fileRef.current?.click()}
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Selected crop" />
              ) : (
                <>
                  <Upload size={40} color="var(--txt-muted)" style={{ marginBottom: '1rem' }} />
                  <p style={{ fontWeight: 600, color: 'var(--txt-primary)', marginBottom: 4 }}>Click to upload or drag & drop</p>
                  <p style={{ fontSize: '0.82rem', color: 'var(--txt-muted)' }}>Supports JPG, PNG, WebP</p>
                </>
              )}
            </div>

            <div className="form-actions" style={{ marginTop: '1.25rem' }}>
              <button className="btn btn-primary btn-full" onClick={handleDiagnose} disabled={!image || loading}>
                {loading ? <><Loader2 size={16} className="spin" /> Analyzing...</> : <><Bug size={16} /> Diagnose Disease</>}
              </button>
            </div>

            {error && <div className="error-box" style={{ marginTop: '1rem' }}><AlertTriangle size={14} /> {error}</div>}
          </div>
        </div>

        {/* Results Panel */}
        <div className="card" style={{ animation: 'revealUp 0.4s ease 120ms both' }}>
          <div className="card-header">
            <div className="card-header-icon" style={{ background: 'linear-gradient(135deg, #2D6A4F, #40916C)' }}>
              <Leaf size={16} />
            </div>
            <div>
              <div className="card-title">Diagnosis Result</div>
              <div className="card-subtitle">AI-powered disease analysis</div>
            </div>
          </div>
          <div className="card-body">
            {loading ? (
              <div className="empty-state">
                <div className="empty-icon" style={{ color: 'var(--clr-primary)' }}>
                  <Loader2 size={24} className="spin" />
                </div>
                <p style={{ fontWeight: 600, color: 'var(--clr-primary)' }}>Analyzing your image...</p>
                <p>Our AI is examining the crop for signs of disease.</p>
              </div>
            ) : result ? (
              <div className="diagnosis-result">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
                  <CheckCircle2 size={20} color="var(--clr-primary)" />
                  <span style={{ fontWeight: 700, fontSize: '1.1rem', fontFamily: 'var(--font-head)' }}>
                    {result.disease || 'Analysis Complete'}
                  </span>
                </div>

                {result.severity && (
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Severity</span>
                    <div className={`diagnosis-severity ${result.severity === 'High' ? 'severity-high' : result.severity === 'Medium' ? 'severity-medium' : 'severity-low'}`} style={{ marginTop: 4 }}>
                      {result.severity}
                    </div>
                  </div>
                )}

                {result.description && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--txt-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Analysis</div>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--txt-secondary)' }}>{result.description}</p>
                  </div>
                )}

                {result.treatment && (
                  <div style={{ background: 'var(--clr-primary-subtle)', padding: '1rem', borderRadius: 'var(--r-md)', borderLeft: '3px solid var(--clr-primary)' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--clr-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Treatment</div>
                    <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--txt-secondary)', margin: 0 }}>{result.treatment}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon"><Bug size={24} /></div>
                <p style={{ fontWeight: 600, color: 'var(--txt-primary)' }}>Awaiting Image</p>
                <p>Upload a photo of the affected crop area to get an AI diagnosis.</p>
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
