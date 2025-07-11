import React from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import PerformanceIndicator from './components/PerformanceIndicator';
import ParticleBackground from './components/ParticleBackground';
import './App.css';

const App = () => {
  return (
    <div className="App">
      <ParticleBackground />
      <PerformanceIndicator />
      <Navbar />
      <main>
        <Home />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;