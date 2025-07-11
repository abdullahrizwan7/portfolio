import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
    FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs,
    FaGitAlt, FaDatabase, FaServer, FaMobile, FaTools
} from 'react-icons/fa';
import { SiTypescript, SiMongodb, SiExpress, SiTailwindcss, SiRedux } from 'react-icons/si';
import { motion } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import { fadeIn, staggerContainer, textVariant } from '../animations';
import { shouldDisableHeavyEffects } from '../utils/performanceOptimizer'; // Add this import

// Remove LiquidBackground styled component and its usage

// Add keyframes and SkillsSection from About.jsx
const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(180deg); }
`;

const twinkle = keyframes`
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const SkillsSection = styled.section`
  padding: 4rem 2rem;
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

const GlassContainer = styled(motion.div)`
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 3rem;
  background: linear-gradient(120deg, rgba(40,44,52,0.7) 60%, rgba(100,255,218,0.12) 100%);
  border-radius: 32px;
  box-shadow: 0 8px 32px 0 rgba(31,38,135,0.37);
  backdrop-filter: blur(${window.innerWidth < 768 ? 8 : 18}px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.18);
  z-index: 2;
  position: relative;
  @media (max-width: 768px) { padding: 2rem; }
  @media (max-width: 480px) { padding: 1rem; }
`;

const SectionTitle = styled(motion.h2)`
  font-size: 2.8rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, #64ffda, #a5ffea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
`;

const SectionSubtitle = styled.p`
  color: #b2becd;
  font-size: 1.15rem;
  margin: 0 auto 2rem auto;
  text-align: center;
`;

const SkillsGrid = styled.div`
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
  @media (max-width: 900px) { flex-direction: column; gap: 1.5rem; }
