import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, useAnimation } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaCodepen } from 'react-icons/fa';
import { HiArrowDown, HiDocumentDownload } from 'react-icons/hi';
import { Link } from 'react-scroll';
import Typewriter from 'typewriter-effect';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
// import { usePerformanceOptimization } from '../hooks/usePerformanceOptimization';
// import { FrameRateMonitor } from '../utils/performanceOptimizer';

// Enhanced responsive breakpoints
const breakpoints = {
    xs: '320px',
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1200px',
    xxl: '1400px'
};

// Simplified animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.9; }
  50% { opacity: 1; }
`;

const liquidMove = keyframes`
  0%, 100% { 
    transform: translateY(0px) translateX(0px);
    border-radius: 50%;
  }
  50% { 
    transform: translateY(-3px) translateX(3px);
    border-radius: 60% 40% 50% 60%;
  }
`;

// Optimized particle system
const ParticleField = React.memo(({ count = 500, deviceType }) => {
    const points = useRef();
    
    // Memoize particle calculations
    const { particleCount, particleSize, particleOpacity } = useMemo(() => {
        let countVal, sizeVal, opacityVal;
        
        if (deviceType === 'mobile') {
            countVal = Math.min(count * 0.2, 150);
            sizeVal = 0.015;
            opacityVal = 0.4;
        } else if (deviceType === 'tablet') {
            countVal = Math.min(count * 0.4, 250);
            sizeVal = 0.025;
            opacityVal = 0.5;
        } else {
            countVal = Math.min(count, 500);
            sizeVal = 0.035;
            opacityVal = 0.6;
        }
        
        return {
            particleCount: countVal,
            particleSize: sizeVal,
            particleOpacity: opacityVal
        };
    }, [deviceType, count]);
    
    const sphere = useMemo(() => {
        return random.inSphere(new Float32Array(particleCount * 3), { radius: 15 });
    }, [particleCount]);

    useFrame((state, delta) => {
        if (points.current) {
            const speed = deviceType === 'mobile' ? 0.05 : deviceType === 'tablet' ? 0.08 : 0.12;
            points.current.rotation.x += delta * speed;
            points.current.rotation.y += delta * (speed * 1.5);
        }
    });

    return (
        <Points ref={points} positions={sphere} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#64ffda"
                size={particleSize}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={particleOpacity}
            />
        </Points>
    );
});

const HomeSection = styled.section`
  min-height: 100vh;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 2rem;
  position: relative;
  background: 
    radial-gradient(ellipse at top, #1a365d 0%, #0a192f 50%, #000000 100%);
  overflow: hidden;
  
  /* Simplified Starfield Background */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.9), transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(100,255,218,0.7), transparent);
    background-repeat: repeat;
    background-size: 400px 200px;
    animation: ${float} 8s ease-in-out infinite alternate;
    pointer-events: none;
  }
  
  /* Simplified Nebula Effects */
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(ellipse at 25% 25%, rgba(100, 255, 218, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 75% 75%, rgba(79, 172, 254, 0.12) 0%, transparent 50%);
    animation: ${float} 20s ease-in-out infinite;
    pointer-events: none;
  }
  
  @media (max-width: ${breakpoints.xxl}) {
    padding: 0 1.5rem;
  }
  
  @media (max-width: ${breakpoints.xl}) {
    padding: 0 1.25rem;
  }
  
  @media (max-width: ${breakpoints.lg}) {
    padding: 0 1rem;
  }
  
  @media (max-width: ${breakpoints.md}) {
    padding: 0 1rem;
  }
  
  @media (max-width: ${breakpoints.sm}) {
    padding: 0 0.75rem;
  }
  
  @media (max-width: ${breakpoints.xs}) {
    padding: 0 0.5rem;
  }
  
  @media (max-height: 600px) and (orientation: landscape) {
    padding: 1rem;
  }
`;

const ParticleBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  
  @media (max-width: ${breakpoints.md}) {
    display: none;
  }
`;

const HomeContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  z-index: 1;
  background: 
    linear-gradient(135deg, 
      rgba(255, 255, 255, 0.12) 0%, 
      rgba(255, 255, 255, 0.06) 50%, 
      rgba(255, 255, 255, 0.10) 100%
    );
  backdrop-filter: blur(25px) saturate(180%);
  -webkit-backdrop-filter: blur(25px) saturate(180%);
  border-radius: 32px;
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.25);
  position: relative;
  overflow: hidden;
  animation: ${float} 8s ease-in-out infinite;
  box-shadow: 
    0 12px 40px rgba(0, 0, 0, 0.4),
    0 4px 20px rgba(0, 0, 0, 0.3),
    0 0 80px rgba(100, 255, 218, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 0 rgba(255, 255, 255, 0.08);
  text-align: center;
  transform: translate3d(0, 0, 0);
  will-change: transform, opacity;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(100, 255, 218, 0.08) 30%,
      rgba(255, 255, 255, 0.08) 60%,
      transparent 100%
    );
    pointer-events: none;
    border-radius: 32px 32px 0 0;
  }
  
  @media (max-width: ${breakpoints.xxl}) {
    max-width: 1100px;
    padding: 2.8rem;
  }
  
  @media (max-width: ${breakpoints.xl}) {
    max-width: 1000px;
    padding: 2.5rem;
    border-radius: 28px;
    backdrop-filter: blur(22px) saturate(170%);
    
    &::before {
      border-radius: 28px 28px 0 0;
    }
  }
  
  @media (max-width: ${breakpoints.lg}) {
    max-width: 95%;
    padding: 2.2rem;
    border-radius: 24px;
    backdrop-filter: blur(18px) saturate(160%);
    
    &::before {
      border-radius: 24px 24px 0 0;
    }
  }
  
  @media (max-width: ${breakpoints.md}) {
    max-width: 90%;
    padding: 2rem;
    border-radius: 20px;
    backdrop-filter: blur(15px) saturate(150%);
    
    &::before {
      border-radius: 20px 20px 0 0;
    }
  }
  
  @media (max-width: ${breakpoints.sm}) {
    max-width: 95%;
    padding: 1.5rem;
    border-radius: 16px;
    backdrop-filter: blur(12px) saturate(140%);
    
    &::before {
      border-radius: 16px 16px 0 0;
    }
  }
  
  @media (max-width: ${breakpoints.xs}) {
    max-width: 100%;
    padding: 1.2rem;
    border-radius: 12px;
    margin: 0 0.5rem;
    backdrop-filter: blur(10px) saturate(130%);
    
    &::before {
      border-radius: 12px 12px 0 0;
    }
  }
  
  @media (max-height: 600px) and (orientation: landscape) {
    padding: 1.5rem;
    max-width: 95%;
  }
`;

const Greeting = styled(motion.h3)`
  color: #64ffda;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 400;
  text-align: center;
`;

const Name = styled(motion.h1)`
  font-size: 4.5rem;
  font-weight: 700;
  color: #e6f1ff;
  margin-bottom: 0.5rem;
  line-height: 1.1;
  text-align: center;
  
  @media (max-width: ${breakpoints.xxl}) {
    font-size: 4.2rem;
  }
  
  @media (max-width: ${breakpoints.xl}) {
    font-size: 4rem;
  }
  
  @media (max-width: ${breakpoints.lg}) {
    font-size: 3.5rem;
    margin-bottom: 0.4rem;
  }
  
  @media (max-width: ${breakpoints.md}) {
    font-size: 3rem;
    margin-bottom: 0.3rem;
  }
  
  @media (max-width: ${breakpoints.sm}) {
    font-size: 2.2rem;
    margin-bottom: 0.25rem;
    line-height: 1.2;
  }
  
  @media (max-width: ${breakpoints.xs}) {
    font-size: 1.8rem;
    margin-bottom: 0.2rem;
  }
  
  @media (max-height: 600px) and (orientation: landscape) {
    font-size: 2rem;
    margin-bottom: 0.2rem;
  }
