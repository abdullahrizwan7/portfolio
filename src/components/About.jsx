import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeIn, textVariant } from '../animations';
import { FaCode, FaServer, FaDatabase, FaTools, FaMobileAlt, FaCloud, FaGraduationCap, FaBriefcase, FaUser, FaRocket, FaAward, FaTrophy, FaProjectDiagram, FaStar } from 'react-icons/fa';
import { usePerformanceOptimization } from '../hooks/usePerformanceOptimization';

// Keyframes for animations
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const drift = keyframes`
  0% { transform: translateX(-100px) translateY(0px); }
  100% { transform: translateX(calc(100vw + 100px)) translateY(-100px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
`;

const shootingStar = keyframes`
  0% {
    transform: translateX(-100vw) translateY(100vh) rotate(-45deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateX(100vw) translateY(-100vh) rotate(-45deg);
    opacity: 0;
  }
`;

const glitch = keyframes`
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
`;

const typewriter = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const blink = keyframes`
  0%, 50% { border-color: transparent; }
  51%, 100% { border-color: #64ffda; }
`;

const countUp = keyframes`
  from { transform: translateY(100px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

const progressFill = keyframes`
  0% { width: 0%; }
  100% { width: var(--progress); }
`;

const AboutSection = styled.section`
  padding: 3rem 1rem;
  background: 
    radial-gradient(ellipse at top, #1a365d 0%, #0a192f 50%, #000000 100%),
    linear-gradient(135deg, #0a192f 0%, #1a202c 50%, #2d3748 100%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  
  /* Starfield Background */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.8), transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(100,255,218,0.6), transparent),
      radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,0.9), transparent),
      radial-gradient(1px 1px at 130px 80px, rgba(100,255,218,0.4), transparent),
      radial-gradient(2px 2px at 160px 30px, rgba(255,255,255,0.6), transparent),
      radial-gradient(1px 1px at 200px 90px, rgba(100,255,218,0.8), transparent),
      radial-gradient(2px 2px at 240px 50px, rgba(255,255,255,0.7), transparent),
      radial-gradient(1px 1px at 280px 10px, rgba(100,255,218,0.5), transparent),
      radial-gradient(1px 1px at 320px 120px, rgba(255,255,255,0.4), transparent),
      radial-gradient(2px 2px at 360px 60px, rgba(100,255,218,0.7), transparent);
    background-repeat: repeat;
    background-size: 400px 200px;
    animation: ${twinkle} 4s ease-in-out infinite alternate;
    pointer-events: none;
  }
  
  /* Nebula Effects */
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(ellipse at 25% 25%, rgba(100, 255, 218, 0.1) 0%, transparent 50%),
      radial-gradient(ellipse at 75% 75%, rgba(79, 172, 254, 0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 10%, rgba(147, 51, 234, 0.06) 0%, transparent 40%);
    animation: ${float} 20s ease-in-out infinite;
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    min-height: auto;
    
    &::before {
      background-size: 300px 150px;
    }
  }
`;

// Floating particles
const ParticleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
`;

const Particle = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  background: ${props => props.color};
  border-radius: 50%;
  animation: ${drift} ${props => props.duration}s linear infinite;
  animation-delay: ${props => props.delay}s;
  opacity: 0.6;
  box-shadow: 0 0 10px ${props => props.color};
  
  &:nth-child(odd) {
    animation: ${pulse} 2s ease-in-out infinite alternate;
  }
