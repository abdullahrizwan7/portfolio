import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { motion, PanInfo } from 'framer-motion';
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
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: rgba(100, 255, 218, 0.1);
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 768px) {
    display: block;
  }
  
  @media (max-width: 480px) {
    font-size: 1.3rem;
    padding: 0.4rem;
  }
`;

const MobileMenu = styled(motion.div)`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 80%;
    max-width: 320px;
    padding: 80px 2rem 2rem;
    background: linear-gradient(135deg, #0a192f 0%, #112240 50%, #1a365d 100%);
    backdrop-filter: blur(20px);
    box-shadow: -15px 0px 40px -10px rgba(2, 12, 27, 0.8);
    border-left: 1px solid rgba(100, 255, 218, 0.1);
    z-index: 100;
    overflow-y: auto;
    touch-action: pan-x;
    user-select: none;
  }
  
  @media (max-width: 480px) {
    width: 85%;
    max-width: 280px;
    padding: 70px 1.5rem 2rem;
  }
`;

const MobileCloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: #64ffda;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  z-index: 101;
  
  &:hover {
    background: rgba(100, 255, 218, 0.1);
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 480px) {
    top: 15px;
    right: 15px;
    font-size: 1.3rem;
    padding: 0.4rem;
  }
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2.5rem;
  width: 100%;
  
  @media (max-width: 480px) {
    gap: 1.2rem;
    margin-bottom: 2rem;
  }
`;

const MobileNavLink = styled(Link)`
  color: #ccd6f6;
  font-size: 1.1rem;
  font-weight: 500;
  text-decoration: none;
  padding: 0.8rem 1.5rem;
  width: 100%;
  text-align: center;
  cursor: pointer;
  border-radius: 8px;
  position: relative;
  transition: all 0.3s ease;
  background: transparent;
  border: 1px solid transparent;
  
  &:hover {
    color: #64ffda;
    background: rgba(100, 255, 218, 0.1);
    border-color: rgba(100, 255, 218, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(100, 255, 218, 0.15);
  }
  
  &.active {
    color: #64ffda;
    background: rgba(100, 255, 218, 0.08);
    border-color: rgba(100, 255, 218, 0.3);
  }
  
  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.7rem 1.2rem;
  }
`;

const SwipeOverlay = styled(motion.div)`
  display: none;
  
  @media (max-width: 768px) {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 99;
    backdrop-filter: blur(5px);
  }
`;

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dragX, setDragX] = useState(0);
  
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
  
  // Handle swipe gestures
  const handleSwipeStart = () => {
    setDragX(0);
  };
  
  const handleSwipe = (event: any, info: PanInfo) => {
    setDragX(info.offset.x);
  };
  
  const handleSwipeEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = 100;
    const velocityThreshold = 500;
    
    // Swipe right to open menu (from left edge)
    if (!isOpen && info.offset.x > swipeThreshold && info.velocity.x > 0) {
      setIsOpen(true);
    }
    // Swipe left to close menu
    else if (isOpen && (info.offset.x < -swipeThreshold || info.velocity.x < -velocityThreshold)) {
      setIsOpen(false);
    }
    
    setDragX(0);
  };
  
  const navItems = [
    { name: 'Home', to: 'home' },
    { name: 'About', to: 'about' },
    { name: 'Skills', to: 'skills' },
    { name: 'Projects', to: 'projects' },
    { name: 'Contact', to: 'contact' }
  ];
  
  return (
    <>
      <NavbarContainer 
        scrolled={scrolled}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        onPanStart={handleSwipeStart}
        onPan={handleSwipe}
        onPanEnd={handleSwipeEnd}
      >
      <NavContent>
        <Logo
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link to="home" smooth={true} duration={500} onClick={closeMenu}>
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
      </NavContent>
    </NavbarContainer>
        
        {isOpen && (
          <>
            <SwipeOverlay
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
            />
            <MobileMenu
              initial={{ x: 300, opacity: 0, scale: 0.9 }}
              animate={{ 
                x: Math.max(0, dragX), 
                opacity: 1, 
                scale: 1 
              }}
              exit={{ x: 300, opacity: 0, scale: 0.9 }}
              transition={{ 
                type: 'spring', 
                stiffness: 400, 
                damping: 35,
                duration: 0.3
              }}
              drag="x"
              dragConstraints={{ left: -50, right: 300 }}
              dragElastic={0.2}
              onDragStart={handleSwipeStart}
              onDrag={handleSwipe}
              onDragEnd={handleSwipeEnd}
            >
              <MobileCloseButton onClick={closeMenu}>
                <FiX />
              </MobileCloseButton>
              
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
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              style={{ 
                marginTop: '1rem',
                background: 'rgba(100, 255, 218, 0.05)',
                backdropFilter: 'blur(10px)'
              }}
            >
              Resume
            </ResumeButton>
            </MobileMenu>
          </>
        )}
    </>
  );
};

export default Navbar;
