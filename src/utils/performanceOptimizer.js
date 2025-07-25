// Performance detection and optimization utility
export const detectDeviceCapability = () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  return {
    // Hardware detection
    cores: navigator.hardwareConcurrency || 4,
    memory: navigator.deviceMemory || 4,
    hasWebGL: !!gl,
    isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    
    // Performance tier (high/medium/low)
    getTier() {
      if (this.isMobile) return 'low';
      if (this.cores >= 8 && this.memory >= 8) return 'high';
      if (this.cores >= 4 && this.memory >= 4) return 'medium';
      return 'low';
    },
    
    // Effect configurations based on device
    getEffectConfig() {
      const tier = this.getTier();
      
      const configs = {
        high: {
          particleCount: 500,
          animationQuality: 'high',
          blurIntensity: 40,
          frameRate: 60,
          enableAllEffects: true
        },
        medium: {
          particleCount: 250,
          animationQuality: 'medium', 
          blurIntensity: 20,
          frameRate: 30,
          enableAllEffects: true
        },
        low: {
          particleCount: 100,
          animationQuality: 'low',
          blurIntensity: 10,
          frameRate: 30,
          enableAllEffects: false
        }
      };
      
      return configs[tier];
    }
  };
};

// Frame rate monitor
export class FrameRateMonitor {
  constructor() {
    this.fps = 60;
    this.frames = 0;
    this.lastTime = performance.now();
    this.callbacks = [];
  }
  
  start() {
    const measure = (currentTime) => {
      this.frames++;
      
      if (currentTime - this.lastTime >= 1000) {
        this.fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
        this.frames = 0;
        this.lastTime = currentTime;
        
        // Notify subscribers of FPS change
        this.callbacks.forEach(callback => callback(this.fps));
      }
      
      requestAnimationFrame(measure);
    };
    
    requestAnimationFrame(measure);
  }
  
  onFpsChange(callback) {
    this.callbacks.push(callback);
  }
}

// Smart throttling based on performance
export const createSmartThrottle = (func, baseDelay = 16) => {
  let lastTime = 0;
  let adaptiveDelay = baseDelay;
  
  return function(...args) {
    const now = performance.now();
    
    if (now - lastTime >= adaptiveDelay) {
      lastTime = now;
      func.apply(this, args);
    }
  };
};

// Simple function to check if heavy effects should be disabled
export const shouldDisableHeavyEffects = () => {
  const device = detectDeviceCapability();
  return device.getTier() === 'low' || device.isMobile;
};

// Get optimized particle count based on device
export const getOptimizedParticleCount = (baseCount = 500) => {
  const device = detectDeviceCapability();
  const config = device.getEffectConfig();
  return Math.min(baseCount, config.particleCount);
};

// Get optimized frame rate
export const getOptimizedFrameRate = () => {
  const device = detectDeviceCapability();
  const config = device.getEffectConfig();
  return config.frameRate;
};