`;

const FloatingElement = styled(motion.div)`
  position: absolute;
  color: rgba(100, 255, 218, 0.1);
  font-size: ${props => props.size || '20px'};
  animation: ${float} ${props => props.duration || '6s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  pointer-events: none;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Shooting Star Component
const ShootingStar = styled.div`
  position: absolute;
  width: 2px;
  height: 2px;
  background: linear-gradient(45deg, #fff, #64ffda);
  border-radius: 50%;
  box-shadow: 0 0 10px #64ffda, 0 0 20px #64ffda, 0 0 40px #64ffda;
  animation: ${shootingStar} ${props => props.duration || '3s'} linear infinite;
  animation-delay: ${props => props.delay || '0s'};
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100px;
    height: 1px;
    background: linear-gradient(90deg, #64ffda, transparent);
    transform: translateX(-100px) rotate(-45deg);
    transform-origin: right;
  }
`;

// Mouse Trail
const CursorTrail = styled.div`
  position: fixed;
  width: 6px;
  height: 6px;
  background: #64ffda;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  box-shadow: 0 0 10px #64ffda;
  transition: all 0.1s ease;
  mix-blend-mode: difference;
  
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    width: 16px;
    height: 16px;
    border: 1px solid rgba(100, 255, 218, 0.3);
    border-radius: 50%;
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

// Typewriter Effect
const TypewriterContainer = styled.div`
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid #64ffda;
  animation: ${typewriter} 2s steps(8) 1s both, ${blink} 1s step-end infinite;
  
  &.typing-done {
    border-right: none;
    animation: none;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 300px;
    gap: 3rem;
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: 1fr 350px;
    gap: 4rem;
  }
`;

const Content = styled(motion.div)`
  color: #e6f1ff;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(40px) saturate(180%);
  -webkit-backdrop-filter: blur(40px) saturate(180%);
  border-radius: 24px;
  padding: 2rem;
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 2px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  
  /* Apple-style glass reflection */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 100%
    );
    pointer-events: none;
  }
  
  /* Shimmer effect on hover */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.6s ease;
    pointer-events: none;
  }
  
  &:hover::after {
    left: 100%;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    backdrop-filter: blur(20px) saturate(150%);
    border-radius: 20px;
  }
`;

const Title = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  color: #e6f1ff;
  margin-bottom: 1rem;
  position: relative;
  text-shadow: 0 0 20px rgba(100, 255, 218, 0.5);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #64ffda, #4facfe);
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(100, 255, 218, 0.6);
    animation: ${pulse} 2s ease-in-out infinite;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #64ffda;
  margin-bottom: 1.5rem;
  font-weight: 500;
  text-shadow: 0 0 15px rgba(100, 255, 218, 0.4);
  background: linear-gradient(45deg, #64ffda, #4facfe);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Description = styled.p`
  font-size: 1.1rem;
  line-height: 1.7;
  color: #8892b0;
  margin-bottom: 1.5rem;
`;

const Highlight = styled.span`
  color: #64ffda;
  font-weight: 500;
`;

const TabsContainer = styled.div`
  margin-top: 2rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(30px) saturate(150%);
  -webkit-backdrop-filter: blur(30px) saturate(150%);
  border-radius: 20px;
  padding: 1.5rem;
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.2),
    0 1px 8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.08) 0%,
      transparent 100%
    );
    border-radius: 20px 20px 0 0;
    pointer-events: none;
  }
`;

const TabsHeader = styled.div`
  display: flex;
  border-bottom: 2px solid rgba(100, 255, 218, 0.1);
  margin-bottom: 1.5rem;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    overflow-x: auto;
    scrollbar-width: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const TabButton = styled.button`
  background: ${props => props.active 
    ? 'rgba(255, 255, 255, 0.12)' 
    : 'transparent'};
  backdrop-filter: ${props => props.active ? 'blur(20px)' : 'none'};
  -webkit-backdrop-filter: ${props => props.active ? 'blur(20px)' : 'none'};
  border: ${props => props.active 
    ? '0.5px solid rgba(255, 255, 255, 0.2)' 
    : 'none'};
  border-radius: 12px;
  color: ${props => props.active ? '#e6f1ff' : '#8892b0'};
  padding: 0.75rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  position: relative;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: ${props => props.active ? '600' : '400'};
  box-shadow: ${props => props.active 
    ? '0 2px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
    : 'none'};
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 0.5px solid rgba(255, 255, 255, 0.15);
    color: #e6f1ff;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
  
  @media (max-width: 768px) {
    padding: 0.6rem 0.8rem;
    font-size: 0.9rem;
    border-radius: 10px;
  }
`;

