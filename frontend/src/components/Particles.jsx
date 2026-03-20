import { useEffect, useRef } from 'react'

const COLORS = ['rgba(34,197,94,0.5)', 'rgba(86,239,196,0.4)', 'rgba(56,189,248,0.35)', 'rgba(167,243,208,0.4)']

export default function Particles() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    const particles = []
    const count = 22

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div')
      el.className = 'particle'
      const size = Math.random() * 6 + 3
      const color = COLORS[Math.floor(Math.random() * COLORS.length)]
      el.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${Math.random() * 100}%;
        background: ${color};
        animation-duration: ${Math.random() * 14 + 10}s;
        animation-delay: ${Math.random() * 8}s;
        filter: blur(${Math.random() > 0.5 ? '1px' : '0px'});
      `
      container.appendChild(el)
      particles.push(el)
    }

    return () => { particles.forEach(p => p.remove()) }
  }, [])

  return <div className="particles-container" ref={containerRef} />
}
