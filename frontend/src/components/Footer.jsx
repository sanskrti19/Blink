 
import React from "react"; 
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
 
    <footer className="bg-gray-50 border-t border-gray-200 py-10 px-6 text-center">
      <div className="max-w-7xl mx-auto">
        
      
        <div className="mb-6">
          <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-red-600 transition duration-150">
            <span className="text-indigo-600">B</span>LINK
          </Link>
          <p className="text-gray-500 mt-2 text-sm">Organize your links, beautifully.</p>
        </div>
        
         
        <div className="flex justify-center space-x-8 text-sm text-gray-600 mb-6">
          <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
          <Link to="/features" className="hover:text-indigo-600 transition">Features</Link>
       
          <Link to="/terms" className="hover:text-indigo-600 transition">Terms</Link>
          <Link to="/privacy" className="hover:text-indigo-600 transition">Privacy</Link>
        </div>
        
  
        <p className="text-gray-500 text-xs">
          &copy; {currentYear} BLINK. All rights reserved.
        </p>
        
      </div>
    </footer>
  );
}