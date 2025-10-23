import React from "react";
import { Home, Plus, Tag, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SideNav = ({ onAddClick, onLogout, isCollapsed, toggleCollapse }) => {
  const navigate = useNavigate();

  const handleTagsClick = () => {
    console.log("Navigating to Tags/Filter by Tags");
  };

  const navItems = [
    { label: "Dashboard", icon: <Home className="w-5 h-5" />, action: () => navigate("/dashboard") },
    { label: "Tags", icon: <Tag className="w-5 h-5" />, action: handleTagsClick },
    { label: "Add Bookmark", icon: <Plus className="w-5 h-5" />, action: onAddClick },
  ];

  return (
    <aside
      className={`
        ${isCollapsed ? 'w-20 items-center' : 'w-64'} 
        min-h-screen bg-purple-800 text-white flex flex-col p-4 space-y-8 shadow-2xl transition-all duration-300
      `}
    >
      
      <div className={`flex flex-col items-center ${isCollapsed ? 'space-y-3' : 'space-y-2'}`}>
        <img
          src="https://stories.freepiklabs.com/api/vectors/bookmarks/rafiki/render?color=&background=complete&hide="
          alt="Creative logo"
          className={`rounded-full shadow-lg transition-all duration-300 ${isCollapsed ? 'w-10 h-10' : 'w-16 h-16'}`}
        />
        {!isCollapsed && <h1 className="text-3xl font-extrabold text-white tracking-wider">B-link ✨</h1>}
      </div>

     
      <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-end'} mb-4`}>
        <button
          onClick={toggleCollapse}
          className="p-1 rounded-full bg-purple-700 hover:bg-purple-600 transition-colors"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

    
      <nav className="flex-1 flex flex-col space-y-2">
        {navItems.map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className={`flex items-center p-3 rounded-xl transition duration-200 
              ${item.label === "Dashboard" ? "bg-purple-600 shadow-md" : "hover:bg-purple-600 hover:shadow-md"}`}
            title={isCollapsed ? item.label : null}
          >
            {item.icon}
            {!isCollapsed && <span className="ml-3 font-semibold">{item.label}</span>}
          </button>
        ))}
      </nav>

    
      <div className="flex justify-center mb-3">
        <img
          src="https://stories.freepiklabs.com/api/vectors/fill-out/pana/render?color=&background=complete"
          alt="creative decoration"
          className={`transition-all duration-300 ${isCollapsed ? 'w-10 h-10 opacity-70' : 'w-20 h-20 opacity-80'}`}
        />
      </div>

   
      <button
        onClick={onLogout}
        className={`
          flex items-center p-3 mt-auto bg-red-600 rounded-xl hover:bg-red-700 transition duration-200 font-semibold shadow-lg
          ${isCollapsed ? 'justify-center w-full' : 'justify-center space-x-2'}
        `}
        title={isCollapsed ? "Logout" : null}
      >
        <LogOut className={`w-5 h-5 ${isCollapsed ? 'mr-0' : 'mr-2'}`} />
        {!isCollapsed && <span>Logout</span>}
      </button>
    </aside>
  );
};

export default SideNav;
