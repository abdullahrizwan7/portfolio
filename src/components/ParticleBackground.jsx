import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ParticleBackground = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create particles (optimized count)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = window.innerWidth < 768 ? 500 : window.innerWidth < 1200 ? 800 : 1200;
    
    const posArray = new Float32Array(particlesCount * 3);
    const colorsArray = new Float32Array(particlesCount * 3);
    
    // Fill with random positions and colors
    for (let i = 0; i < particlesCount * 3; i++) {
      // Position
      posArray[i] = (Math.random() - 0.5) * 5;
      
      // Colors - create gradient effect
      colorsArray[i] = Math.random();
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));
    
    // Material with custom vertex colors (optimized)
    const particlesMaterial = new THREE.PointsMaterial({
      size: window.innerWidth < 768 ? 0.015 : 0.02,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      alphaTest: 0.1 // Performance optimization
    });
    
    // Create the particle system
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    camera.position.z = 2;
    
    // Animation with performance optimization
    let lastTime = 0;
    const animate = (currentTime) => {
      requestAnimationFrame(animate);
      
      // Throttle animation on mobile
      const isMobile = window.innerWidth < 768;
      const targetFPS = isMobile ? 30 : 60;
      const interval = 1000 / targetFPS;
      
      if (currentTime - lastTime >= interval) {
        const rotationSpeed = isMobile ? 0.0003 : 0.0005;
        particlesMesh.rotation.x += rotationSpeed;
        particlesMesh.rotation.y += rotationSpeed;
        
        renderer.render(scene, camera);
        lastTime = currentTime;
      }
    };
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      renderer.dispose();
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        overflow: 'hidden'
      }}
    />
  );
};

export default ParticleBackground;