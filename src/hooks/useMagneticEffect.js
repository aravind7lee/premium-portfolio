// src/hooks/useMagneticEffect.js
import { useRef, useEffect } from 'react';

/**
 * useMagneticEffect Hook
 * 
 * Creates a magnetic cursor effect where elements follow the cursor
 * Premium interaction used by Apple, Stripe, and other top-tier sites
 * 
 * @param {number} strength - Magnetic strength (0-1, default 0.3)
 * @param {number} tolerance - Distance threshold in pixels (default 100)
 */
export default function useMagneticEffect(strength = 0.3, tolerance = 100) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let animationFrameId = null;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

      if (distance < tolerance) {
        // Apply magnetic effect
        targetX = deltaX * strength;
        targetY = deltaY * strength;
      } else {
        // Reset position
        targetX = 0;
        targetY = 0;
      }
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    const animate = () => {
      // Smooth interpolation
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;

      element.style.transform = `translate(${currentX}px, ${currentY}px)`;

      animationFrameId = requestAnimationFrame(animate);
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);
    animate();

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [strength, tolerance]);

  return ref;
}