const TabContent = styled(motion.div)`
  min-height: 200px;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const SkillCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(25px) saturate(160%);
  -webkit-backdrop-filter: blur(25px) saturate(160%);
  border: 0.5px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  padding: 1.2rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.15),
    0 1px 8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  /* Apple-style glass reflection */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.08) 0%,
      rgba(255, 255, 255, 0.02) 50%,
      transparent 100%
    );
    border-radius: 16px 16px 0 0;
    pointer-events: none;
  }
  
  /* Shimmer effect */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transition: left 0.6s ease;
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-8px) scale(1.02);
    border-color: rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 
      0 16px 40px rgba(0, 0, 0, 0.2),
      0 4px 16px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.15),
      inset 0 -1px 0 rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(30px) saturate(180%);
    
    &::after {
      left: 100%;
    }
  }
`;

const SkillCardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.8rem;
`;

const SkillProgress = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(100, 255, 218, 0.1);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
`;

const SkillProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #64ffda, #4facfe);
  border-radius: 3px;
  width: 0%;
  transition: width 1.5s ease-out;
  animation: ${progressFill} 2s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
  box-shadow: 0 0 10px rgba(100, 255, 218, 0.5);
  
  --progress: ${props => props.progress || '0%'};
`;

const SkillLevel = styled.span`
  position: absolute;
  right: 0;
  top: -25px;
  font-size: 0.8rem;
  color: #64ffda;
  font-weight: 600;
`;

const SkillIcon = styled.div`
  font-size: 1.5rem;
  color: #64ffda;
  min-width: 24px;
  background: rgba(100, 255, 218, 0.1);
  padding: 0.8rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 15px rgba(100, 255, 218, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1) rotate(10deg);
    box-shadow: 0 0 25px rgba(100, 255, 218, 0.5);
  }
`;

const SkillInfo = styled.div`
  flex: 1;
`;

const SkillTitle = styled.h4`
  color: #e6f1ff;
  font-size: 1rem;
  margin: 0 0 0.25rem 0;
`;

const SkillDescription = styled.p`
  color: #8892b0;
  font-size: 0.9rem;
  margin: 0;
`;

const ExperienceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ExperienceCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(25px) saturate(160%);
  -webkit-backdrop-filter: blur(25px) saturate(160%);
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  padding: 1.8rem;
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.1),
    0 1px 8px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: linear-gradient(180deg, #64ffda, #4facfe);
    border-radius: 0 2px 2px 0;
    box-shadow: 0 0 8px rgba(100, 255, 218, 0.4);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.06) 0%,
      transparent 100%
    );
    border-radius: 16px 16px 0 0;
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.25);
    background: rgba(255, 255, 255, 0.08);
    box-shadow: 
      0 12px 32px rgba(0, 0, 0, 0.15),
      0 4px 16px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(30px) saturate(180%);
  }
`;

const ExperienceHeader = styled.div`
  margin-bottom: 1rem;
`;

const ExperienceTitle = styled.h4`
  color: #e6f1ff;
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
`;

const ExperienceCompany = styled.span`
  color: #64ffda;
  font-weight: 500;
`;

const ExperienceDuration = styled.p`
  color: #8892b0;
  font-size: 0.9rem;
  margin: 0;
`;

const ExperienceDescription = styled.p`
  color: #8892b0;
  line-height: 1.6;
  margin: 0;
`;

