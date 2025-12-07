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
  tags = [],
  selectedTags = [],
  onToggleTag
}) => {
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleTagsClick = () => setIsTagDropdownOpen(!isTagDropdownOpen);

  return (
    <aside
      className={`${
        isCollapsed ? "w-20 items-center" : "w-64"
      } min-h-screen bg-white text-gray-900 shadow-xl border-r border-purple-900 flex flex-col p-4 space-y-8 transition-all duration-300`}
    >
      <div
        className={`flex flex-col items-center ${
          isCollapsed ? "space-y-3" : "space-y-2"
        }`}
      >
        <img
          src="https://stories.freepiklabs.com/api/vectors/bookmarks/rafiki/render?color=&background=complete&hide="
          alt="Creative logo"
          className={`rounded-full shadow-lg transition-all duration-300 ${
            isCollapsed ? "w-10 h-10" : "w-16 h-16"
          }`}
        />
        {!isCollapsed && (
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-wider">
            B-link
          </h1>
        )}
      </div>

      <div
        className={`flex items-center ${
          isCollapsed ? "justify-center flex-col" : "justify-end"
        } gap-2 mb-4`}
      >
        <button
          onClick={toggleCollapse}
          className="p-1 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors"
          title={isCollapsed ? "Expand" : "Collapse"}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

     <nav className="flex-1 flex flex-col space-y-2">
 
  {!isCollapsed && (
    <div>
      <button
        onClick={handleTagsClick}
        className="flex items-center p-3 rounded-xl bg-white hover:bg-purple-50 text-gray-700 transition duration-200 font-semibold w-full"
      >
        <Tag className="w-5 h-5" />
        <span className="ml-3 font-semibold">Tags</span>
        <span>
          {isTagDropdownOpen ? (
            <ChevronUp className="ml-auto" />
          ) : (
            <ChevronDown className="ml-auto" />
          )}
        </span>
      </button>

      {isTagDropdownOpen && (
        <div className="bg-white shadow-md rounded-lg mt-2 p-3 max-h-64 overflow-y-auto flex flex-wrap gap-2">
          {tags.map((tag) => {
            const isActive = selectedTags.includes(tag.name);
            return (
              <button
                key={tag.name}
                onClick={() => onToggleTag && onToggleTag(tag.name)}
                className={`flex items-center px-3 py-1 rounded-full border text-xs font-medium transition
                  ${
                    isActive
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-800 border-gray-200 hover:bg-purple-50"
                  }`}
              >
                <span
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: tag.color || "#a855f7" }}
                />
                <span>{tag.name}</span>
                {tag.count != null && (
                  <span className="ml-1 opacity-70">({tag.count})</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  )}

  <button
    onClick={onAddClick}
    className="flex items-center p-3 rounded-xl mt-4 bg-purple-600 hover:bg-purple-700 text-white shadow-lg transition duration-200 font-semibold"
  >
    <Plus className="w-5 h-5" />
    {!isCollapsed && (
      <span className="ml-3 font-semibold">Add Bookmark</span>
    )}
  </button>
</nav>


      <div className="flex justify-center mb-3">
        <img
          src="https://stories.freepiklabs.com/api/vectors/bye/rafiki/render?color=&background=complete"
          alt="creative decoration"
          className={`transition-all duration-300 ${
            isCollapsed ? "w-10 h-10 opacity-70" : "w-20 h-20 opacity-80"
          }`}
        />
      </div>

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
