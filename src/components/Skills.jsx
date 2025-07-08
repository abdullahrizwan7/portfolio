import React, { useState, useEffect, useRef } from 'react';
import {
    FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs,
    FaGitAlt, FaDatabase, FaServer, FaMobile, FaTools
} from 'react-icons/fa';
import { SiTypescript, SiMongodb, SiExpress, SiTailwindcss, SiRedux } from 'react-icons/si';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { fadeIn, staggerContainer, textVariant } from '../animations';

// Optimized Styled Components
const SkillsSection = styled.section`
  min-height: 100vh;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #0a192f 0%, #1a202c 50%, #2d3748 100%);
  position: relative;
  overflow: hidden;
  
  /* Simplified background pattern */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.3), transparent),
      radial-gradient(1px 1px at 90px 40px, rgba(100,255,218,0.4), transparent),
      radial-gradient(2px 2px at 160px 80px, rgba(255,255,255,0.3), transparent);
    background-repeat: repeat;
    background-size: 200px 200px;
    animation: gentleTwinkle 6s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: 1;
  }
  
  @keyframes gentleTwinkle {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.6; }
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1rem;
    min-height: auto;
    
    &::before {
      background-size: 150px 150px;
    }
  }
`;

const SkillsContainer = styled(motion.div)`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 3;
  width: 100%;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    padding: 2rem;
    margin: 0 0.5rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.5rem;
    margin: 0;
  }
`;

const SectionTitle = styled(motion.h2)`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #64ffda, #a5ffea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const SectionSubtitle = styled.p`
  color: #8892b0;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto 2.5rem auto;
  line-height: 1.6;
  text-align: center;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2rem;
  }
`;

const SkillsContent = styled.div`
  position: relative;
  z-index: 2;
`;

const SkillsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  
  @media (max-width: 768px) {
    gap: 1.5rem;
  }
`;

const CategorySection = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
  }
  
  @media (max-width: 768px) {
    padding: 1.2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  .category-icon {
    font-size: 1.6rem;
    color: #64ffda;
  }
  
  .category-title {
    font-size: 1.3rem;
    color: #e6f1ff;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 1rem;
    
    .category-icon {
      font-size: 1.4rem;
    }
    
    .category-title {
      font-size: 1.1rem;
    }
  }
`;

const SkillsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 0.8rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 0.6rem;
  }
`;

const SkillCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-height: 120px;
  justify-content: center;
  
  &:hover {
    border-color: rgba(100, 255, 218, 0.3);
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }
  
  @media (max-width: 768px) {
    padding: 0.8rem;
    min-height: 100px;
  }
  
  @media (max-width: 480px) {
    padding: 0.6rem;
    min-height: 80px;
  }
`;

const SkillIcon = styled.div`
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
  }
`;

const SkillName = styled.div`
  font-size: 0.9rem;
  color: #ccd6f6;
  font-weight: 500;
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.7rem;
  }
`;

const SkillProgressContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  margin-top: 0.5rem;
`;

const SkillProgressBar = styled.div`
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 5px;
  }
  
  @media (max-width: 480px) {
    height: 4px;
  }
`;

const SkillProgressFill = styled(motion.div)`
  height: 100%;
  border-radius: 3px;
  position: relative;
`;

const SkillPercentage = styled.div`
  font-size: 0.75rem;
  color: #64ffda;
  font-weight: 600;
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
  
  @media (max-width: 480px) {
    font-size: 0.65rem;
  }
`;

const Skills = () => {
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef(null);

    // Skills data organized by categories
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

    // Observer to trigger animations when section is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <SkillsSection id="skills" ref={sectionRef}>
            <SkillsContainer
                variants={staggerContainer(0.1, 0.1)}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.25 }}
            >
                <SectionTitle variants={textVariant(0.1)}>
                    TECHNICAL EXPERTISE
                </SectionTitle>

                <SectionSubtitle>
                    My technical skills with proficiency levels
                </SectionSubtitle>

                <SkillsContent>
                    <SkillsGrid>
                        <CategorySection>
                            <CategoryHeader>
                                <FaReact className="category-icon" />
                                <span className="category-title">Frontend</span>
                            </CategoryHeader>
                            <SkillsRow>
                                {skillsData.frontend.map((skill, index) => (
                                    <SkillCard
                                        key={skill.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                    >
                                        <SkillIcon style={{ color: skill.color }}>
                                            {skill.icon}
                                        </SkillIcon>
                                        <SkillName>{skill.name}</SkillName>
                                        <SkillProgressContainer>
                                            <SkillProgressBar>
                                                <SkillProgressFill
                                                    style={{ backgroundColor: skill.color }}
                                                    initial={{ width: 0 }}
                                                    animate={isVisible ? { width: `${skill.level}%` } : { width: 0 }}
                                                    transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
                                                />
                                            </SkillProgressBar>
                                            <SkillPercentage>{skill.level}%</SkillPercentage>
                                        </SkillProgressContainer>
                                    </SkillCard>
                                ))}
                            </SkillsRow>
                        </CategorySection>

                        <CategorySection>
                            <CategoryHeader>
                                <FaNodeJs className="category-icon" />
                                <span className="category-title">Backend</span>
                            </CategoryHeader>
                            <SkillsRow>
                                {skillsData.backend.map((skill, index) => (
                                    <SkillCard
                                        key={skill.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                                        transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                                    >
                                        <SkillIcon style={{ color: skill.color }}>
                                            {skill.icon}
                                        </SkillIcon>
                                        <SkillName>{skill.name}</SkillName>
                                        <SkillProgressContainer>
                                            <SkillProgressBar>
                                                <SkillProgressFill
                                                    style={{ backgroundColor: skill.color }}
                                                    initial={{ width: 0 }}
                                                    animate={isVisible ? { width: `${skill.level}%` } : { width: 0 }}
                                                    transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
                                                />
                                            </SkillProgressBar>
                                            <SkillPercentage>{skill.level}%</SkillPercentage>
                                        </SkillProgressContainer>
                                    </SkillCard>
                                ))}
                            </SkillsRow>
                        </CategorySection>

                        <CategorySection>
                            <CategoryHeader>
                                <FaTools className="category-icon" />
                                <span className="category-title">Tools</span>
                            </CategoryHeader>
                            <SkillsRow>
                                {skillsData.tools.map((skill, index) => (
                                    <SkillCard
                                        key={skill.name}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                                        transition={{ duration: 0.3, delay: 0.2 + index * 0.05 }}
                                    >
                                        <SkillIcon style={{ color: skill.color }}>
                                            {skill.icon}
                                        </SkillIcon>
                                        <SkillName>{skill.name}</SkillName>
                                        <SkillProgressContainer>
                                            <SkillProgressBar>
                                                <SkillProgressFill
                                                    style={{ backgroundColor: skill.color }}
                                                    initial={{ width: 0 }}
                                                    animate={isVisible ? { width: `${skill.level}%` } : { width: 0 }}
                                                    transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                                                />
                                            </SkillProgressBar>
                                            <SkillPercentage>{skill.level}%</SkillPercentage>
                                        </SkillProgressContainer>
                                    </SkillCard>
                                ))}
                            </SkillsRow>
                        </CategorySection>
                    </SkillsGrid>
                </SkillsContent>
            </SkillsContainer>
        </SkillsSection>
    );
};

export default Skills;
