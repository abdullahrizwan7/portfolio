import { useState, useEffect, useCallback } from 'react';
import { detectDeviceCapability, FrameRateMonitor, createSmartThrottle } from '../utils/performanceOptimizer';

export const usePerformanceOptimization = () => {
  const [deviceCapability] = useState(() => detectDeviceCapability());
  const [performanceConfig, setPerformanceConfig] = useState(() => deviceCapability.getEffectConfig());
  const [isOptimizing, setIsOptimizing] = useState(false);

  useEffect(() => {
    const frameMonitor = new FrameRateMonitor();
    frameMonitor.start();

    frameMonitor.onFpsChange((fps) => {
      if (fps < 25) {
        // Performance is poor, reduce effects
        setIsOptimizing(true);
        setPerformanceConfig(prev => ({
          ...prev,
          particleCount: Math.max(prev.particleCount * 0.7, 50),
          blurIntensity: Math.max(prev.blurIntensity * 0.5, 5),
          frameRate: 30
        }));
      } else if (fps > 50 && isOptimizing) {
        // Performance recovered, gradually restore effects
        setIsOptimizing(false);
        const originalConfig = deviceCapability.getEffectConfig();
        setPerformanceConfig(prev => ({
          ...prev,
          particleCount: Math.min(prev.particleCount * 1.2, originalConfig.particleCount),
          blurIntensity: Math.min(prev.blurIntensity * 1.5, originalConfig.blurIntensity)
        }));
      }
    });

    return () => {
      // Cleanup if needed
    };
  }, [isOptimizing, deviceCapability]);

  // Smart throttled scroll handler
  const createOptimizedScrollHandler = useCallback((handler) => {
    const throttleDelay = performanceConfig.frameRate === 60 ? 16 : 33;
    return createSmartThrottle(handler, throttleDelay);
  }, [performanceConfig.frameRate]);

  // Optimized animation props based on performance
  const getAnimationProps = useCallback((baseProps = {}) => {
    const optimizedProps = {
      ...baseProps,
      transition: {
        ...baseProps.transition,
        duration: performanceConfig.animationQuality === 'low' ? 
          (baseProps.transition?.duration || 0.3) * 0.7 : 
          baseProps.transition?.duration || 0.3
      }
    };

    if (performanceConfig.animationQuality === 'low') {
      // Reduce complex animations on low-end devices
      delete optimizedProps.whileHover;
      delete optimizedProps.whileTap;
    }

    return optimizedProps;
  }, [performanceConfig.animationQuality]);

  // CSS filter optimization
  const getOptimizedBlur = useCallback((baseBlur) => {
    return Math.min(baseBlur, performanceConfig.blurIntensity);
  }, [performanceConfig.blurIntensity]);

  return {
    deviceCapability,
    performanceConfig,
    isOptimizing,
    createOptimizedScrollHandler,
    getAnimationProps,
    getOptimizedBlur,
    
    // Quick checks
    shouldShowParticles: performanceConfig.enableAllEffects || !deviceCapability.isMobile,
    shouldUseReducedMotion: performanceConfig.animationQuality === 'low',
    optimalFrameRate: performanceConfig.frameRate
  };
};