`;

const TypewriterContainer = styled.div`
  font-size: 3.5rem;
  font-weight: 700;
  color: #8892b0;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  text-align: center;
  
  .Typewriter__cursor {
    color: #64ffda;
  }
  
  @media (max-width: ${breakpoints.xxl}) {
    font-size: 3.2rem;
  }
  
  @media (max-width: ${breakpoints.xl}) {
    font-size: 3rem;
  }
  
  @media (max-width: ${breakpoints.lg}) {
    font-size: 2.8rem;
    margin-bottom: 1.3rem;
  }
  
  @media (max-width: ${breakpoints.md}) {
    font-size: 2.2rem;
    margin-bottom: 1.2rem;
  }
  
  @media (max-width: ${breakpoints.sm}) {
    font-size: 1.6rem;
    margin-bottom: 1rem;
    line-height: 1.2;
  }
  
  @media (max-width: ${breakpoints.xs}) {
    font-size: 1.3rem;
    margin-bottom: 0.8rem;
  }
  
  @media (max-height: 600px) and (orientation: landscape) {
    font-size: 1.5rem;
    margin-bottom: 0.8rem;
  }
`;

const Description = styled(motion.p)`
  max-width: 600px;
  font-size: 1.1rem;
  color: #8892b0;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  
  @media (max-width: ${breakpoints.xxl}) {
    font-size: 1.05rem;
    max-width: 580px;
  }
  
  @media (max-width: ${breakpoints.xl}) {
    font-size: 1rem;
    max-width: 550px;
  }
  
  @media (max-width: ${breakpoints.lg}) {
    font-size: 0.95rem;
    max-width: 500px;
    margin-bottom: 2.2rem;
  }
  
  @media (max-width: ${breakpoints.md}) {
    font-size: 0.9rem;
    max-width: 100%;
    margin-bottom: 2rem;
    line-height: 1.5;
  }
  
  @media (max-width: ${breakpoints.sm}) {
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
  }
  
  @media (max-width: ${breakpoints.xs}) {
    font-size: 0.8rem;
    margin-bottom: 1.2rem;
    line-height: 1.4;
  }
  
  @media (max-height: 600px) and (orientation: landscape) {
    font-size: 0.8rem;
    margin-bottom: 1rem;
    line-height: 1.4;
  }
`;

const ButtonContainer = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: ${breakpoints.lg}) {
    gap: 1.2rem;
  }
  
  @media (max-width: ${breakpoints.md}) {
    gap: 1rem;
    justify-content: center;
  }
  
  @media (max-width: ${breakpoints.sm}) {
    flex-direction: column;
    gap: 0.8rem;
    width: 100%;
  }
  
  @media (max-width: ${breakpoints.xs}) {
    gap: 0.6rem;
  }
  
  @media (max-height: 600px) and (orientation: landscape) {
    flex-direction: row;
    gap: 1rem;
    justify-content: center;
  }
`;

const CTAButton = styled(motion.a)`
  padding: 1.2rem 2.5rem;
  background: 
    linear-gradient(135deg, 
      rgba(100, 255, 218, 0.15) 0%,
      rgba(76, 209, 185, 0.1) 50%,
      rgba(100, 255, 218, 0.15) 100%
    );
  color: #64ffda;
  border: 2px solid rgba(100, 255, 218, 0.4);
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  backdrop-filter: blur(15px) saturate(120%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 8px 25px rgba(100, 255, 218, 0.2),
    0 0 40px rgba(100, 255, 218, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  min-height: 48px;
  will-change: transform, box-shadow;
  
  &:hover {
    background: 
      linear-gradient(135deg, 
        rgba(100, 255, 218, 0.25) 0%,
        rgba(76, 209, 185, 0.18) 50%,
        rgba(100, 255, 218, 0.25) 100%
      );
    border-color: rgba(100, 255, 218, 0.7);
    transform: translateY(-4px) scale(1.02);
    box-shadow: 
      0 15px 35px rgba(100, 255, 218, 0.35),
      0 0 60px rgba(100, 255, 218, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
  
  &:active {
    transform: translateY(-2px) scale(0.98);
  }
  
  @media (max-width: ${breakpoints.xl}) {
    padding: 1.1rem 2.2rem;
    font-size: 1.05rem;
  }
  
  @media (max-width: ${breakpoints.lg}) {
    padding: 1rem 2rem;
    font-size: 1rem;
    border-radius: 14px;
  }
  
  @media (max-width: ${breakpoints.md}) {
    padding: 0.9rem 1.8rem;
    font-size: 0.95rem;
    border-radius: 12px;
    width: auto;
    min-width: 140px;
  }
  
  @media (max-width: ${breakpoints.sm}) {
    padding: 0.8rem 1.5rem;
    font-size: 0.9rem;
    width: 100%;
    border-radius: 10px;
  }
  
  @media (max-width: ${breakpoints.xs}) {
    padding: 0.7rem 1.2rem;
    font-size: 0.85rem;
    border-radius: 8px;
  }
  
  @media (hover: none) and (pointer: coarse) {
    min-height: 44px;
    padding: 0.8rem 1.5rem;
    
    &:hover {
      transform: none;
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
  
  @media (max-height: 600px) and (orientation: landscape) {
    padding: 0.6rem 1.2rem;
    font-size: 0.8rem;
    min-height: 40px;
  }
`;

