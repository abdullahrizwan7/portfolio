import React, { useState, useEffect, useMemo } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { fadeIn, textVariant } from '../animations';
import { FaCode, FaServer, FaDatabase, FaTools, FaMobileAlt, FaCloud, FaGraduationCap, FaBriefcase, FaUser, FaRocket, FaAward, FaTrophy, FaProjectDiagram, FaStar } from 'react-icons/fa';

// Keyframes for animations
const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.9; }
  50% { opacity: 1; }
`;

const progressFill = keyframes`
  0% { width: 0%; }
  100% { width: var(--progress); }
`;

// Responsive breakpoints
const breakpoints = {
  xs: '320px',
  sm: '480px',
  md: '768px',
  lg: '1024px',
  xl: '1200px',
  xxl: '1400px'
};

// Optimized particle system
const ParticleSystem = React.memo(() => {
  const [particles, setParticles] = useState([]);
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const generateParticles = () => {
      const width = window.innerWidth;
      let newDeviceType = 'desktop';
      let particleCount = 15;
      
      if (width < 768) {
        newDeviceType = 'mobile';
        particleCount = 8;
      } else if (width < 1024) {
        newDeviceType = 'tablet';
        particleCount = 12;
      }
      
      setDeviceType(newDeviceType);
      
      const newParticles = [];
      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          size: Math.random() * 3 + 1,
          color: Math.random() > 0.5 ? 'rgba(100, 255, 218, 0.5)' : 'rgba(255, 255, 255, 0.3)',
          duration: Math.random() * 20 + 15,
          delay: Math.random() * 5,
          top: Math.random() * 100
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    
    const handleResize = () => {
      generateParticles();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ParticleContainer $deviceType={deviceType}>
      {particles.map(particle => (
        <Particle
          key={particle.id}
          $size={particle.size}
          $color={particle.color}
          $duration={particle.duration}
          $delay={particle.delay}
          style={{ top: `${particle.top}%` }}
        />
      ))}
    </ParticleContainer>
  );
});

const AboutSection = styled.section`
  padding: 2rem 1rem;
  background: radial-gradient(ellipse at top, #1a365d 0%, #0a192f 70%, #000000 100%);
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
      radial-gradient(1px 1px at 130px 80px, rgba(100,255,218,0.4), transparent);
    background-repeat: repeat;
    background-size: 400px 200px;
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
      radial-gradient(ellipse at 75% 75%, rgba(79, 172, 254, 0.08) 0%, transparent 50%);
    animation: ${float} 20s ease-in-out infinite;
    pointer-events: none;
    
    @media (max-width: ${breakpoints.md}) {
      animation: none;
    }
  }
  
  @media (max-width: ${breakpoints.md}) {
    padding: 1.5rem 1rem;
    min-height: auto;
    
    &::before {
      background-size: 300px 150px;
    }
  }
`;

const ParticleContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  display: ${props => props.$deviceType === 'mobile' ? 'none' : 'block'};
`;

const Particle = styled.div`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: ${props => props.$color};
  border-radius: 50%;
  animation: ${float} ${props => props.$duration}s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  opacity: 0.6;
  will-change: transform;
`;

const FloatingElement = styled(motion.div)`
  position: absolute;
  color: rgba(100, 255, 218, 0.1);
  font-size: ${props => props.$size || '20px'};
  animation: ${float} ${props => props.$duration || '6s'} ease-in-out infinite;
  animation-delay: ${props => props.$delay || '0s'};
  pointer-events: none;
  will-change: transform;
  
  @media (max-width: ${breakpoints.md}) {
    display: none;
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
  gap: 1.5rem;
  align-items: center;
  
  @media (min-width: ${breakpoints.md}) {
    grid-template-columns: 1fr 280px;
    gap: 2rem;
  }
  
  @media (min-width: ${breakpoints.lg}) {
    grid-template-columns: 1fr 320px;
    gap: 3rem;
  }
`;

