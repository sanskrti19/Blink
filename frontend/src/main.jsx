import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features'; 
import Footer from './components/Footer';

const LandingPage = () => {
  return (
    // min-h-screen and flex-col ensures the footer is always at the bottom
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        <Hero />
        {/* Features has an ID, linking it to the Header's navigation */}
        <div id="features">
          <Features />
        </div>
        {/* Optional: Add a section for 'About' here if you want to use the #about link */}
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;