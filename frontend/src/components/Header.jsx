// src/components/Header.jsx

import React from 'react';
// Assuming you have a globe or similar icon for the app logo/name

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/App Name */}
          <div className="flex-shrink-0 flex items-center">
            {/* Replace with your actual icon */}
            <span className="text-2xl font-bold text-gray-800">
              <span className="text-indigo-600">B</span>LINK
            </span>
          </div>

          {/* Navigation Links (If needed, keeping it simple for now) */}
          {/* Note: In a Notion style, often the landing page is simple, 
             and main navigation is inside the app. */}
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-500 hover:text-indigo-600 transition duration-150 text-sm font-medium">
              Features
            </a>
            <a href="#about" className="text-gray-500 hover:text-indigo-600 transition duration-150 text-sm font-medium">
              About
            </a>
          </nav>

          {/* Login/Sign Up Buttons */}
          <div className="flex items-center space-x-4">
            {/* The Login component will handle the actual Firebase login logic later */}
            <button className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition duration-150">
              Log in
            </button>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300">
              Get BLINK Free
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;