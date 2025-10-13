// src/pages/LandingPage.jsx (CORRECTED)
import React from 'react';
// 🛑 FIX 3: Use '../components/' to reach the component folder from the 'pages' folder
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
        <div id="features">
          <Features />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;