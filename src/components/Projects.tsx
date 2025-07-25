import React, { useMemo, useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { fadeIn, staggerContainer, textVariant } from '../animations';
import ProjectCard from './ProjectCard';

// TypeScript interfaces for styled component props
interface ReducedMotionProps {
  $reduceMotion?: boolean;
}

interface ParticleProps extends ReducedMotionProps {
  size?: string;
  bg?: string;
  radius?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  moveX2?: string;
  moveY2?: string;
  duration?: string;
}

interface ProjectsProps {
  $reduceMotion?: boolean;
}

interface ProjectData {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  link: string;
  current?: boolean;
  progress?: number; // 0-100 for completion percentage
}

// Helper for motion preference - memoized
const prefersReducedMotion = (): boolean => {
  return typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
};

const ProjectsSection = styled.section<ReducedMotionProps>`
  min-height: 100vh;
  padding: 4rem 2rem;
  background: 
    radial-gradient(ellipse at top, #1a365d 0%, #0a192f 50%, #000000 100%),
    linear-gradient(135deg, #0a192f 0%, #1a202c 50%, #2d3748 100%);
  position: relative;
  overflow: hidden;
  
  /* Enhanced Starfield Background */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.9), transparent),
      radial-gradient(2px 2px at 40px 70px, rgba(100,255,218,0.7), transparent),
      radial-gradient(1px 1px at 90px 40px, rgba(255,255,255,1), transparent),
      radial-gradient(1px 1px at 130px 80px, rgba(100,255,218,0.5), transparent),
      radial-gradient(2px 2px at 160px 30px, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 200px 90px, rgba(100,255,218,0.9), transparent),
      radial-gradient(2px 2px at 240px 50px, rgba(255,255,255,0.8), transparent),
      radial-gradient(1px 1px at 280px 10px, rgba(100,255,218,0.6), transparent),
      radial-gradient(1px 1px at 320px 120px, rgba(255,255,255,0.5), transparent),
      radial-gradient(2px 2px at 360px 60px, rgba(100,255,218,0.8), transparent),
      radial-gradient(1px 1px at 50px 150px, rgba(138, 43, 226, 0.7), transparent),
      radial-gradient(2px 2px at 120px 200px, rgba(79, 172, 254, 0.6), transparent);
    background-repeat: repeat;
    background-size: 400px 200px;
    animation: ${({ $reduceMotion }) => $reduceMotion ? 'none' : 'twinkle 4s ease-in-out infinite alternate'};
    pointer-events: none;
    z-index: 1;
  }
  
  /* Enhanced Nebula Effects */
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: 
      radial-gradient(ellipse at 25% 25%, rgba(100, 255, 218, 0.15) 0%, transparent 50%),
      radial-gradient(ellipse at 75% 75%, rgba(79, 172, 254, 0.12) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 10%, rgba(147, 51, 234, 0.1) 0%, transparent 40%),
      radial-gradient(ellipse at 80% 20%, rgba(255, 20, 147, 0.08) 0%, transparent 45%),
      radial-gradient(ellipse at 20% 80%, rgba(0, 255, 255, 0.06) 0%, transparent 35%);
    animation: ${({ $reduceMotion }) => $reduceMotion ? 'none' : 'float 20s ease-in-out infinite'};
    pointer-events: none;
    z-index: 1;
  }
  
  @keyframes float {
    0%, 100% { 
      transform: translateY(0px);
      opacity: 0.8;
    }
    50% { 
      transform: translateY(-15px);
      opacity: 1;
    }
  }

  @keyframes twinkle {
    0%, 100% { 
      opacity: 0.4;
    }
    50% { 
      opacity: 1;
    }
  }
  
  @media (max-width: 1024px) {
    padding: 3rem 1.5rem;
    
    &::before {
      background-size: 350px 175px;
    }
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    min-height: auto;
    
    &::before {
      background-size: 300px 150px;
      animation: ${({ $reduceMotion }) => $reduceMotion ? 'none' : 'twinkle 3s ease-in-out infinite alternate'};
    }
    
    &::after {
      animation: ${({ $reduceMotion }) => $reduceMotion ? 'none' : 'float 15s ease-in-out infinite'};
    }
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem 0.5rem;
    
    &::before {
      background-size: 250px 125px;
    }
  }
`;

const FloatingShape = styled.div<ParticleProps>`
  position: absolute;
  width: ${props => props.size || '100px'};
  height: ${props => props.size || '100px'};
  background: ${props => props.bg || 'rgba(100, 255, 218, 0.04)'};
  backdrop-filter: blur(40px) saturate(180%) brightness(110%);
  -webkit-backdrop-filter: blur(40px) saturate(180%) brightness(110%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: ${props => props.radius || '30% 70% 70% 30% / 30% 30% 70% 70%'};
  top: ${props => props.top || '10%'};
  left: ${props => props.left || 'auto'};
  right: ${props => props.right || 'auto'};
  bottom: ${props => props.bottom || 'auto'};
  z-index: 1;
  animation: ${({ $reduceMotion }) => $reduceMotion ? 'none' : `floating ${props => props.duration || '15s'} ease-in-out infinite alternate`};
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.15),
    0 4px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2),
    inset 0 -1px 0 rgba(255, 255, 255, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  
  /* Enhanced Glass reflection */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.15) 0%,
      rgba(255, 255, 255, 0.08) 30%,
      transparent 100%
    );
    border-radius: inherit;
    pointer-events: none;
  }
  
  /* Liquid glass shimmer effect */
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(255, 255, 255, 0.05) 50%,
      transparent 70%
    );
    animation: ${({ $reduceMotion }) => $reduceMotion ? 'none' : 'shimmer 3s ease-in-out infinite'};
    pointer-events: none;
    border-radius: inherit;
  }
  
  @keyframes shimmer {
    0% {
      transform: translateX(-100%) translateY(-100%) rotate(0deg);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translateX(100%) translateY(100%) rotate(360deg);
      opacity: 0;
    }
  }
  
  @keyframes floating {
    0% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(${props => props.moveX2 || '-20px'}, ${props => props.moveY2 || '-10px'});
    }
    100% {
      transform: translate(0, 0);
    }
  }
  
  @media (max-width: 1024px) {
    backdrop-filter: blur(30px) saturate(150%);
    -webkit-backdrop-filter: blur(30px) saturate(150%);
    width: ${props => props.size ? `calc(${props.size} * 0.85)` : '85px'};
    height: ${props => props.size ? `calc(${props.size} * 0.85)` : '85px'};
  }
  
  @media (max-width: 768px) {
    backdrop-filter: blur(20px) saturate(130%);
    -webkit-backdrop-filter: blur(20px) saturate(130%);
    width: ${props => props.size ? `calc(${props.size} * 0.7)` : '70px'};
    height: ${props => props.size ? `calc(${props.size} * 0.7)` : '70px'};
    
    &::after {
      animation: ${({ $reduceMotion }) => $reduceMotion ? 'none' : 'shimmer 2s ease-in-out infinite'};
    }
  }
  
  @media (max-width: 480px) {
    backdrop-filter: blur(15px) saturate(120%);
    -webkit-backdrop-filter: blur(15px) saturate(120%);
    width: ${props => props.size ? `calc(${props.size} * 0.5)` : '50px'};
    height: ${props => props.size ? `calc(${props.size} * 0.5)` : '50px'};
    
    &::after {
      animation: ${({ $reduceMotion }) => $reduceMotion ? 'none' : 'shimmer 1.5s ease-in-out infinite'};
    }
  }
`;

const ProjectsContainer = styled(motion.div)<ReducedMotionProps>`
  max-width: 1300px;
  margin: 0 auto;
  position: relative;
  z-index: 3;
  width: 100%;
  padding: 3rem;
  background: 
    linear-gradient(135deg, 
      rgba(255, 255, 255, 0.12) 0%, 
      rgba(255, 255, 255, 0.08) 50%, 
      rgba(255, 255, 255, 0.06) 100%
    );
  backdrop-filter: blur(50px) saturate(200%) brightness(105%);
  -webkit-backdrop-filter: blur(50px) saturate(200%) brightness(105%);
  border-radius: 32px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 
    0 20px 60px rgba(0, 0, 0, 0.4),
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 4px 16px rgba(0, 0, 0, 0.2),
    inset 0 2px 0 rgba(255, 255, 255, 0.15),
    inset 0 -2px 0 rgba(255, 255, 255, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 25px 70px rgba(0, 0, 0, 0.5),
      0 12px 40px rgba(0, 0, 0, 0.35),
      0 6px 20px rgba(0, 0, 0, 0.25),
      inset 0 2px 0 rgba(255, 255, 255, 0.2),
      inset 0 -2px 0 rgba(255, 255, 255, 0.1),
      0 0 0 1px rgba(255, 255, 255, 0.15);
  }
  
  /* Enhanced glass reflection */
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
      rgba(255, 255, 255, 0.1) 30%,
      rgba(255, 255, 255, 0.05) 60%,
      transparent 100%
    );
    pointer-events: none;
    border-radius: 32px 32px 0 0;
    z-index: 1;
  }
  
  /* Liquid glass shimmer effect */
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 30%,
      rgba(255, 255, 255, 0.08) 50%,
      transparent 70%
    );
    animation: ${({ $reduceMotion }) => $reduceMotion ? 'none' : 'containerShimmer 6s ease-in-out infinite'};
    pointer-events: none;
    border-radius: 32px;
    z-index: 0;
  }
  
  @keyframes containerShimmer {
    0% {
      transform: translateX(-100%) translateY(-100%) rotate(0deg);
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      transform: translateX(100%) translateY(100%) rotate(360deg);
      opacity: 0;
    }
  }
  
  @media (max-width: 1024px) {
    max-width: 95%;
    padding: 2.5rem;
    border-radius: 28px;
    backdrop-filter: blur(40px) saturate(180%);
    -webkit-backdrop-filter: blur(40px) saturate(180%);
    
    &::before {
      border-radius: 28px 28px 0 0;
    }
    
    &::after {
      animation: ${({ $reduceMotion }) => $reduceMotion ? 'none' : 'containerShimmer 5s ease-in-out infinite'};
      border-radius: 28px;
    }
  }
  
  @media (max-width: 768px) {
    max-width: 100%;
    padding: 1.5rem;
    border-radius: 20px;
    margin: 0 0.5rem;
    backdrop-filter: blur(30px) saturate(150%);
    -webkit-backdrop-filter: blur(30px) saturate(150%);
    
    &::before {
      border-radius: 20px 20px 0 0;
    }
    
    &::after {
      animation: ${({ $reduceMotion }) => $reduceMotion ? 'none' : 'containerShimmer 4s ease-in-out infinite'};
      border-radius: 20px;
    }
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    border-radius: 16px;
    margin: 0;
    backdrop-filter: blur(20px) saturate(130%);
    -webkit-backdrop-filter: blur(20px) saturate(130%);
    
    &::before {
      border-radius: 16px 16px 0 0;
    }
    
    &::after {
      animation: ${({ $reduceMotion }) => $reduceMotion ? 'none' : 'containerShimmer 3s ease-in-out infinite'};
      border-radius: 16px;
    }
  }
`;

const SectionTitle = styled(motion.h2)<ReducedMotionProps>`
  font-size: 3.2rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  background: linear-gradient(90deg, #64ffda, #a5ffea, #64ffda);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${({ $reduceMotion }) => $reduceMotion ? 'none' : 'gradientText 4s linear infinite'};
  text-shadow: 0 0 15px rgba(100, 255, 218, 0.4);
  letter-spacing: 1.5px;
  text-align: center;
  position: relative;
  z-index: 2;
  
  @keyframes gradientText {
    0% { background-position: 0% center; }
    50% { background-position: 100% center; }
    100% { background-position: 0% center; }
  }
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
    margin-bottom: 0.8rem;
    letter-spacing: 1px;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 0.6rem;
    letter-spacing: 0.5px;
  }
`;

const SectionSubtitle = styled.p`
  color: #8892b0;
  font-size: 1.2rem;
  max-width: 700px;
  margin: 0 auto 3rem auto;
  line-height: 1.7;
  font-weight: 300;
  text-align: center;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
    max-width: 100%;
    margin-bottom: 2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1.4;
    margin-bottom: 1.5rem;
  }
`;

const ProjectsGrid = styled(motion.div)<ReducedMotionProps>`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
  position: relative;
  z-index: 2;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.8rem;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

// Projects data - extracted to prevent recreation on each render
const PROJECTS_DATA: ProjectData[] = [
    {
        id: 1,
        title: 'Personal Portfolio',
        description: 'A modern, responsive portfolio website showcasing my projects, skills, and professional experience.',
        image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
        tags: ['React', 'JavaScript', 'CSS3', 'HTML5'],
        github: 'https://github.com/abdullahrizwan7/portfolio',
        link: 'https://abdullahrizwan7.github.io/portfolio',
        current: true,
    },
    {
        id: 2,
        title: 'FitVision',
        description: 'AI-powered fitness web app that uses real-time pose detection to guide workouts, count reps, and track posture — all through your webcam. Built with React and MediaPipe, its your personal trainer in the browser.',
        image: './fitvision.gif',
        tags: ['React', 'JavaScript', 'TypeScript', 'CSS3', 'HTML5'],
        github: 'https://github.com/abdullahrizwan7/FitVision',
        link: 'https://abdullahrizwan7.github.io/FitVision',
    },
    {
        id: 3,
        title: 'Project Nexus',
        description: 'Something big is coming... A revolutionary platform that will change how you interact with digital commerce.',
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
        tags: ['?????', '?????', '?????', '?????'],
        github: 'https://github.com',
        link: 'https://example.com',
        progress: 75,
    },
    {
        id: 4,
        title: 'Project Echo',
        description: 'The future of intelligent conversation awaits... An AI companion that understands you better than you understand yourself.',
        image: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1064&q=80',
        tags: ['?????', '?????', '?????', '?????'],
        github: 'https://github.com',
        link: 'https://example.com',
        progress: 35,
    }
];

const Projects: React.FC<ProjectsProps> = ({ $reduceMotion }) => {
    // Memoize animation variants to prevent recreation on each render
    const containerVariants = useMemo(() => 
        !$reduceMotion ? staggerContainer(0.1, 0.1) : {}, 
        [$reduceMotion]
    );
    
    const titleVariants = useMemo(() => 
        !$reduceMotion ? textVariant(0.1) : {}, 
        [$reduceMotion]
    );

    return (
        <ProjectsSection id="projects" $reduceMotion={$reduceMotion}>
            {/* Floating background shapes */}
            {!$reduceMotion && (
                <>
                    <FloatingShape
                        $reduceMotion={$reduceMotion}
                        size="180px"
                        bg="rgba(100, 255, 218, 0.05)"
                        radius="60% 40% 30% 70% / 60% 30% 70% 40%"
                        top="15%"
                        left="5%"
                        duration="22s"
                        moveX2="-25px"
                        moveY2="-35px"
                    />
                    <FloatingShape
                        $reduceMotion={$reduceMotion}
                        size="220px"
                        bg="rgba(138, 43, 226, 0.04)"
                        radius="30% 70% 70% 30% / 30% 30% 70% 70%"
                        bottom="5%"
                        right="8%"
                        duration="28s"
                        moveX2="35px"
                        moveY2="-45px"
                    />
                    <FloatingShape
                        $reduceMotion={$reduceMotion}
                        size="120px"
                        bg="rgba(25, 118, 210, 0.04)"
                        radius="50%"
                        top="55%"
                        left="12%"
                        duration="20s"
                        moveX2="-20px"
                        moveY2="40px"
                    />
                    <FloatingShape
                        $reduceMotion={$reduceMotion}
                        size="160px"
                        bg="rgba(255, 20, 147, 0.03)"
                        radius="40% 60% 60% 40% / 40% 40% 60% 60%"
                        top="80%"
                        right="25%"
                        duration="24s"
                        moveX2="-30px"
                        moveY2="25px"
                    />
                    <FloatingShape
                        $reduceMotion={$reduceMotion}
                        size="140px"
                        bg="rgba(0, 255, 255, 0.03)"
                        radius="70% 30% 30% 70% / 70% 70% 30% 30%"
                        top="35%"
                        right="5%"
                        duration="26s"
                        moveX2="25px"
                        moveY2="-35px"
                    />
                </>
            )}

            <ProjectsContainer
                variants={containerVariants}
                initial={!$reduceMotion ? "hidden" : undefined}
                whileInView={!$reduceMotion ? "show" : undefined}
                viewport={{ once: true, amount: 0.25 }}
                $reduceMotion={$reduceMotion}
            >
                <SectionTitle
                    variants={titleVariants}
                    $reduceMotion={$reduceMotion}
                >
                    Featured Projects
                </SectionTitle>

                <SectionSubtitle>
                    A showcase of my recent work featuring modern web applications built with cutting-edge technologies
                </SectionSubtitle>

                <ProjectsGrid>
                    {PROJECTS_DATA.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                        />
                    ))}
                </ProjectsGrid>
            </ProjectsContainer>
        </ProjectsSection>
    );
};

// Wrap with motion preference detection
export default () => {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(prefersReducedMotion());
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = () => setReduceMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return <Projects $reduceMotion={reduceMotion} />;
};