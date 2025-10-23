import React from 'react';
import { Trash2, Edit, Tag, Folder } from 'lucide-react';

const BookmarkCard = ({ bm, onEdit, onDelete, darkMode }) => (
  <div
    className={`
      p-5 rounded-2xl shadow-lg transition duration-300 transform hover:translate-y-[-2px] 
      flex flex-col h-full border-t-4
      ${darkMode 
        ? 'bg-purple-950 border-indigo-700 text-purple-100 hover:shadow-purple-800'
        : 'bg-purple-800 border-indigo-500 text-white hover:shadow-purple-600'}
    `}
  >
    <a 
      href={bm.url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`
        text-xl font-bold truncate mb-2 block transition
        ${darkMode ? 'hover:text-indigo-300 text-purple-100' : 'hover:text-indigo-200 text-white'}
      `}
      title={bm.title}
    >
      {bm.title}
    </a>

    <p className={`
      text-xs truncate mb-4 transition
      ${darkMode ? 'text-purple-300' : 'text-purple-200'}
    `}>
      {bm.url}
    </p>

    <div className="flex flex-wrap gap-2 mb-4">
      <span className={`
        flex items-center px-3 py-1 rounded-full text-xs font-medium transition
        ${darkMode ? 'bg-indigo-900 text-indigo-300' : 'bg-indigo-100 text-indigo-700'}
      `}>
        <Folder className="w-3 h-3 mr-1" />
        {bm.folder || 'Root'}
      </span>

      {bm.tags && Array.isArray(bm.tags) && bm.tags.slice(0, 3).map((tag, index) => (
        <span key={index} className={`
          flex items-center px-3 py-1 rounded-full text-xs font-medium transition
          ${darkMode ? 'bg-purple-900 text-purple-300' : 'bg-gray-200 text-gray-700'}
        `}>
          <Tag className="w-3 h-3 mr-1"/>
          {tag}
        </span>
      ))}
    </div>

    <div className={`flex justify-end gap-3 mt-auto pt-3 border-t transition ${darkMode ? 'border-purple-700' : 'border-purple-600'}`}>
      <button
        onClick={() => onEdit(bm)}
        className={`
          p-2 rounded-full transition duration-150
          ${darkMode ? 'bg-indigo-900 text-indigo-300 hover:text-indigo-100 hover:bg-indigo-800' : 'bg-indigo-50 text-indigo-500 hover:text-indigo-700'}
        `}
        title="Edit Bookmark"
      >
        <Edit className="w-4 h-4" />
      </button>

      <button
        onClick={() => onDelete(bm._id)}
        className={`
          p-2 rounded-full transition duration-150
          ${darkMode ? 'bg-red-900 text-red-300 hover:text-red-100 hover:bg-red-800' : 'bg-red-50 text-red-500 hover:text-red-700'}
        `}
        title="Delete Bookmark"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  </div>
);

export default BookmarkCard;
