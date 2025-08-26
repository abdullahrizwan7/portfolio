import { useEffect, useState } from 'react';
import { MemoryMonitor } from '../utils/performanceOptimizer';

export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    fcp: 0, // First Contentful Paint
    lcp: 0, // Largest Contentful Paint
    fid: 0, // First Input Delay
    cls: 0, // Cumulative Layout Shift
    memoryUsage: null
  });

  useEffect(() => {
    const memoryMonitor = new MemoryMonitor();

    // Measure load time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    
    // Update initial metrics
    setMetrics(prev => ({
      ...prev,
      loadTime,
      memoryUsage: memoryMonitor.getMemoryUsage()
    }));

    // Observe performance metrics
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        switch (entry.entryType) {
          case 'paint':
            if (entry.name === 'first-contentful-paint') {
              setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
            }
            break;
          case 'largest-contentful-paint':
            setMetrics(prev => ({ ...prev, lcp: entry.startTime }));
            break;
          case 'first-input':
            setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }));
            break;
          case 'layout-shift':
            if (!entry.hadRecentInput) {
              setMetrics(prev => ({ ...prev, cls: prev.cls + entry.value }));
            }
            break;
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'first-input', 'layout-shift'] });
    } catch (e) {
      console.warn('Performance Observer not supported');
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return metrics;
};