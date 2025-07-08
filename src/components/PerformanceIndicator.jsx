import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { FaInfoCircle, FaTimes } from 'react-icons/fa';
import { usePerformanceOptimization } from '../hooks/usePerformanceOptimization';

const IndicatorContainer = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 300px;
  font-size: 14px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 4px;
  margin-left: auto;
  opacity: 0.7;
  transition: opacity 0.2s;
  
  &:hover {
    opacity: 1;
  }
`;

const StatusBadge = styled.span`
  background: ${props => props.mode === 'optimized' ? '#4CAF50' : '#FF9800'};
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  margin-left: 8px;
`;

const PerformanceIndicator = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const { shouldDisableEffects, deviceCapabilities } = usePerformanceOptimization();

  useEffect(() => {
    // Show indicator once if optimizations are active
    if (shouldDisableEffects && !hasShown) {
      setIsVisible(true);
      setHasShown(true);
      
      // Auto-hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }
  }, [shouldDisableEffects, hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <IndicatorContainer
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <FaInfoCircle />
          <span>
            Performance mode active for better experience
            {deviceCapabilities.isMobile && ' on mobile'}
          </span>
          <StatusBadge mode="optimized">OPTIMIZED</StatusBadge>
          <CloseButton onClick={handleClose}>
            <FaTimes />
          </CloseButton>
        </IndicatorContainer>
      )}
    </AnimatePresence>
  );
};

export default PerformanceIndicator;
