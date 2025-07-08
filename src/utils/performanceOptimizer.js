// Performance optimization utilities
export const isLowPerformanceDevice = () => {
  // Check for indicators of low-performance devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSlowDevice = navigator.hardwareConcurrency <= 2;
  const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 2;
  const isSlowConnection = navigator.connection && 
    (navigator.connection.effectiveType === 'slow-2g' || 
     navigator.connection.effectiveType === '2g' || 
     navigator.connection.effectiveType === '3g');

  return isMobile || isSlowDevice || hasLowMemory || isSlowConnection;
};

export const getOptimizedParticleCount = (baseCount) => {
  const windowWidth = window.innerWidth;
  const isLowPerf = isLowPerformanceDevice();
  
  if (isLowPerf) return Math.min(baseCount * 0.2, 200);
  if (windowWidth < 768) return Math.min(baseCount * 0.3, 300);
  if (windowWidth < 1200) return Math.min(baseCount * 0.6, 500);
  return baseCount;
};

export const getOptimizedBlur = (baseBlur) => {
  const isLowPerf = isLowPerformanceDevice();
  const windowWidth = window.innerWidth;
  
  if (isLowPerf) return Math.max(baseBlur * 0.3, 4);
  if (windowWidth < 768) return Math.max(baseBlur * 0.5, 6);
  if (windowWidth < 1200) return Math.max(baseBlur * 0.7, 8);
  return baseBlur;
};

export const throttleAnimationFrame = (callback, fps = 60) => {
  let lastTime = 0;
  const interval = 1000 / fps;
  
  return (currentTime) => {
    if (currentTime - lastTime >= interval) {
      callback(currentTime);
      lastTime = currentTime;
    }
  };
};

export const useReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Intersection observer for performance
export const createPerformanceObserver = (callback, options = {}) => {
  const defaultOptions = {
    threshold: 0.1,
    rootMargin: '50px',
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Debounced resize handler
export const createDebouncedResize = (callback, delay = 250) => {
  let timeoutId;
  
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
};
