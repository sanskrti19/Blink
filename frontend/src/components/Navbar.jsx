// src/components/Navbar.jsx
import React from "react"; // <-- add this
import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-black text-white p-4 flex justify-between items-center">
      <div className="text-xl font-bold">MyMusicApp</div>
      <ul className="flex space-x-4">
        <li>
          <NavLink to="/" className={({ isActive }) => isActive ? "text-red-500" : ""}>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className={({ isActive }) => isActive ? "text-red-500" : ""}>
            About
          </NavLink>
        </li>
        <li>
          <NavLink to="/contact" className={({ isActive }) => isActive ? "text-red-500" : ""}>
            Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