const ImageContainer = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 767px) {
    order: -1;
    margin-bottom: 2rem;
  }
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid transparent;
  background: linear-gradient(45deg, #64ffda, #4facfe, #00f2fe) border-box;
  box-shadow: 
    0 0 30px rgba(100, 255, 218, 0.4),
    inset 0 0 20px rgba(100, 255, 218, 0.1);
  animation: ${pulse} 3s ease-in-out infinite;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &::before {
    content: '';
    position: absolute;
    inset: 4px;
    border-radius: 50%;
    background: linear-gradient(45deg, #0a192f, #112240);
    z-index: -1;
  }
  
  &:hover {
    transform: scale(1.05);
    box-shadow: 
      0 0 50px rgba(100, 255, 218, 0.6),
      inset 0 0 30px rgba(100, 255, 218, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 220px;
    height: 220px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  border-radius: 50%;
  
  &:hover {
    transform: scale(1.15);
  }
`;

// Stats Section
const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  width: 100%;
  max-width: 300px;
  
  @media (max-width: 768px) {
    max-width: 250px;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(30px) saturate(170%);
  -webkit-backdrop-filter: blur(30px) saturate(170%);
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  padding: 1.2rem;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 4px 24px rgba(0, 0, 0, 0.15),
    0 1px 8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    inset 0 -1px 0 rgba(255, 255, 255, 0.05);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.1) 0%,
      rgba(255, 255, 255, 0.03) 70%,
      transparent 100%
    );
    border-radius: 14px 14px 0 0;
    pointer-events: none;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.03);
    border-color: rgba(255, 255, 255, 0.35);
    background: rgba(255, 255, 255, 0.12);
    box-shadow: 
      0 12px 32px rgba(0, 0, 0, 0.2),
      0 4px 16px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.18),
      inset 0 -1px 0 rgba(255, 255, 255, 0.08);
    backdrop-filter: blur(35px) saturate(190%);
  }
`;

const StatNumber = styled.div`
  font-size: 1.8rem;
  font-weight: 700;
  color: #64ffda;
  margin-bottom: 0.2rem;
  animation: ${countUp} 0.8s ease-out forwards;
  animation-delay: ${props => props.delay || '0s'};
`;

const StatLabel = styled.div`
  font-size: 0.8rem;
  color: #8892b0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// Achievement Badges
const BadgesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
`;

const Badge = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border: 0.5px solid rgba(255, 255, 255, 0.25);
  border-radius: 16px;
  padding: 0.4rem 0.9rem;
  font-size: 0.75rem;
  color: #e6f1ff;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 2px 12px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 60%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.08) 0%,
      transparent 100%
    );
    border-radius: 16px 16px 0 0;
    pointer-events: none;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05) translateY(-1px);
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(25px) saturate(170%);
  }
`;

// Particles Component
const ParticleSystem = () => {
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const generateParticles = () => {
            const newParticles = [];
            for (let i = 0; i < 15; i++) {
                newParticles.push({
                    id: i,
                    size: Math.random() * 4 + 2,
                    color: Math.random() > 0.5 ? 'rgba(100, 255, 218, 0.6)' : 'rgba(255, 255, 255, 0.4)',
                    duration: Math.random() * 20 + 15,
                    delay: Math.random() * 5,
                    top: Math.random() * 100
                });
            }
            setParticles(newParticles);
        };

        generateParticles();
    }, []);

    return (
        <ParticleContainer>
            {particles.map(particle => (
                <Particle
                    key={particle.id}
                    size={particle.size}
                    color={particle.color}
                    duration={particle.duration}
                    delay={particle.delay}
                    style={{ top: `${particle.top}%` }}
                />
            ))}
        </ParticleContainer>
    );
};

// Mouse Trail Component
const MouseTrail = () => {
    const [trails, setTrails] = useState([]);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });

            setTrails(prev => [...prev.slice(-20), {
                x: e.clientX,
                y: e.clientY,
                id: Date.now()
            }]);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <>
            <CursorTrail style={{ left: mousePos.x - 3, top: mousePos.y - 3 }} />
            {trails.map((trail, index) => (
                <motion.div
                    key={trail.id}
                    initial={{ opacity: 0.8, scale: 1 }}
                    animate={{ opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        position: 'fixed',
                        left: trail.x - 2,
                        top: trail.y - 2,
                        width: 4,
                        height: 4,
                        background: '#64ffda',
                        borderRadius: '50%',
                        pointerEvents: 'none',
                        zIndex: 9998
                    }}
                />
            ))}
        </>
    );
};

// Shooting Stars Component
const ShootingStars = () => {
    const [stars, setStars] = useState([]);

    useEffect(() => {
        const generateStar = () => {
            const newStar = {
                id: Date.now(),
                duration: Math.random() * 3 + 2,
                delay: 0,
                top: Math.random() * 50 + '%',
            };

            setStars(prev => [...prev, newStar]);

            setTimeout(() => {
                setStars(prev => prev.filter(star => star.id !== newStar.id));
            }, (newStar.duration + newStar.delay) * 1000);
        };

        const interval = setInterval(generateStar, Math.random() * 5000 + 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {stars.map(star => (
                <ShootingStar
                    key={star.id}
                    duration={`${star.duration}s`}
                    delay={`${star.delay}s`}
                    style={{ top: star.top }}
                />
            ))}
        </>
    );
};

// Typewriter Effect Component
const TypewriterText = ({ text, delay = 0 }) => {
    const [displayText, setDisplayText] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsTyping(true);
            let i = 0;
            const typeTimer = setInterval(() => {
                if (i < text.length) {
                    setDisplayText(text.slice(0, i + 1));
                    i++;
                } else {
                    clearInterval(typeTimer);
                    setIsTyping(false);
                }
            }, 100);

            return () => clearInterval(typeTimer);
        }, delay);

        return () => clearTimeout(timer);
    }, [text, delay]);

    return (
        <TypewriterContainer className={!isTyping ? 'typing-done' : ''}>
            {displayText}
        </TypewriterContainer>
    );
};

const About = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isInView, setIsInView] = useState(false);
    
    // Performance optimization
    const { shouldDisableEffects, getOptimizedVariants, isMobile } = usePerformanceOptimization();

    const skills = [
        { icon: <FaCode />, title: 'Frontend', description: 'React, Vue, TypeScript, Next.js', level: 95 },
        { icon: <FaServer />, title: 'Backend', description: 'Node.js, Python, Express, Django', level: 80 },
        { icon: <FaDatabase />, title: 'Database', description: 'MongoDB, PostgreSQL, Redis', level: 85 },
        { icon: <FaCloud />, title: 'Cloud', description: 'AWS, Docker, Kubernetes', level: 80 },
        { icon: <FaMobileAlt />, title: 'Mobile', description: 'React Native, Flutter', level: 75 },
        { icon: <FaTools />, title: 'Tools', description: 'Git, Webpack, Jest, Figma', level: 90 },
    ];

    const stats = [
        { number: '4+', label: 'Projects', icon: <FaProjectDiagram /> },
        { number: '3+', label: 'Years Exp', icon: <FaRocket /> },
        { number: '20+', label: 'Clients', icon: <FaTrophy /> },
        { number: '10+', label: 'Awards', icon: <FaAward /> },
    ];

    const badges = [
        { label: 'React Expert', icon: <FaStar /> },
        { label: 'Full Stack', icon: <FaCode /> },
        { label: 'UI/UX', icon: <FaTools /> },
        { label: 'Team Lead', icon: <FaRocket /> },
    ];

    const experiences = [
      {
        title: 'Full Stack Developer',
        company: (
          <a
            href="https://www.lpu.in/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#64ffda', textDecoration: 'underline' }}
          >
            Lovely Professional University (LPU)
          </a>
        ),
        duration: '2024 - 2025',
        description: 'Gained hands-on experience in Full Stack Web Development, working with both frontend and backend technologies. Built responsive web applications using HTML, CSS, JavaScript, React, and Tailwind CSS on the frontend, and Node.js, Express, and MongoDB on the backend. Focused on creating clean UI, RESTful APIs, authentication systems, and deploying projects using platforms like GitHub Pages and Vercel. Emphasized performance optimization, scalability, and real-world problem-solving through personal and collaborative projects.'
      },
      {
        title: 'Frontend Developer',
        company: (
          <a
            href="https://www.digitalwebsolutions.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#64ffda', textDecoration: 'underline' }}
          >
            Digital Web Solution pvt. ltd.
          </a>
        ),
        duration: '2023 - 2024',
        description: 'Built responsive websites for clients using modern CSS techniques. Collaborated with designers to create intuitive user interfaces.'
      }
    ];

    const qualifications = [
        {
            title: 'Diploma in Computer Science Engineering (CSE)',
            institution: 'Lovely Professional University (LPU)',
            duration: '2022 - 2025',
            description: 'Completed a 3-year Diploma in Computer Science Engineering focused on fundamental concepts of programming, data structures, computer networks, and software development. Gained practical knowledge through lab work and basic project development.'
        },
        {
            title: '10th',
            institution: 'S.Raza High School',
            duration: '2020 - 2021',
            description: 'Completed secondary education (CBSE) from S.Raza High School'
        }
    ];

    const tabVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <>
            {!shouldDisableEffects && <MouseTrail />}
            <AboutSection id="about">
                {!shouldDisableEffects && <ParticleSystem />}
                {!shouldDisableEffects && <ShootingStars />}

                {/* Floating Elements - only on desktop */}
                {!isMobile && (
                    <>
                        <FloatingElement
                            style={{ top: '10%', right: '15%' }}
                            size="30px"
                            duration="8s"
                            delay="0s"
                        >
                            <FaRocket />
                        </FloatingElement>
                        <FloatingElement
                            style={{ top: '60%', left: '10%' }}
                            size="25px"
                            duration="10s"
                            delay="2s"
                        >
                            <FaCode />
                        </FloatingElement>
                        <FloatingElement
                            style={{ top: '30%', right: '5%' }}
                            size="35px"
                            duration="12s"
                            delay="4s"
                        >
                            <FaDatabase />
                        </FloatingElement>
                    </>
                )}
                <FloatingElement
                    style={{ bottom: '20%', left: '20%' }}
                    size="28px"
                    duration="9s"
                    delay="1s"
                >
                    <FaServer />
                </FloatingElement>

                <Container>
                    <Grid>
                        <Content
                            variants={fadeIn('right', 0.2)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                        >
                            <Title
                                variants={textVariant(0.1)}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true }}
                            >
                                <TypewriterText text="About Me" delay={500} />
                            </Title>

                            <Subtitle>Full-Stack Developer & Problem Solver</Subtitle>

                            <Description>
                                I'm a passionate <Highlight>full-stack developer</Highlight> with 3+ years of experience
                                creating beautiful, functional, and user-centered digital experiences. I specialize in
                                <Highlight> React, Node.js, and modern web technologies</Highlight>, always staying
                                current with industry trends and best practices.
                            </Description>

                            <Description>
                                My approach focuses on writing clean, maintainable code while delivering
                                exceptional user experiences. I enjoy tackling complex problems and
                                turning ideas into reality through code.
                            </Description>

                            <TabsContainer>
                                <TabsHeader>
                                    <TabButton
                                        active={activeTab === 'overview'}
                                        onClick={() => setActiveTab('overview')}
                                    >
                                        <FaUser /> Overview
                                    </TabButton>
                                    <TabButton
                                        active={activeTab === 'skills'}
                                        onClick={() => setActiveTab('skills')}
                                    >
                                        <FaCode /> Skills
                                    </TabButton>
                                    <TabButton
                                        active={activeTab === 'experience'}
                                        onClick={() => setActiveTab('experience')}
                                    >
                                        <FaBriefcase /> Experience
                                    </TabButton>
                                    <TabButton
                                        active={activeTab === 'education'}
                                        onClick={() => setActiveTab('education')}
                                    >
                                        <FaGraduationCap /> Education
                                    </TabButton>
                                </TabsHeader>

                                <TabContent
                                    key={activeTab}
                                    variants={tabVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ duration: 0.3 }}
                                >
                                    {activeTab === 'overview' && (
                                        <div>
                                            <Description>
                                                When I'm not coding, you'll find me exploring new technologies, contributing to
                                                open-source projects, or sharing knowledge through blog posts and mentoring.
                                                I believe in continuous learning and always strive to improve my craft.
                                            </Description>
                                            <Description>
                                                I'm particularly interested in performance optimization, accessibility, and
                                                creating inclusive digital experiences that work for everyone.
                                            </Description>
                                        </div>
                                    )}

                                    {activeTab === 'skills' && (
                                        <SkillsGrid>
                                            {skills.map((skill, index) => (
                                                <SkillCard
                                                    key={index}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <SkillCardContent>
                                                        <SkillIcon>{skill.icon}</SkillIcon>
                                                        <SkillInfo>
                                                            <SkillTitle>{skill.title}</SkillTitle>
                                                            <SkillDescription>{skill.description}</SkillDescription>
                                                        </SkillInfo>
                                                    </SkillCardContent>
                                                    <SkillProgress>
                                                        <SkillLevel>{skill.level}%</SkillLevel>
                                                        <SkillProgressBar
                                                            progress={`${skill.level}%`}
                                                            delay={`${index * 0.2 + 0.5}s`}
                                                        />
                                                    </SkillProgress>
                                                </SkillCard>
                                            ))}
                                        </SkillsGrid>
                                    )}

                                    {activeTab === 'experience' && (
                                        <ExperienceList>
                                            {experiences.map((exp, index) => (
                                                <ExperienceCard
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <ExperienceHeader>
                                                        <ExperienceTitle>
                                                            {exp.title} @ <ExperienceCompany>{exp.company}</ExperienceCompany>
                                                        </ExperienceTitle>
                                                        <ExperienceDuration>{exp.duration}</ExperienceDuration>
                                                    </ExperienceHeader>
                                                    <ExperienceDescription>
                                                        {exp.description}
                                                    </ExperienceDescription>
                                                </ExperienceCard>
                                            ))}
                                        </ExperienceList>
                                    )}

                                    {activeTab === 'education' && (
                                        <ExperienceList>
                                            {qualifications.map((qual, index) => (
                                                <ExperienceCard
                                                    key={index}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    <ExperienceHeader>
                                                        <ExperienceTitle>{qual.title}</ExperienceTitle>
                                                        <ExperienceDuration>
                                                            {qual.institution} • {qual.duration}
                                                        </ExperienceDuration>
                                                    </ExperienceHeader>
                                                    <ExperienceDescription>
                                                        {qual.description}
                                                    </ExperienceDescription>
                                                </ExperienceCard>
                                            ))}
                                        </ExperienceList>
                                    )}
                                </TabContent>
                            </TabsContainer>
                        </Content>

                        <ImageContainer
                            variants={fadeIn('left', 0.3)}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true }}
                        >
                            <ImageWrapper>
                                <Image src="./me4.png" alt="Profile" />
                            </ImageWrapper>

                            <StatsContainer>
                                {stats.map((stat, index) => (
                                    <StatCard
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 + 0.5 }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <StatNumber delay={`${index * 0.2 + 1}s`}>
                                            {stat.number}
                                        </StatNumber>
                                        <StatLabel>{stat.label}</StatLabel>
                                    </StatCard>
                                ))}
                            </StatsContainer>

                            <BadgesContainer>
                                {badges.map((badge, index) => (
                                    <Badge
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 + 1.5 }}
                                        whileHover={{ scale: 1.1 }}
                                    >
                                        {badge.icon}
                                        {badge.label}
                                    </Badge>
                                ))}
                            </BadgesContainer>
                        </ImageContainer>
                    </Grid>
                </Container>
            </AboutSection>
        </>
    );
};

export default About;
