// src/pages/LandingPage.jsx
import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features'; // Next step!
import Footer from '../components/Footer';     // Will build this later

const LandingPage = () => {
  return (
    // Use min-h-screen and flex-col to push the footer to the bottom
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        <Hero />
        {/* Features section will go here next, below the hero */}
        {/* <Features /> */} 
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;