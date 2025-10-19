import React from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";

const Landing = () => {
  return (
    <div className="relative min-h-screen flex flex-col font-sans bg-gradient-to-b from-purple-50 to-indigo-100 animate-gradient-y overflow-hidden">

      {/* Floating Background Blobs */}
      <div className="absolute w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-float top-10 left-10"></div>
      <div className="absolute w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-float animation-delay-2000 top-32 right-20"></div>
      <div className="absolute w-48 h-48 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-float animation-delay-4000 bottom-20 left-24"></div>

      {/* Header */}
      <Header className="bg-transparent text-purple-700 relative z-10" />

      {/* Main Content */}
      <main className="flex-grow relative z-10">
        {/* Hero Section */}
        <Hero className="text-purple-800 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-6">
            Connect. <span className="text-indigo-600">Create.</span> Collaborate.
          </h1>
          <p className="text-center text-purple-700/80 text-lg md:text-xl mb-8">
            Build amazing connections and projects with B-link.
          </p>
          <div className="flex justify-center">
            <button className="px-6 py-3 rounded-full bg-purple-500 text-white font-bold hover:scale-105 hover:shadow-lg hover:bg-indigo-500 transition-all duration-300">
              Get Started
            </button>
          </div>
        </Hero>

        {/* Features Section */}
        <div id="features" className="py-16 bg-purple-50/50 backdrop-blur-md relative z-10">
          <Features />
        </div>
      </main>

      {/* Footer */}
      <Footer className="bg-purple-200 text-purple-900 relative z-10" />
    </div>
  );
};

export default Landing;
