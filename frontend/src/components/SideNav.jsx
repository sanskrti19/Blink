import React from "react";
 
import { Home, Plus, Tag, LogOut, ChevronLeft, ChevronRight } from "lucide-react"; 
import { useNavigate } from "react-router-dom";


const SideNav = ({ onAddClick, onLogout, isCollapsed, toggleCollapse  }) => {
  const navigate = useNavigate();

  const handleTagsClick = () => {
    console.log("Navigating to Tags/Filter by Tags");
  };

  // // Function to toggle the theme
  // const handleToggleTheme = () => {
  //   setDarkMode(prevMode => !prevMode);
  // };

  const navItems = [
    // Dashboard item uncommented and action added
    { label: "Dashboard", icon: <Home className="w-5 h-5" />, action: () => navigate("/") }, 
    { label: "Tags", icon: <Tag className="w-5 h-5" />, action: handleTagsClick },
  ];
  
  // Custom item for Add Bookmark placed separately below other items
  const addBookmarkItem = { label: "Add Bookmark", icon: <Plus className="w-5 h-5" />, action: onAddClick };


  return (
    <aside
      className={`
        ${isCollapsed ? 'w-20 items-center' : 'w-64'} 
        min-h-screen 
        // 3. Conditional background and text colors for light/dark mode
        bg-white text-gray-900 shadow-xl border-r border-gray-200 
        dark:bg-purple-900 dark:text-white dark:border-purple-300
        flex flex-col p-4 space-y-8 transition-all duration-300
      `}
    >
      
      
      <div className={`flex flex-col items-center ${isCollapsed ? 'space-y-3' : 'space-y-2'}`}>
        <img
          src="https://stories.freepiklabs.com/api/vectors/bookmarks/rafiki/render?color=&background=complete&hide="
          alt="Creative logo"
          className={`rounded-full shadow-lg transition-all duration-300 ${isCollapsed ? 'w-10 h-10' : 'w-16 h-16'}`}
        />
         
        {!isCollapsed && <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-wider">B-link </h1>}
      </div>

      
   
      <div className={`flex items-center ${isCollapsed ? 'justify-center flex-col' : 'justify-end'} gap-2 mb-4`}>
            
        
      
        <button
          onClick={toggleCollapse}
          className="p-1 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700
                     dark:bg-purple-700 dark:hover:bg-purple-300 dark:text-white transition-colors"
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
            className={`
              flex items-center p-3 rounded-xl 
              // 5. Light/Dark mode styling for main navigation links
              bg-white hover:bg-purple-50 text-gray-700 
              dark:bg-purple-800 dark:hover:bg-purple-700 dark:text-white
              transition duration-200 font-semibold
              ${isCollapsed ? "justify-center w-full" : "justify-start space-x-2"}
            `}
          >
            {item.icon}
            {!isCollapsed && <span className="ml-3 font-semibold">{item.label}</span>}
          </button>
        ))}

 
        <button
          onClick={addBookmarkItem.action}
          className={`
            flex items-center p-3 rounded-xl mt-4
            // Styling to match the highlighted Dashboard in the light screenshot
            bg-purple-600 hover:bg-purple-700 text-white shadow-lg
            dark:bg-purple-700 dark:hover:bg-purple-600 
            transition duration-200 font-semibold
            ${isCollapsed ? "justify-center w-full" : "justify-start space-x-2"}
          `}
        >
          {addBookmarkItem.icon}
          {!isCollapsed && <span className="ml-3 font-semibold">{addBookmarkItem.label}</span>}
        </button>
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
          flex items-center p-3 mt-auto bg-red-600 rounded-xl hover:bg-red-700 transition duration-200 font-semibold shadow-lg text-white
          ${isCollapsed ? 'justify-center w-full' : 'justify-start space-x-2'}
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