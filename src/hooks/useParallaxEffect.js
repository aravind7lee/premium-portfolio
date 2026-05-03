// src/hooks/useParallaxEffect.js
import { useRef, useEffect, useState } from 'react';

/**
 * useParallaxEffect Hook
 * 
 * Creates a parallax effect where elements move based on mouse position
 * Premium interaction for cards and images
 * 
 * @param {number} intensity - Movement intensity (default 20)
 * @param {boolean} rotate - Enable rotation effect (default true)
 */
export default function useParallaxEffect(intensity = 20, rotate = true) {
  const ref = useRef(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, rotateX: 0, rotateY: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let animationFrameId = null;
    let currentTransform = { x: 0, y: 0, rotateX: 0, rotateY: 0 };
    let targetTransform = { x: 0, y: 0, rotateX: 0, rotateY: 0 };

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate mouse position relative to element center (-1 to 1)
      const mouseX = (e.clientX - centerX) / (rect.width / 2);
      const mouseY = (e.clientY - centerY) / (rect.height / 2);

      // Calculate target transform
      targetTransform = {
        x: mouseX * intensity,
        y: mouseY * intensity,
        rotateX: rotate ? -mouseY * 10 : 0,
        rotateY: rotate ? mouseX * 10 : 0,
      };
    };

    const handleMouseLeave = () => {
      targetTransform = { x: 0, y: 0, rotateX: 0, rotateY: 0 };
    };

    const animate = () => {
      // Smooth interpolation
      currentTransform.x += (targetTransform.x - currentTransform.x) * 0.1;
      currentTransform.y += (targetTransform.y - currentTransform.y) * 0.1;
      currentTransform.rotateX += (targetTransform.rotateX - currentTransform.rotateX) * 0.1;
      currentTransform.rotateY += (targetTransform.rotateY - currentTransform.rotateY) * 0.1;

      setTransform({ ...currentTransform });

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
  }, [intensity, rotate]);

  return [ref, transform];
}
