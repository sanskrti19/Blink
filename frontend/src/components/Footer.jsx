// src/components/Footer.jsx
import React from "react"; // <-- needed for JSX
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-8 px-6 text-center">
      <div className="mb-4">
        <h2 className="text-xl font-bold">MyMusicApp</h2>
        <p className="text-gray-400">Share music and connect with friends anywhere.</p>
      </div>
      <div className="flex justify-center space-x-6 mb-4">
        <Link to="/" className="hover:text-red-500 transition">Home</Link>
        <Link to="/about" className="hover:text-red-500 transition">About</Link>
        <Link to="/contact" className="hover:text-red-500 transition">Contact</Link>
      </div>
      <p className="text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} MyMusicApp. All rights reserved.
      </p>
    </footer>
  );
}
