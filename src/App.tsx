import React, { Suspense, lazy } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import PerformanceIndicator from './components/PerformanceIndicator';
import './App.css';

// Lazy load heavy components for better performance
const About = lazy(() => import('./components/About'));
const Skills = lazy(() => import('./components/Skills'));
const Projects = lazy(() => import('./components/Projects'));
const Contact = lazy(() => import('./components/Contact'));
const Footer = lazy(() => import('./components/Footer'));
const ParticleBackground = lazy(() => import('./components/ParticleBackground'));

// Loading fallback component
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100px',
    opacity: 0.7
  }}>
    <div>Loading...</div>
  </div>
);

const App = () => {
  return (
    <div className="App">
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>
      <PerformanceIndicator />
      <Navbar />
      <main>
        <Home />
        <Suspense fallback={<LoadingFallback />}>
          <About />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <Skills />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<LoadingFallback />}>
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default App;