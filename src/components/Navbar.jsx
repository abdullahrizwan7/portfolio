import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';
import { FiMenu, FiX } from 'react-icons/fi';
import { Link } from 'react-scroll';

// Enhanced styled components for your existing Navbar
const NavbarContainer = styled(motion.nav)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 0 2rem;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  background: ${({ scrolled }) => 
    scrolled ? 'rgba(10, 25, 47, 0.85)' : 'transparent'};
  box-shadow: ${({ scrolled }) => 
    scrolled ? '0 10px 30px -10px rgba(2, 12, 27, 0.7)' : 'none'};
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  height: 70px;
  
  @media (max-width: 768px) {
    height: 60px;
  }
`;

const Logo = styled(motion.div)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #64ffda;
  cursor: pointer;
  
  span {
    display: inline-block;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 2px;
      bottom: 0;
      left: 0;
      background-color: #64ffda;
      transform: scaleX(0);
      transform-origin: bottom right;
      transition: transform 0.3s ease;
    }
    
    &:hover::after {
      transform: scaleX(1);
      transform-origin: bottom left;
    }
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #ccd6f6;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem;
  position: relative;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: #64ffda;
    transform: scaleX(0);
    transform-origin: bottom right;
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: #64ffda;
  }
  
  &:hover::after,
  &.active::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }
  
  &.active {
    color: #64ffda;
  }
`;

const ResumeButton = styled(motion.a)`
  padding: 0.75rem 1rem;
  background: transparent;
  color: #64ffda;
  border: 1px solid #64ffda;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(100, 255, 218, 0.1);
    box-shadow: 0 0 10px rgba(100, 255, 218, 0.5);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: #64ffda;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 101;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 75%;
    max-width: 300px;
    padding: 2rem;
    background: #112240;
    box-shadow: -10px 0px 30px -15px rgba(2, 12, 27, 0.7);
    z-index: 100;
  }
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  width: 100%;
`;

const MobileNavLink = styled(Link)`
  color: #ccd6f6;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  padding: 0.5rem;
  width: 100%;
  text-align: center;
  cursor: pointer;
  transition: color 0.3s ease;
  
  &:hover {
    color: #64ffda;
  }
  
  &.active {
    color: #64ffda;
  }
`;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Close mobile menu when window is resized to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isOpen) {
        setIsOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);
  
  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  const closeMenu = () => setIsOpen(false);
  
  const navItems = [
    { name: 'Home', to: 'home' },
    { name: 'About', to: 'about' },
    { name: 'Skills', to: 'skills' },
    { name: 'Projects', to: 'projects' },
    { name: 'Contact', to: 'contact' }
  ];
  
  return (
    <NavbarContainer 
      scrolled={scrolled}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <NavContent>
        <Logo
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="hero" smooth={true} duration={500} onClick={closeMenu}>
            <span>{'<Portfolio />'}</span>
          </Link>
        </Logo>
        
        <NavLinks>
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              smooth={true}
              duration={500}
              spy={true}
              activeClass="active"
              offset={-70}
            >
              {item.name}
            </NavLink>
          ))}
          
          <ResumeButton
            href="./resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Resume
          </ResumeButton>
        </NavLinks>
        
        <MobileMenuButton onClick={toggleMenu}>
          {isOpen ? <FiX /> : <FiMenu />}
        </MobileMenuButton>
        
        {isOpen && (
          <MobileMenu
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <MobileNavLinks>
              {navItems.map((item, index) => (
                <MobileNavLink
                  key={index}
                  to={item.to}
                  smooth={true}
                  duration={500}
                  spy={true}
                  activeClass="active"
                  offset={-60}
                  onClick={closeMenu}
                >
                  {item.name}
                </MobileNavLink>
              ))}
            </MobileNavLinks>
            
            <ResumeButton
              href="./resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Resume
            </ResumeButton>
          </MobileMenu>
        )}
      </NavContent>
    </NavbarContainer>
  );
};

export default Navbar;
