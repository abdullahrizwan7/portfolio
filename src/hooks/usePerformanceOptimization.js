import { useEffect, useMemo } from 'react';
import { 
  getDeviceCapabilities, 
  shouldDisableHeavyEffects, 
  getOptimizedAnimationVariants,
  getOptimizedFrameRate 
} from '../utils/performanceOptimizer';

export const usePerformanceOptimization = () => {
  const deviceCapabilities = useMemo(() => getDeviceCapabilities(), []);
  const shouldDisableEffects = useMemo(() => shouldDisableHeavyEffects(), []);
  const optimizedFrameRate = useMemo(() => getOptimizedFrameRate(), []);

  // Preload critical resources only on high-performance devices
  useEffect(() => {
    if (deviceCapabilities.isDesktop && !deviceCapabilities.isLowPerformance) {
      // Preload heavy resources
      const preloadScript = document.createElement('link');
      preloadScript.rel = 'preload';
      preloadScript.as = 'script';
      document.head.appendChild(preloadScript);
    }
  }, [deviceCapabilities]);

  return {
    deviceCapabilities,
    shouldDisableEffects,
    optimizedFrameRate,
    getOptimizedVariants: getOptimizedAnimationVariants,
    isMobile: deviceCapabilities.isMobile,
    isTablet: deviceCapabilities.isTablet,
    isDesktop: deviceCapabilities.isDesktop,
    isLowPerformance: deviceCapabilities.isLowPerformance
  };
};

export default usePerformanceOptimization;
