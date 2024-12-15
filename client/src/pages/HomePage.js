import React from 'react';
import Hero from '../components/Hero';
import Features from '../components/Features';
import AnimatedPage from '../components/AnimatedPage';

const HomePage = () => {
  return (
    <AnimatedPage>
      <Hero />
      <Features />
    </AnimatedPage>
  );
};

export default HomePage;
