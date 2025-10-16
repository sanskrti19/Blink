
import React from "react"; 
import { NavLink } from "react-router-dom";

export default function Navbar() {

  const baseClasses = "text-gray-600 hover:text-indigo-600 font-medium transition duration-150 p-2 rounded-lg";

  const activeClasses = "text-indigo-600 bg-indigo-50/50";

  return (

    <nav className="bg-white p-2 flex justify-start items-center space-x-2">
     
      
      <ul className="flex space-x-1">
        <li>
          <NavLink 
            to="/" 
          
            className={({ isActive }) => 
              `${baseClasses} ${isActive ? activeClasses : ""}`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/home" 
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