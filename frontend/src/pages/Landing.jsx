// src/pages/LandingPage.jsx
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features'; 
import Footer from '../components/Footer'; 

const LandingPage = () => {
  return (
    
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        <Hero />
        
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;