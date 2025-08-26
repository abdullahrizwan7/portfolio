import { useEffect, useRef, useState } from 'react';
import { createOptimizedIntersectionObserver } from './performanceOptimizer';

// Hook for lazy loading images with performance optimization
export const useLazyImage = (src, options = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(null);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;

    observerRef.current = createOptimizedIntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      options
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isInView || !src) return;

    const img = new Image();
    
    img.onload = () => {
      setIsLoaded(true);
      setError(null);
    };
    
    img.onerror = () => {
      setError(new Error('Failed to load image'));
    };

    img.src = src;
  }, [isInView, src]);

  return { imgRef, isLoaded, isInView, error };
};

// Component for optimized image loading
export const LazyImage = ({ 
  src, 
  alt, 
  placeholder = '', 
  className = '',
  style = {},
  ...props 
}) => {
  const { imgRef, isLoaded, error } = useLazyImage(src);

  if (error) {
    return (
      <div 
        ref={imgRef}
        className={className}
        style={{ 
          backgroundColor: '#f0f0f0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: '#999',
          ...style 
        }}
        {...props}
      >
        Failed to load image
      </div>
    );
  }

  return (
    <div ref={imgRef} className={className} style={style} {...props}>
      {!isLoaded && placeholder && (
        <div style={{ 
          backgroundColor: '#f0f0f0', 
          width: '100%', 
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999'
        }}>
          {placeholder}
        </div>
      )}
      {isLoaded && (
        <img 
          src={src} 
          alt={alt}
          style={{ 
            width: '100%', 
            height: '100%',
            objectFit: 'cover',
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
    </div>
  );
};

// Hook for lazy loading any component
export const useLazyComponent = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;

    const observer = createOptimizedIntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};