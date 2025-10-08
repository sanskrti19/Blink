// src/components/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // <-- Import Link

const Hero = () => {
  return (
    <section className="pt-24 pb-20 text-center px-4 bg-gray-50/50"> 
      <div className="max-w-5xl mx-auto">
        
        {/* Main Tagline */}
        <h1 className="text-7xl md:text-8xl font-extrabold mb-6 leading-tight">
          One place for all your 
          <span className="text-indigo-600 block sm:inline-block"> Chrome Bookmarks.</span>
        </h1>
        
        {/* Sub-headline */}
        <p className="text-xl text-gray-500 mb-10 max-w-3xl mx-auto">
          Tired of chaotic browser folders? BLINK helps you save, tag, and search your links with the power of a modern workspace.
        </p>
        
        {/* Call-to-Action (CTA) Button */}
        <Link 
          to="/login" // <-- Replaced <button> with <Link> to navigate to login/sign-up
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.02]"
        >
          Start Organizing — It's Free
        </Link>
        
        {/* Subtle secondary action */}
        <p className="mt-4 text-sm text-gray-500">
          Already have an account? 
          <Link 
            to="/login" // <-- Replaced <span> with <Link> for navigation
            className="text-indigo-600 font-medium cursor-pointer hover:underline ml-1"
          >
            Log in here.
          </Link>
        </p>

        {/* Placeholder for the App Mockup */}
        <div className="mt-16 w-full p-2 bg-white rounded-xl shadow-2xl border border-gray-100">
            {/* A realistic, clean image of your app's dashboard will go here. */}
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-lg">
                App Dashboard Screenshot Placeholder
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;