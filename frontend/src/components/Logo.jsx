import React from 'react'
import { Sprout } from 'lucide-react'

export default function Logo({ size = 24, showText = true, fontSize = '1.25rem' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
      <div style={{ 
        width: size * 1.5, 
        height: size * 1.5, 
        borderRadius: size * 0.4,
        background: 'linear-gradient(135deg, var(--clr-primary), #22c55e)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
        color: 'white'
      }}>
        <Sprout size={size} />
      </div>

      {showText && (
        <span style={{ 
          fontSize, 
          fontWeight: 800, 
          letterSpacing: '-0.01em', 
          fontFamily: 'var(--font-head)',
          color: 'var(--txt-main)'
        }}>
          Kishan<span style={{ color: 'var(--clr-primary)' }}>bandhu</span>
        </span>
      )}
    </div>
  )
}