const SecondaryButton = styled(CTAButton)`
  background: 
    linear-gradient(135deg, 
      rgba(230, 241, 255, 0.08) 0%, 
      rgba(136, 146, 176, 0.05) 50%,
      rgba(230, 241, 255, 0.08) 100%
    );
  color: #e6f1ff;
  border-color: rgba(136, 146, 176, 0.4);
  box-shadow: 
    0 8px 25px rgba(136, 146, 176, 0.15),
    0 0 40px rgba(136, 146, 176, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  
  &:hover {
    background: 
      linear-gradient(135deg, 
        rgba(230, 241, 255, 0.15) 0%, 
        rgba(136, 146, 176, 0.1) 50%,
        rgba(230, 241, 255, 0.15) 100%
      );
    border-color: rgba(230, 241, 255, 0.7);
    color: #ffffff;
    box-shadow: 
      0 15px 35px rgba(230, 241, 255, 0.25),
      0 0 60px rgba(230, 241, 255, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
`;

const SocialLinks = styled(motion.div)`
  display: flex;
  gap: 1.5rem;
  margin-top: 3rem;
  flex-wrap: wrap;
  justify-content: center;
  
  @media (max-width: ${breakpoints.xl}) {
    gap: 1.3rem;
    margin-top: 2.5rem;
  }
  
  @media (max-width: ${breakpoints.lg}) {
    gap: 1.2rem;
    margin-top: 2.2rem;
  }
  
  @media (max-width: ${breakpoints.md}) {
    gap: 1rem;
    margin-top: 2rem;
    justify-content: center;
  }
  
  @media (max-width: ${breakpoints.sm}) {
    gap: 0.8rem;
    margin-top: 1.5rem;
    justify-content: center;
  }
  
  @media (max-width: ${breakpoints.xs}) {
    gap: 0.6rem;
    margin-top: 1.2rem;
  }
  
  @media (max-height: 600px) and (orientation: landscape) {
    margin-top: 1rem;
    gap: 0.8rem;
  }
`;

const SocialIcon = styled(motion.a)`
  color: #8892b0;
  font-size: 1.5rem;
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
  background: 
    linear-gradient(135deg, 
      rgba(10, 25, 47, 0.85) 0%, 
      rgba(17, 34, 64, 0.8) 100%
    );
  backdrop-filter: blur(15px) saturate(120%);
  padding: 1rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(100, 255, 218, 0.25);
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.2),
    0 0 30px rgba(100, 255, 218, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  position: relative;
  overflow: hidden;
  min-width: 48px;
  min-height: 48px;
  will-change: transform;
  
  &:hover {
    color: #64ffda;
    transform: translateY(-4px) scale(1.1);
    border-color: rgba(100, 255, 218, 0.6);
    box-shadow: 
      0 15px 30px rgba(100, 255, 218, 0.3),
      0 0 50px rgba(100, 255, 218, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
  
  &:active {
    transform: translateY(-2px) scale(1.05);
  }
  
  @media (max-width: ${breakpoints.xl}) {
    padding: 0.9rem;
    font-size: 1.4rem;
    min-width: 46px;
    min-height: 46px;
  }
  
  @media (max-width: ${breakpoints.lg}) {
    padding: 0.8rem;
    font-size: 1.3rem;
    min-width: 44px;
    min-height: 44px;
  }
  
  @media (max-width: ${breakpoints.md}) {
    padding: 0.7rem;
    font-size: 1.2rem;
    min-width: 42px;
    min-height: 42px;
  }
  
  @media (max-width: ${breakpoints.sm}) {
    padding: 0.6rem;
    font-size: 1.1rem;
    min-width: 40px;
    min-height: 40px;
  }
  
  @media (max-width: ${breakpoints.xs}) {
    padding: 0.5rem;
    font-size: 1rem;
    min-width: 36px;
    min-height: 36px;
  }
  
  @media (hover: none) and (pointer: coarse) {
    min-width: 44px;
    min-height: 44px;
    
    &:hover {
      transform: none;
    }
    
    &:active {
      transform: scale(0.95);
      color: #64ffda;
      border-color: rgba(100, 255, 218, 0.6);
    }
  }
  
  @media (max-height: 600px) and (orientation: landscape) {
    padding: 0.4rem;
    font-size: 1rem;
    min-width: 36px;
    min-height: 36px;
  }
`;