const Content = styled(motion.div)`
  color: #e6f1ff;
  background: 
    linear-gradient(135deg, 
      rgba(255, 255, 255, 0.12) 0%, 
      rgba(255, 255, 255, 0.06) 50%, 
      rgba(255, 255, 255, 0.10) 100%
    );
  backdrop-filter: blur(25px) saturate(180%);
  border-radius: 20px;
  padding: 1.5rem;
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 2px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    inset 0 -1px 0 rgba(255, 255, 255, 0.05);
  
  /* Liquid glass reflection */
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
  
  @media (max-width: ${breakpoints.md}) {
    padding: 1.2rem;
    border-radius: 16px;
    backdrop-filter: blur(15px) saturate(150%);
  }
`;

const Title = styled(motion.h2)`
  font-size: 2rem;
  font-weight: 700;
  color: #e6f1ff;
  margin-bottom: 1rem;
  position: relative;
  text-shadow: 0 0 20px rgba(100, 255, 218, 0.3);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #64ffda, #4facfe);
    border-radius: 2px;
    box-shadow: 0 0 10px rgba(100, 255, 218, 0.3);
  }
  
  @media (max-width: ${breakpoints.md}) {
    font-size: 1.7rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #64ffda;
  margin-bottom: 1rem;
  font-weight: 500;
  text-shadow: 0 0 15px rgba(100, 255, 218, 0.2);
  
  @media (max-width: ${breakpoints.md}) {
    font-size: 1rem;
  }
`;

const Description = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #8892b0;
  margin-bottom: 1.2rem;
  
  @media (max-width: ${breakpoints.md}) {
    font-size: 0.9rem;
  }
`;

const Highlight = styled.span`
  color: #64ffda;
  font-weight: 500;
`;

const TabsContainer = styled.div`
  margin-top: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(150%);
  border-radius: 16px;
  padding: 1.2rem;
  position: relative;
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.15),
    0 1px 8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  
  /* Liquid glass effect */
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
    border-radius: 16px 16px 0 0;
    pointer-events: none;
  }
  
  @media (max-width: ${breakpoints.md}) {
    padding: 1rem;
    margin-top: 1rem;
  }
`;

const TabsHeader = styled.div`
  display: flex;
  border-bottom: 2px solid rgba(100, 255, 218, 0.1);
  margin-bottom: 1rem;
  gap: 0.5rem;
  overflow-x: auto;
  scrollbar-width: none;
  
  &::-webkit-scrollbar {
    display: none;
  }
`;

const TabButton = styled.button`
  background: ${props => props.$active 
    ? 'rgba(255, 255, 255, 0.12)' 
    : 'transparent'};
  backdrop-filter: ${props => props.$active ? 'blur(15px)' : 'none'};
  border: ${props => props.$active 
    ? '0.5px solid rgba(255, 255, 255, 0.2)' 
    : 'none'};
  border-radius: 10px;
  color: ${props => props.$active ? '#e6f1ff' : '#8892b0'};
  padding: 0.6rem 0.8rem;
  font-size: 0.9rem;
  cursor: pointer;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: ${props => props.$active ? '600' : '400'};
  
  @media (max-width: ${breakpoints.md}) {
    padding: 0.5rem 0.7rem;
    font-size: 0.85rem;
  }
`;

const TabContent = styled(motion.div)`
  min-height: 150px;
`;

const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.8rem;
  margin-top: 0.8rem;
  
  @media (max-width: ${breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const SkillCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px) saturate(160%);
  border: 0.5px solid rgba(255, 255, 255, 0.18);
  border-radius: 14px;
  padding: 1rem;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.15),
    0 1px 6px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  /* Liquid glass effect */
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
    border-radius: 14px 14px 0 0;
    pointer-events: none;
  }
  
  @media (max-width: ${breakpoints.md}) {
    padding: 0.8rem;
  }
`;

const SkillCardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.6rem;
`;

const SkillProgress = styled.div`
  width: 100%;
  height: 5px;
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
  animation: ${progressFill} 1.5s ease-out forwards;
  animation-delay: ${props => props.$delay || '0s'};
  box-shadow: 0 0 8px rgba(100, 255, 218, 0.3);
  
  --progress: ${props => props.$progress || '0%'};
`;

const SkillLevel = styled.span`
  position: absolute;
  right: 0;
  top: -22px;
  font-size: 0.75rem;
  color: #64ffda;
  font-weight: 600;
