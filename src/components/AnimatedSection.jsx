import React from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '../utils/useScrollAnimation';
import styled from 'styled-components';

const variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const AnimatedSection = ({ children, className, delay = 0, ...props }) => {
  const { ref, controls } = useScrollAnimation(0.1);
  
  return (
    <StyledSection
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={{
        hidden: variants.hidden,
        visible: {
          ...variants.visible,
          transition: { ...variants.visible.transition, delay }
        }
      }}
      className={className}
      {...props}
    >
      {children}
    </StyledSection>
  );
};

const StyledSection = styled(motion.div)`
  width: 100%;
`;

export default AnimatedSection;
