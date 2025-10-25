import React, { useState } from "react";
import {
  Home,
  Plus,
  Tag,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SideNav = ({
  onAddClick,
  onLogout,
  isCollapsed,
  toggleCollapse,
  tags = []
}) => {
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleTagsClick = () => setIsTagDropdownOpen(!isTagDropdownOpen);

  // ✅ Group tags by color
  const groupedTags = tags.reduce((acc, tag) => {
    if (!acc[tag.color]) acc[tag.color] = [];
    acc[tag.color].push(tag);
    return acc;
  }, {});

  return (
    <aside
      className={`${
        isCollapsed ? "w-20 items-center" : "w-64"
      } min-h-screen bg-white text-gray-900 shadow-xl border-r border-purple-900 flex flex-col p-4 space-y-8 transition-all duration-300`}
    >
      {/* Logo */}
      <div className={`flex flex-col items-center ${isCollapsed ? "space-y-3" : "space-y-2"}`}>
        <img
          src="https://stories.freepiklabs.com/api/vectors/bookmarks/rafiki/render?color=&background=complete&hide="
          alt="Creative logo"
          className={`rounded-full shadow-lg transition-all duration-300 ${isCollapsed ? "w-10 h-10" : "w-16 h-16"}`}
        />
        {!isCollapsed && <h1 className="text-3xl font-extrabold text-gray-900 tracking-wider">B-link</h1>}
      </div>

      {/* Collapse Button */}
      <div className={`flex items-center ${isCollapsed ? "justify-center flex-col" : "justify-end"} gap-2 mb-4`}>
        <button
          onClick={toggleCollapse}
          className="p-1 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 flex flex-col space-y-2">
        {/* Dashboard */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center p-3 rounded-xl bg-white hover:bg-purple-100 text-gray-700 transition duration-200 font-semibold"
        >
          <Home className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3 font-semibold">Dashboard</span>}
        </button>

        {/* Tags Dropdown */}
        <div>
          <button
            onClick={handleTagsClick}
            className="flex items-center p-3 rounded-xl bg-white hover:bg-purple-50 text-gray-700 transition duration-200 font-semibold w-full"
          >
            <Tag className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3 font-semibold">Tags</span>}
            <span>{isTagDropdownOpen ? <ChevronUp className="ml-auto" /> : <ChevronDown className="ml-auto" />}</span>
          </button>

          {/* ✅ Grouped by color */}
          {isTagDropdownOpen && (
            <div className="bg-white shadow-md rounded-lg mt-2 p-2 space-y-4 max-h-64 overflow-y-auto">
              {Object.entries(groupedTags).map(([color, tagList]) => (
                <div key={color} className="rounded-md p-2" style={{ borderLeft: `6px solid ${color}` }}>
                  <div className="flex items-center space-x-2 mb-2">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className="font-semibold text-gray-800">
                      {color} Tags
                    </span>
                  </div>

                  <div className="pl-4 flex flex-col space-y-1">
                    {tagList.map((tag) => (
                      <button
                        key={tag.name}
                        onClick={() => console.log(`Filter by ${tag.name}`)}
                        className="text-left px-2 py-1 rounded-md hover:bg-purple-50 transition text-gray-700 font-medium"
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Bookmark */}
        <button
          onClick={onAddClick}
          className="flex items-center p-3 rounded-xl mt-4 bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition duration-200 font-semibold"
        >
          <Plus className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3 font-semibold">Add Bookmark</span>}
        </button>
      </nav>

      {/* Decorative Image */}
      <div className="flex justify-center mb-3">
        <img
          src="https://stories.freepiklabs.com/api/vectors/bye/rafiki/render?color=&background=complete"
          alt="creative decoration"
          className={`transition-all duration-300 ${isCollapsed ? "w-10 h-10 opacity-70" : "w-20 h-20 opacity-80"}`}
        />
      </div>

      {/* Logout */}
      <button
        onClick={onLogout}
        className="flex items-center p-3 mt-auto bg-red-600 rounded-xl hover:bg-red-700 transition duration-200 font-semibold shadow-lg text-white"
        title={isCollapsed ? "Logout" : null}
      >
        <LogOut className={`w-5 h-5 ${isCollapsed ? "mr-0" : "mr-2"}`} />
        {!isCollapsed && <span>Logout</span>}
      </button>
    </aside>
  );
};

export default SideNav;
