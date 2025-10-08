// src/components/Navbar.jsx
import React from "react"; 
import { NavLink } from "react-router-dom";

export default function Navbar() {
  // Define base classes for all links
  const baseClasses = "text-gray-600 hover:text-indigo-600 font-medium transition duration-150 p-2 rounded-lg";
  
  // Define active classes using the indigo accent color
  const activeClasses = "text-indigo-600 bg-indigo-50/50";

  return (
    // Clean, white background, suitable for internal app navigation or a clean landing page nav
    <nav className="bg-white p-2 flex justify-start items-center space-x-2">
      
      {/* NOTE: If this Navbar is used inside the main BLINK application 
        (e.g., in the Dashboard), the branding/logo should typically go elsewhere. 
        We're focusing purely on navigation links here.
      */}
      
      <ul className="flex space-x-1">
        <li>
          <NavLink 
            to="/" 
            // Use the functional form to apply classes conditionally
            className={({ isActive }) => 
              `${baseClasses} ${isActive ? activeClasses : ""}`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => 
              `${baseClasses} ${isActive ? activeClasses : ""}`
            }
          >
            My Bookmarks
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/settings" 
            className={({ isActive }) => 
              `${baseClasses} ${isActive ? activeClasses : ""}`
            }
          >
            Settings
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}