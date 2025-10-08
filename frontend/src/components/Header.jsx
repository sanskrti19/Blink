// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/App Name: Link back to home */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold text-gray-800">
              <span className="text-indigo-600">B</span>LINK
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            {/* Note: using <a> for hash links to scroll to sections on the same page */}
            <a href="#features" className="text-gray-500 hover:text-indigo-600 transition duration-150 text-sm font-medium">
              Features
            </a>
            <a href="#about" className="text-gray-500 hover:text-indigo-600 transition duration-150 text-sm font-medium">
              About
            </a>
          </nav>
 
          {/* Login/Sign Up Buttons: Updated to use <Link> to the /login route */}
          <div className="flex items-center space-x-4">
            
            {/* 1. Log In Link */}
            <Link 
              to="/login" 
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition duration-150"
            >
              Log in
            </Link>
            
            {/* 2. Get BLINK Free (Sign Up) Link */}
            <Link 
              to="/login" // Directs to the same login page for now
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
            >
              Get BLINK Free
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;