import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getOptimizedParticleCount, shouldDisableHeavyEffects, getOptimizedFrameRate } from '../utils/performanceOptimizer';

const ParticleBackground = () => {
  const containerRef = useRef(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Skip heavy effects on low-performance devices
    if (shouldDisableHeavyEffects()) {
      return;
    }
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: window.innerWidth > 768, // Disable antialiasing on mobile
      powerPreference: 'high-performance'
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
    containerRef.current.appendChild(renderer.domElement);
    
    // Create particles (optimized count)
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = getOptimizedParticleCount(1200);
    
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
    
    // Animation with optimized frame rate
    let lastTime = 0;
    const targetFPS = getOptimizedFrameRate();
    const interval = 1000 / targetFPS;
    
    const animate = (currentTime) => {
      requestAnimationFrame(animate);
      
      if (currentTime - lastTime >= interval) {
        const rotationSpeed = targetFPS === 30 ? 0.0003 : 0.0005;
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