`;

const SkillIcon = styled.div`
  font-size: 1.2rem;
  color: #64ffda;
  min-width: 24px;
  background: rgba(100, 255, 218, 0.1);
  padding: 0.6rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 10px rgba(100, 255, 218, 0.2);
`;

const SkillInfo = styled.div`
  flex: 1;
`;

const SkillTitle = styled.h4`
  color: #e6f1ff;
  font-size: 0.95rem;
  margin: 0 0 0.2rem 0;
`;

const SkillDescription = styled.p`
  color: #8892b0;
  font-size: 0.85rem;
  margin: 0;
`;

const ExperienceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ExperienceCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px) saturate(160%);
  border: 0.5px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  padding: 1.2rem;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.1),
    0 1px 6px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, #64ffda, #4facfe);
    border-radius: 0 2px 2px 0;
    box-shadow: 0 0 5px rgba(100, 255, 218, 0.3);
  }
  
  @media (max-width: ${breakpoints.md}) {
    padding: 1rem;
  }
`;

const ExperienceHeader = styled.div`
  margin-bottom: 0.8rem;
`;

const ExperienceTitle = styled.h4`
  color: #e6f1ff;
  font-size: 1.1rem;
  margin: 0 0 0.4rem 0;
  
  @media (max-width: ${breakpoints.md}) {
    font-size: 1rem;
  }
`;

const ExperienceCompany = styled.span`
  color: #64ffda;
  font-weight: 500;
`;

const ExperienceDuration = styled.p`
  color: #8892b0;
  font-size: 0.85rem;
  margin: 0;
`;

const ExperienceDescription = styled.p`
  color: #8892b0;
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
  
  @media (max-width: ${breakpoints.md}) {
    font-size: 0.9rem;
  }
`;

