// Performance optimization utilities
let deviceCapabilities = null;

export const getDeviceCapabilities = () => {
  if (deviceCapabilities) return deviceCapabilities;
  
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
  const isSlowDevice = navigator.hardwareConcurrency <= 2;
  const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory <= 2;
  const isSlowConnection = navigator.connection && 
    (navigator.connection.effectiveType === 'slow-2g' || 
     navigator.connection.effectiveType === '2g' || 
     navigator.connection.effectiveType === '3g');

  // Check WebGL capability
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  const hasWebGL = !!gl;
  
  deviceCapabilities = {
    isMobile,
    isTablet,
    isDesktop: !isMobile && !isTablet,
    isSlowDevice,
    hasLowMemory,
    isSlowConnection,
    hasWebGL,
    isLowPerformance: isMobile || isSlowDevice || hasLowMemory || isSlowConnection
  };
  
  return deviceCapabilities;
};

export const isLowPerformanceDevice = () => {
  return getDeviceCapabilities().isLowPerformance;
};

export const getOptimizedParticleCount = (baseCount) => {
  const windowWidth = window.innerWidth;
  const { isMobile, isTablet, hasLowMemory, isSlowDevice } = getDeviceCapabilities();
  
  // Aggressive reduction for mobile devices
  if (isMobile) return Math.min(baseCount * 0.1, 50);
  if (isTablet) return Math.min(baseCount * 0.2, 100);
  if (hasLowMemory || isSlowDevice) return Math.min(baseCount * 0.3, 200);
  
  // Screen size based optimization
  if (windowWidth < 768) return Math.min(baseCount * 0.3, 150);
  if (windowWidth < 1200) return Math.min(baseCount * 0.6, 300);
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

// Adaptive frame rate for mobile
export const getOptimizedFrameRate = () => {
  const { isMobile, isTablet, hasLowMemory } = getDeviceCapabilities();
  
  if (isMobile) return 30;
  if (isTablet || hasLowMemory) return 45;
  return 60;
};

// Disable heavy effects for mobile
export const shouldDisableHeavyEffects = () => {
  const { isMobile, hasLowMemory, isSlowDevice } = getDeviceCapabilities();
  return isMobile || hasLowMemory || isSlowDevice;
};

// Simplified animation variants for mobile
export const getOptimizedAnimationVariants = (variants) => {
  const { isMobile } = getDeviceCapabilities();
  
  if (!isMobile) return variants;
  
  // Simplify animations for mobile
  return Object.keys(variants).reduce((acc, key) => {
    const variant = variants[key];
    acc[key] = {
      ...variant,
      transition: {
        ...variant.transition,
        duration: Math.min(variant.transition?.duration || 0.5, 0.3),
        type: 'tween'
      }
    };
    return acc;
  }, {});
};
