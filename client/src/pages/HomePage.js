import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import CodeDemo from '../components/CodeDemo';
import Benefits from '../components/Benefits';
import AnimatedPage from '../components/AnimatedPage';

const HomePage = () => {
  return (
    <AnimatedPage>
      <Hero />
      <Features />
      <CodeDemo />
      <Benefits />
    </AnimatedPage>
  );
};

export default HomePage;
