import React from 'react'
import { Sprout } from 'lucide-react'

export default function Logo({ size = 22, showText = true, fontSize = '1.2rem' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }}>
      <div style={{ 
        width: size * 1.6, 
        height: size * 1.6, 
        borderRadius: size * 0.35,
        background: 'var(--clr-primary)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: 'white'
      }}>
        <Sprout size={size} />
      </div>

      {showText && (
        <span style={{ 
          fontSize, 
          fontWeight: 700, 
          letterSpacing: '-0.01em', 
          fontFamily: 'var(--font-head)',
          color: 'var(--txt-primary)'
        }}>
          Kishan<span style={{ color: 'var(--clr-primary)' }}>bandhu</span>
        </span>
      )}
    </div>
  )
}
