import React, { useEffect, useRef } from 'react';
import { shouldDisableHeavyEffects, getOptimizedFrameRate } from '../utils/performanceOptimizer';

const GradientBackground = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    
    // Skip heavy effects on mobile
    if (shouldDisableHeavyEffects()) {
      // Static gradient for mobile
      const gradient = ctx.createLinearGradient(0, 0, window.innerWidth, window.innerHeight);
      gradient.addColorStop(0, `hsl(220, 80%, 20%)`);
      gradient.addColorStop(0.5, `hsl(280, 80%, 40%)`);
      gradient.addColorStop(1, `hsl(340, 80%, 20%)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      return;
    }
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Gradient parameters
    const gradientSpeed = 0.002;
    let hue = 0;
    let lastTime = 0;
    const targetFPS = getOptimizedFrameRate();
    const interval = 1000 / targetFPS;
    
    // Animation function
    const animate = (currentTime) => {
      animationFrameId = requestAnimationFrame(animate);
      
      if (currentTime - lastTime < interval) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      
      // Add color stops with shifting hues
      gradient.addColorStop(0, `hsl(${hue}, 80%, 20%)`);
      gradient.addColorStop(0.5, `hsl(${hue + 60}, 80%, 40%)`);
      gradient.addColorStop(1, `hsl(${hue + 120}, 80%, 20%)`);
      
      // Fill background
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update hue for next frame
      hue = (hue + gradientSpeed) % 360;
      lastTime = currentTime;
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1
      }}
    />
  );
};

export default GradientBackground;