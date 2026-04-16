import { useEffect, useRef, useState, useCallback } from 'react';

// ─── Scroll Reveal Hook ─────────────────────────────────────
// Adds 'visible' class when element enters viewport
export function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible');
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  
  return ref;
}

// ─── 3D Tilt Hook ───────────────────────────────────────────
// Creates a smooth 3D perspective tilt on mouse hover
export function use3DTilt(intensity = 8) {
  const ref = useRef(null);
  
  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;
    
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  }, [intensity]);
  
  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  }, []);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    el.style.transition = 'transform 0.15s ease-out';
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);
  
  return ref;
}

// ─── Animated Counter Hook ──────────────────────────────────
// Smoothly counts up a number for stat displays
export function useAnimatedCounter(target, duration = 1500) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.5 }
    );
    
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);
  
  useEffect(() => {
    if (!hasStarted || !target) return;
    
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [hasStarted, target, duration]);
  
  return { ref, count };
}

// ─── Floating Orbs Component ────────────────────────────────
export function FloatingOrbs() {
  return (
    <div className="floating-orbs">
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>
    </div>
  );
}