const ScrollDown = styled(motion.div)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #64ffda;
  cursor: pointer;
  z-index: 10;
  animation: ${pulse} 2s infinite;
  
  p {
    font-size: 0.8rem;
    font-weight: 400;
  }
  
  svg {
    font-size: 1.2rem;
  }
  
  @media (max-width: ${breakpoints.sm}) {
    bottom: 1.5rem;
  }
`;

const LiquidBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  
  @media (max-width: ${breakpoints.md}) {
    display: none;
  }
`;

const LiquidOrb = styled(motion.div)`
  position: absolute;
  background: 
    radial-gradient(circle at 30% 30%, 
      rgba(100, 255, 218, 0.18) 0%, 
      rgba(76, 209, 185, 0.12) 30%,
      rgba(79, 172, 254, 0.08) 60%,
      transparent 100%
    );
  backdrop-filter: blur(30px) saturate(180%);
  border-radius: 50%;
  animation: ${liquidMove} 20s ease-in-out infinite;
  box-shadow: 
    0 0 80px rgba(100, 255, 218, 0.2),
    0 0 160px rgba(100, 255, 218, 0.12),
    inset 0 0 60px rgba(100, 255, 218, 0.08);
  border: 1px solid rgba(100, 255, 218, 0.1);
  will-change: transform;
  
  &.orb1 {
    width: 350px;
    height: 350px;
    top: 8%;
    right: 8%;
    animation-delay: 0s;
  }
  
  &.orb2 {
    width: 250px;
    height: 250px;
    bottom: 12%;
    left: 3%;
    animation-delay: -7s;
  }
  
  &.orb3 {
    width: 180px;
    height: 180px;
    top: 55%;
    right: 35%;
    animation-delay: -14s;
  }
  
  @media (max-width: ${breakpoints.xl}) {
    &.orb1 { width: 300px; height: 300px; }
    &.orb2 { width: 220px; height: 220px; }
    &.orb3 { width: 160px; height: 160px; }
  }
  
  @media (max-width: ${breakpoints.lg}) {
    &.orb1 { width: 250px; height: 250px; }
    &.orb2 { width: 180px; height: 180px; }
    &.orb3 { width: 120px; height: 120px; }
  }
`;

const AvailabilityBadge = styled(motion.div)`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: rgba(100, 255, 218, 0.1);
  border: 1px solid rgba(100, 255, 218, 0.3);
  color: #64ffda;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  z-index: 10;
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: #64ffda;
    border-radius: 50%;
    animation: ${pulse} 2s infinite;
  }
  
  @media (max-width: ${breakpoints.xl}) {
    top: 1.8rem;
    right: 1.8rem;
    font-size: 0.85rem;
  }
  
  @media (max-width: ${breakpoints.lg}) {
    top: 1.5rem;
    right: 1.5rem;
    font-size: 0.8rem;
    padding: 0.45rem 0.9rem;
  }
  
  @media (max-width: ${breakpoints.md}) {
    top: 1.2rem;
    right: 1.2rem;
    font-size: 0.75rem;
    padding: 0.4rem 0.8rem;
    border-radius: 16px;
  }
  
  @media (max-width: ${breakpoints.sm}) {
    top: 1rem;
    right: 1rem;
    font-size: 0.7rem;
    padding: 0.35rem 0.7rem;
    border-radius: 14px;
    
    &::before {
      width: 6px;
      height: 6px;
    }
  }
  
  @media (max-width: ${breakpoints.xs}) {
    top: 0.8rem;
    right: 0.8rem;
    font-size: 0.65rem;
    padding: 0.3rem 0.6rem;
    border-radius: 12px;
    
    &::before {
      width: 5px;
      height: 5px;
    }
  }
  
  @media (max-height: 600px) and (orientation: landscape) {
    top: 0.5rem;
    right: 0.5rem;
    font-size: 0.6rem;
    padding: 0.25rem 0.5rem;
  }
`;

