import { useState, useRef } from 'react'
import { Sparkles, X, Volume2, Square, Loader2, Globe } from 'lucide-react'

const LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi (हिंदी)' },
  { value: 'Urdu', label: 'Urdu (اردو)' },
  { value: 'Spanish', label: 'Spanish (Español)' },
  { value: 'French', label: 'French (Français)' },
  { value: 'Bengali', label: 'Bengali (বাংলা)' },
  { value: 'Marathi', label: 'Marathi (मराठी)' },
  { value: 'Tamil', label: 'Tamil (தமிழ்)' },
  { value: 'Telugu', label: 'Telugu (తెలుగు)' },
]

export default function AiModal({ features, prediction, onClose }) {
  const [language, setLanguage] = useState('English')
  const [content, setContent] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [ttsLoading, setTtsLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const audioRef = useRef(new Audio())
  const hasFetched = useRef(false)

  // Auto-fetch on first open
  if (!hasFetched.current) {
    hasFetched.current = true
    fetchExplanation(language)
  }

  async function fetchExplanation(lang) {
    setAiLoading(true); setContent(null)
    try {
      const res = await fetch('/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features, prediction, language: lang })
      })
      const data = await res.json()
      setContent(data.explanation || 'No explanation available.')
    } catch {
      setContent('AI Error: Could not reach explanation service.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleLangChange = (e) => {
    const lang = e.target.value
    setLanguage(lang)
    stopAudio()
    fetchExplanation(lang)
  }

  const stopAudio = () => {
    audioRef.current.pause()
    audioRef.current.currentTime = 0
    setPlaying(false)
  }

  const handleSpeak = async () => {
    if (!content) return
    setTtsLoading(true)
    try {
      const res = await fetch('/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: content, language })
      })
      if (!res.ok) throw new Error('TTS failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      audioRef.current.src = url
      audioRef.current.onended = () => setPlaying(false)
      audioRef.current.play()
      setPlaying(true)
    } catch {
      // silently fail
    } finally {
      setTtsLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <div className="modal-title-icon"><Sparkles size={16} /></div>
            <div>
              <h3>AI Analysis</h3>
              <div style={{ fontSize: '0.73rem', color: 'var(--txt-muted)', marginTop: 1 }}>
                Why <strong style={{ color: 'var(--clr-accent)', textTransform: 'capitalize' }}>{prediction}</strong> is recommended
              </div>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div className="modal-controls">
            <div style={{ position: 'relative', minWidth: 160 }}>
              <span className="input-icon"><Globe size={14} /></span>
              <select
                className="field"
                value={language}
                onChange={handleLangChange}
                style={{ height: 36 }}
              >
                {LANGUAGES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>

            <div className="audio-controls">
              {!playing ? (
                <button
                  className="btn btn-ghost"
                  onClick={handleSpeak}
                  disabled={ttsLoading || !content || aiLoading}
                >
                  {ttsLoading
                    ? <><Loader2 size={13} className="spin" /> Loading…</>
                    : <><Volume2 size={13} /> Listen</>
                  }
                </button>
              ) : (
                <button className="btn btn-danger" onClick={stopAudio}>
                  <Square size={11} /> Stop
                </button>
              )}
            </div>
          </div>

          <div className="ai-content-box">
            {aiLoading
              ? <span className="ai-loading">Analyzing with AI in {language}…</span>
              : content || <span className="ai-loading">Loading…</span>
            }
          </div>
        </div>
      </div>
    </div>
  )
}