`;

const CategorySection = styled(motion.div)`
  flex: 1;
  min-width: 280px;
  background: rgba(255,255,255,0.05);
  border-radius: 20px;
  padding: 1.5rem 1rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 8px 32px rgba(100,255,218,0.12); }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1.2rem;
  .category-icon-bg {
    background: linear-gradient(135deg, #64ffda 60%, #232526 100%);
    border-radius: 50%;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(100,255,218,0.15);
  }
  .category-title {
    font-size: 1.2rem;
    color: #e6f1ff;
    font-weight: 700;
    letter-spacing: 1px;
  }
`;

const SkillsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 1rem;
`;

const SkillCard = styled(motion.div)`
  background: rgba(255,255,255,0.08);
  border-radius: 14px;
  padding: 1rem 0.5rem;
  text-align: center;
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 2px 8px rgba(100,255,218,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  min-height: 110px;
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 16px rgba(100,255,218,0.18);
    border-color: #64ffda;
  }
`;

const SkillIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.2rem;
`;

const SkillName = styled.div`
  font-size: 0.95rem;
  color: #ccd6f6;
  font-weight: 600;
`;

const SkillProgressBar = styled.div`
  width: 90%;
  height: 7px;
  background: rgba(255,255,255,0.13);
  border-radius: 4px;
  margin: 0.3rem auto 0.1rem auto;
  overflow: hidden;
`;

const SkillProgressFill = styled(motion.div)`
  height: 100%;
  border-radius: 4px;
`;

const SkillPercentage = styled.div`
  font-size: 0.8rem;
  color: #64ffda;
  font-weight: 700;
`;

const skillsData = {
    frontend: [
        { name: 'HTML5', icon: <FaHtml5 />, level: 95, color: '#e44d26' },
        { name: 'CSS3', icon: <FaCss3Alt />, level: 92, color: '#264de4' },
        { name: 'JavaScript', icon: <FaJs />, level: 90, color: '#f0db4f' },
        { name: 'React', icon: <FaReact />, level: 93, color: '#61dbfb' },
        { name: 'TypeScript', icon: <SiTypescript />, level: 87, color: '#007acc' },
        { name: 'Redux', icon: <SiRedux />, level: 88, color: '#764abc' },
        { name: 'Tailwind', icon: <SiTailwindcss />, level: 90, color: '#38b2ac' },
    ],
    backend: [
        { name: 'Node.js', icon: <FaNodeJs />, level: 90, color: '#68a063' },
        { name: 'Express', icon: <SiExpress />, level: 88, color: '#ffffff' },
        { name: 'MongoDB', icon: <SiMongodb />, level: 85, color: '#4db33d' },
        { name: 'REST APIs', icon: <FaServer />, level: 92, color: '#009688' },
        { name: 'SQL', icon: <FaDatabase />, level: 82, color: '#00758f' },
    ],
    tools: [
        { name: 'Git', icon: <FaGitAlt />, level: 93, color: '#f14e32' },
        { name: 'Responsive', icon: <FaMobile />, level: 95, color: '#7d7d7d' },
        { name: 'DevOps', icon: <FaTools />, level: 80, color: '#2496ed' },
    ]
};

const categoryIcons = {
    frontend: <FaReact />,
    backend: <FaNodeJs />,
    tools: <FaTools />
};

const Skills = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    // Detect if heavy effects should be disabled (mobile/low-end)
    const disableAnimations = shouldDisableHeavyEffects() || window.innerWidth < 768;

    useEffect(() => {
        if (disableAnimations) {
            setIsVisible(true); // Always visible, no animation
            return;
        }
        const observer = new window.IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.2 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, [disableAnimations]);

    // Memoize skill cards for performance
    const renderSkills = useMemo(() => (category) =>
        skillsData[category].map((skill, idx) => (
            <SkillCard
                key={skill.name}
                initial={disableAnimations ? false : { opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={disableAnimations ? {} : { duration: 0.3, delay: idx * 0.07 }}
            >
                <SkillIcon style={{ color: skill.color }}>{skill.icon}</SkillIcon>
                <SkillName>{skill.name}</SkillName>
                <SkillProgressBar>
                    <SkillProgressFill
                        style={{ background: `linear-gradient(90deg, ${skill.color} 70%, #232526 100%)` }}
                        initial={disableAnimations ? false : { width: 0 }}
                        animate={isVisible ? { width: `${skill.level}%` } : { width: 0 }}
                        transition={disableAnimations ? {} : { duration: 0.7, delay: 0.2 + idx * 0.09 }}
                    />
                </SkillProgressBar>
                <SkillPercentage>{skill.level}%</SkillPercentage>
            </SkillCard>
        ))
    , [isVisible, disableAnimations]);

    return (
        <SkillsSection id="skills" ref={sectionRef}>
            {/* <LiquidBackground /> <-- REMOVE THIS LINE */}
            <GlassContainer
                variants={disableAnimations ? undefined : staggerContainer(0.1, 0.1)}
                initial={disableAnimations ? undefined : "hidden"}
                whileInView={disableAnimations ? undefined : "show"}
                viewport={disableAnimations ? undefined : { once: true, amount: 0.2 }}
            >
                <SectionTitle variants={disableAnimations ? undefined : textVariant(0.1)}>
                    TECHNICAL EXPERTISE
                </SectionTitle>
                <SectionSubtitle>
                    My technical skills with proficiency levels
                </SectionSubtitle>
                <SkillsGrid>
                    {Object.keys(skillsData).map((category, i) => (
                        <CategorySection
                            key={category}
                            initial={disableAnimations ? false : { opacity: 0, y: 30 }}
                            animate={isVisible ? { opacity: 1, y: 0 } : {}}
                            transition={disableAnimations ? {} : { duration: 0.4, delay: i * 0.15 }}
                        >
                            <CategoryHeader>
                                <span className="category-icon-bg">
                                    {categoryIcons[category]}
                                </span>
                                <span className="category-title">
                                    {category.charAt(0).toUpperCase() + category.slice(1)}
                                </span>
                            </CategoryHeader>
                            <SkillsRow>
                                {renderSkills(category)}
                            </SkillsRow>
                        </CategorySection>
                    ))}
                </SkillsGrid>
            </GlassContainer>
        </SkillsSection>
    );
};

export default Skills;