const MemoizedTypewriter = React.memo(() => (
  <TypewriterContainer>
    <Typewriter
      options={{
        strings: [
          'I build things for the web.',
          'I create digital experiences.',
          'I love clean code.',
          'I design with purpose.'
        ],
        autoStart: true,
        loop: true,
        delay: 75,
        deleteSpeed: 50
      }}
    />
  </TypewriterContainer>
));

const Home = () => {
    const controls = useAnimation();
    const [deviceType, setDeviceType] = useState('desktop');
    const [showOrbs, setShowOrbs] = useState(true);

    useEffect(() => {
        const checkDevice = () => {
            const width = window.innerWidth;
            if (width < 768) {
                setDeviceType('mobile');
                setShowOrbs(false);
            } else if (width < 1024) {
                setDeviceType('tablet');
                setShowOrbs(true);
            } else {
                setDeviceType('desktop');
                setShowOrbs(true);
            }
        };
        
        checkDevice();
        window.addEventListener('resize', checkDevice);
        
        controls.start({
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: 'easeOut' }
        });
        
        return () => window.removeEventListener('resize', checkDevice);
    }, [controls]);

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: 'easeOut',
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { 
                duration: 0.6, 
                ease: [0.16, 1, 0.3, 1] // Smoother easing curve
            }
        }
    };

    return (
        <HomeSection id="home">
            <ParticleBackground>
                <Canvas 
                    camera={{ position: [0, 0, 1], fov: 75 }}
                    performance={{ min: 0.5 }}
                >
                    <ParticleField count={500} deviceType={deviceType} />
                </Canvas>
            </ParticleBackground>

            {showOrbs && (
                <LiquidBackground>
                    <LiquidOrb className="orb1" />
                    <LiquidOrb className="orb2" />
                    <LiquidOrb className="orb3" />
                </LiquidBackground>
            )}

            <AvailabilityBadge
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.5, duration: 0.5 }}
            >
                Available for hire
            </AvailabilityBadge>

            <HomeContainer
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                style={{ textAlign: 'center' }}
            >
                <Greeting variants={itemVariants}>
                    Hi, my name is
                </Greeting>
                
                <Name variants={itemVariants}>
                    Abdullah Rizwan
                </Name>
                
                <MemoizedTypewriter />
                
                <Description variants={itemVariants}>
                    I'm a passionate Computer Science student and an enthusiastic developer in the making. 
                    While I'm still learning the ropes academically,I actively apply my skills by building real-world projects that blend creativity with code.
                </Description>
                
                <ButtonContainer variants={itemVariants}>
                    <CTAButton
                        as={Link}
                        to="contact"
                        smooth={true}
                        duration={500}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span>Get In Touch</span>
                    </CTAButton>
                    
                    <SecondaryButton
                        href="./resume.pdf"
                        target="_blank"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <HiDocumentDownload />
                        <span>Resume</span>
                    </SecondaryButton>
                </ButtonContainer>
                
                <SocialLinks variants={itemVariants}>
                    <SocialIcon 
                        href="https://github.com/abdullahrizwan7" 
                        target="_blank"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaGithub />
                    </SocialIcon>
                    <SocialIcon 
                        href="https://linkedin.com/in/yourusername" 
                        target="_blank"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaLinkedin />
                    </SocialIcon>
                    <SocialIcon 
                        href="https://twitter.com/yourusername" 
                        target="_blank"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaTwitter />
                    </SocialIcon>
                    <SocialIcon 
                        href="https://codepen.io/yourusername" 
                        target="_blank"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <FaCodepen />
                    </SocialIcon>
                </SocialLinks>
            </HomeContainer>

            <Link to="about" smooth={true} duration={500}>
                <ScrollDown
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2, duration: 0.5 }}
                >
                    <p>Scroll down</p>
                    <HiArrowDown />
                </ScrollDown>
            </Link>
        </HomeSection>
    );
};

export default React.memo(Home);