const ImageContainer = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  
  @media (max-width: ${breakpoints.md}) {
    order: -1;
    margin-bottom: 1.5rem;
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
  gap: 0.8rem;
  width: 100%;
  max-width: 280px;
  
  @media (max-width: ${breakpoints.md}) {
    max-width: 220px;
    gap: 0.6rem;
  }
`;

const StatCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(25px) saturate(170%);
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.15),
    0 1px 8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  
  /* Liquid glass effect */
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
    border-radius: 12px 12px 0 0;
    pointer-events: none;
  }
  
  @media (max-width: ${breakpoints.md}) {
    padding: 0.8rem;
  }
`;

const StatNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #64ffda;
  margin-bottom: 0.2rem;
  
  @media (max-width: ${breakpoints.md}) {
    font-size: 1.3rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.75rem;
  color: #8892b0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

// Achievement Badges
const BadgesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  justify-content: center;
  margin-top: 1rem;
  
  @media (max-width: ${breakpoints.md}) {
    margin-top: 0.8rem;
  }
`;

const Badge = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px) saturate(150%);
  border: 0.5px solid rgba(255, 255, 255, 0.25);
  border-radius: 14px;
  padding: 0.3rem 0.7rem;
  font-size: 0.7rem;
  color: #e6f1ff;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 2px 10px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  
  /* Liquid glass effect */
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
    border-radius: 14px 14px 0 0;
    pointer-events: none;
  }
  
  @media (max-width: ${breakpoints.md}) {
    padding: 0.25rem 0.6rem;
    font-size: 0.65rem;
  }
`;

// Custom hook to detect mobile devices
const useDeviceType = () => {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  return { isMobile };
};

// Memoized Typewriter component
const MemoizedTypewriter = React.memo(({ text }) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayText(text.substring(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [text]);
  
  return <>{displayText}</>;
});

const About = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { isMobile } = useDeviceType();
  
  // Memoize data arrays
  const skills = useMemo(() => [
    { icon: <FaCode />, title: 'Frontend', description: 'React, Vue, TypeScript, Next.js', level: 95 },
    { icon: <FaServer />, title: 'Backend', description: 'Node.js, Python, Express, Django', level: 80 },
    { icon: <FaDatabase />, title: 'Database', description: 'MongoDB, PostgreSQL, Redis', level: 85 },
    { icon: <FaCloud />, title: 'Cloud', description: 'AWS, Docker, Kubernetes', level: 80 },
    { icon: <FaMobileAlt />, title: 'Mobile', description: 'React Native, Flutter', level: 75 },
    { icon: <FaTools />, title: 'Tools', description: 'Git, Webpack, Jest, Figma', level: 90 },
  ], []);
  
  const stats = useMemo(() => [
    { number: '4+', label: 'Projects', icon: <FaProjectDiagram /> },
    { number: '3+', label: 'Years Exp', icon: <FaRocket /> },
    { number: '20+', label: 'Clients', icon: <FaTrophy /> },
    { number: '10+', label: 'Awards', icon: <FaAward /> },
  ], []);
  
  const badges = useMemo(() => [
    { label: 'React Expert', icon: <FaStar /> },
    { label: 'Full Stack', icon: <FaCode /> },
    { label: 'UI/UX', icon: <FaTools /> },
    { label: 'Team Lead', icon: <FaRocket /> },
  ], []);
  
  const experiences = useMemo(() => [
    {
      title: 'Full Stack Developer',
      company: "Lovely Professional University (LPU)",
      duration: '2024 - 2025',
      description: 'Proactively learned Full Stack Web Development alongside academic studies. Developed dynamic and responsive web applications using modern technologies.'
    },
    {
      title: 'Frontend Developer',
      company: "Digital Web Solution pvt. ltd.",
      duration: '2023 - 2024',
      description: 'Built responsive websites for clients using modern CSS techniques. Collaborated with designers to create intuitive user interfaces.'
    }
  ], []);
  
  const qualifications = useMemo(() => [
    {
      title: 'Diploma in Computer Science Engineering',
      institution: "Lovely Professional University (LPU)",
      duration: '2022 - 2025',
      description: 'Completed a 3-year Diploma in Computer Science Engineering focused on fundamental concepts of programming and software development.'
    },
    {
      title: '10th',
      institution: "S.Raza High School",
      duration: '2020 - 2021',
      description: 'Completed secondary education (CBSE) from S.Raza High School'
    }
  ], []);

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AboutSection id="about">
      <ParticleSystem />
      
      {!isMobile && (
        <>
          <FloatingElement
            style={{ top: '10%', right: '15%' }}
            $size="30px"
            $duration="8s"
            $delay="0s"
          >
            <FaRocket />
          </FloatingElement>
          <FloatingElement
            style={{ top: '60%', left: '10%' }}
            $size="25px"
            $duration="10s"
            $delay="2s"
          >
            <FaCode />
          </FloatingElement>
          <FloatingElement
            style={{ top: '30%', right: '5%' }}
            $size="35px"
            $duration="12s"
            $delay="4s"
          >
            <FaDatabase />
          </FloatingElement>
        </>
      )}

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
              <MemoizedTypewriter text="About Me" />
            </Title>

            <Subtitle>Full-Stack Developer & Problem Solver</Subtitle>

            <Description>
              I'm a passionate <Highlight>full-stack developer</Highlight> with 3+ years of experience
              creating beautiful, functional, and user-centered digital experiences. I specialize in
              <Highlight> React, Node.js, and modern web technologies</Highlight>.
            </Description>

            <Description>
              My approach focuses on writing clean, maintainable code while delivering
              exceptional user experiences.
            </Description>

            <TabsContainer>
              <TabsHeader>
                <TabButton
                  $active={activeTab === 'overview'}
                  onClick={() => setActiveTab('overview')}
                >
                  <FaUser /> Overview
                </TabButton>
                <TabButton
                  $active={activeTab === 'skills'}
                  onClick={() => setActiveTab('skills')}
                >
                  <FaCode /> Skills
                </TabButton>
                <TabButton
                  $active={activeTab === 'experience'}
                  onClick={() => setActiveTab('experience')}
                >
                  <FaBriefcase /> Experience
                </TabButton>
                <TabButton
                  $active={activeTab === 'education'}
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
                      When I'm not coding, you'll find me exploring new technologies or sharing knowledge.
                    </Description>
                    <Description>
                      I'm particularly interested in performance optimization, accessibility, and
                      creating inclusive digital experiences.
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
                            $progress={`${skill.level}%`}
                            $delay={`${index * 0.2 + 0.5}s`}
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
                  <StatNumber>
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
  );
};

export default React.memo(About);