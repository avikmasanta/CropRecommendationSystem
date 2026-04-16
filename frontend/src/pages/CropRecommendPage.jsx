import React, { useState, useContext, useEffect } from 'react'
import { Sprout } from 'lucide-react'
import { LangContext } from '../App'
import SoilForm from '../components/SoilForm'
import WeatherPanel from '../components/WeatherPanel'
import ResultsPanel from '../components/ResultsPanel'
import AiModal from '../components/AiModal'
import AlertSystem from '../components/AlertSystem'

export default function CropRecommendPage({ weather, setWeather, autoLocation, models: propModels, autoDetectWeather }) {
  const { t } = useContext(LangContext)
  let user = null
  try { user = JSON.parse(localStorage.getItem('farmcrop_user') || 'null') } catch (e) {}

  const [predictions, setPredictions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lastData, setLastData] = useState(null)
  const [aiOpen, setAiOpen] = useState(false)
  const [models, setModels] = useState(propModels || [])

  useEffect(() => {
    if (!propModels || propModels.length === 0) {
      fetch('/models').then(r => r.json()).then(d => setModels(d.models || [])).catch(() => setModels([]))
    }
  }, [])

  useEffect(() => {
    if (propModels && propModels.length > 0) setModels(propModels)
  }, [propModels])

  const handlePredict = async (formValues) => {
    setLoading(true); setPredictions(null); setLastData(formValues)
    try {
      const fd = new FormData()
      Object.entries(formValues).forEach(([k, v]) => fd.append(k, v))
      const res = await fetch('/predict', { method: 'POST', body: fd })
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setPredictions(json)
    } catch (e) { setPredictions({ error: e.message }) }
    finally { setLoading(false) }
  }

  return (
    <div className="page-content">
      {/* Hero Banner — 3D Landscape Style */}
      <div className="hero-banner" style={{ animation: 'revealUp 0.5s ease', backgroundImage: 'url(/farm-landscape-3d.png)', backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Dark gradient overlay so the text remains readable */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,22,40,0.95) 0%, rgba(10,22,40,0.6) 50%, rgba(10,22,40,0.1) 100%)', zIndex: 1 }}></div>
        
        <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.75rem 2rem' }}>
          <p className="hero-banner-label">SMART CROP INTELLIGENCE</p>
          <h1 className="hero-banner-title">Crop <span>Recommendation</span></h1>
          <p className="hero-banner-text">AI-powered soil analysis and crop recommendations tailored to your land</p>
        </div>
      </div>

      <AlertSystem weather={weather} />

      <div className="dashboard-grid">
        <div>
          {/* Soil Analysis Card */}
          <div className="card">
            <div className="card-header">
              <div className="card-header-icon"><Sprout size={16} /></div>
              <div>
                <div className="card-title">Soil Analysis</div>
                <div className="card-subtitle">Enter field measurements for AI prediction</div>
              </div>
            </div>
            <div className="card-body">
              <SoilForm models={models} weather={weather} onWeatherFetched={setWeather} onSubmit={handlePredict} loading={loading} initialLocation={autoLocation} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <WeatherPanel weather={weather} />
          <ResultsPanel predictions={predictions} loading={loading} onAskAI={() => setAiOpen(true)} />
        </div>
      </div>

      {aiOpen && (
        <AiModal features={lastData} prediction={predictions?.top_prediction} onClose={() => setAiOpen(false)} />
      )}
    </div>
  )
}
