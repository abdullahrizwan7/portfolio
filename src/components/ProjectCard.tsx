import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface ProjectData {
    id: number;
    title: string;
    description: string;
    image: string;
    tags: string[];
    github: string;
    link: string;
    current?: boolean;
}

interface ProjectCardProps {
    project: ProjectData;
}

const theme = {
    backgroundAlt: '#0a192f',
    cardBg: '#112240',
    primary: '#64ffda',
    text: '#e6f1ff',
    textAlt: '#8892b0',
    shadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const { title, description, image, tags, link, github, current } = project;

    return (
        <Card
            whileHover={{
                y: -10,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)"
            }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <ImageContainer>
                <ProjectImage src={image} alt={title} />
                {current && (
                    <CurrentBadge>Current</CurrentBadge>
                )}
                <Overlay>
                    <OverlayContent>
                        <ButtonGroup>
                            {link && (
                                <ProjectButton
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    View Live
                                </ProjectButton>
                            )}
                            {github && (
                                <ProjectButton
                                    href={github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    View Code
                                </ProjectButton>
                            )}
                        </ButtonGroup>
                    </OverlayContent>
                </Overlay>
            </ImageContainer>

            <Content>
                <Title>{title}</Title>
                <Description>{description}</Description>
                <TagContainer>
                    {tags.map((tag, index) => (
                        <Tag key={index}>{tag}</Tag>
                    ))}
                </TagContainer>
            </Content>
        </Card>
    );
};

const Card = styled(motion.div)`
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(25px) saturate(160%);
  -webkit-backdrop-filter: blur(25px) saturate(160%);
  border: 0.5px solid rgba(255, 255, 255, 0.18);
  border-radius: 16px;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.15),
    0 1px 8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  transform: translateZ(0);
  
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
    z-index: 1;
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
    z-index: 1;
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

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  height: 200px;
  z-index: 2;
  
  &:hover > div {
    opacity: 1;
  }
  
  @media (max-width: 768px) {
    height: 180px;
  }
  
  @media (max-width: 480px) {
    height: 160px;
  }
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${ImageContainer}:hover & {
    transform: scale(1.1);
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(10, 25, 47, 0.85);
  backdrop-filter: blur(15px) saturate(150%);
  -webkit-backdrop-filter: blur(15px) saturate(150%);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: all 0.3s ease;
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  
  /* Glass reflection for overlay */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.05) 0%,
      transparent 100%
    );
    pointer-events: none;
  }
`;

const CurrentBadge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(100, 255, 218, 0.9);
  color: #0a192f;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  z-index: 10;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(100, 255, 218, 0.3);
  box-shadow: 0 2px 8px rgba(100, 255, 218, 0.3);
`;

const OverlayContent = styled.div`
  text-align: center;
  padding: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const ProjectButton = styled(motion.a)`
  padding: 0.8rem 1.5rem;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  color: #e6f1ff;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 2px 12px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  /* Glass reflection */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.08) 0%,
      transparent 100%
    );
    border-radius: 12px 12px 0 0;
    pointer-events: none;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.18);
    border-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.05) translateY(-1px);
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(25px) saturate(170%);
  }
`;

const Content = styled.div`
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  
  @media (max-width: 768px) {
    padding: 1.2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Title = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
  color: #e6f1ff;
`;

const Description = styled.p`
  color: #8892b0;
  margin-bottom: 1.5rem;
  line-height: 1.6;
  flex: 1;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
`;

const Tag = styled.span`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border: 0.5px solid rgba(255, 255, 255, 0.2);
  color: #64ffda;
  padding: 0.4rem 0.9rem;
  border-radius: 16px;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
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
    border-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.05) translateY(-1px);
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(25px) saturate(170%);
  }
`;

export default ProjectCard;
