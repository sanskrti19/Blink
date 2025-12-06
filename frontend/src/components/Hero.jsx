 
import React from 'react';
import { Link } from 'react-router-dom';  

const Hero = () => {
  return (
    <section className="pt-24 pb-20 text-center px-4 bg-gray-50/50"> 
      <div className="max-w-5xl mx-auto">
        
        
        <h1 className="text-7xl md:text-8xl font-extrabold mb-6 leading-tight
        text-indigo-900">
          One place for all your 
          <span className="text-indigo-600 block sm:inline-block"> Chrome Bookmarks.</span>
        </h1>
         
        <p className="text-xl text-gray-500 mb-10 max-w-3xl mx-auto">
          Tired of chaotic browser folders? BLINK helps you save, tag, and search your links with the power of a modern workspace.
        </p>
    
        <Link 
          to="/login" 
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition duration-300 transform hover:scale-[1.02]"
        >
          Start Organizing — It's Free
        </Link>
        
        
        <p className="mt-4 text-sm text-gray-500">
          Already have an account? 
          <Link 
            to="/login"
            className="text-indigo-600 font-medium cursor-pointer hover:underline ml-1"
          >
            Log in here.
          </Link>
        </p>

        <div className="mt-16 w-full p-2 bg-white rounded-xl shadow-2xl border border-gray-100">
          
           <div className="w-full h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-inner flex flex-col items-center justify-center text-gray-500 text-lg font-medium relative overflow-hidden">
  <img 
    src="https://stories.freepiklabs.com/storage/101438/Laptop_Mesa-de-trabajo-1.svg" 
    alt="App Dashboard Placeholder"
    className="h-80 md:h-90 object-contain opacity-96 transition-transform duration-500 hover:scale-105"
  />
  <p className="mt-4 text-gray-600 text-center">
  {/* //  App Dashboard Screenshot Placeholder */}
  </p>
</div>

        </div>
      </div>
    </section>
  );
};

export default Hero;