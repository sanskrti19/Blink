
import React from 'react';

import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features'; 
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        <Hero />
        

        <div id="features">
          <Features />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;