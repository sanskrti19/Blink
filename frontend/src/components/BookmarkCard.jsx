import React from 'react';
import { Trash2, Edit, Tag, Folder } from 'lucide-react';

const BookmarkCard = ({ bm, onEdit, onDelete }) => (
    <div className="bg-white p-5 rounded-2xl shadow-lg hover:shadow-xl transition duration-300 transform hover:translate-y-[-2px] border-t-4 border-indigo-500 flex flex-col h-full">
        <a 
            href={bm.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xl font-bold text-gray-800 hover:text-indigo-600 transition block mb-2 truncate"
            title={bm.title}
        >
            {bm.title}
        </a>
        <p className="text-xs text-gray-500 truncate mb-4">{bm.url}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          
            <span className="flex items-center bg-indigo-100 text-indigo-700 text-xs font-medium px-3 py-1 rounded-full">
                <Folder className="w-3 h-3 mr-1"/>
                {bm.folder || 'Root'}
            </span>
         
            {bm.tags && Array.isArray(bm.tags) && bm.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="flex items-center bg-gray-200 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                    <Tag className="w-3 h-3 mr-1"/>
                    {tag}
                </span>
            ))}
        </div>

        <div className="flex justify-end gap-3 mt-auto pt-3 border-t border-gray-100">
            <button
                onClick={() => onEdit(bm)}
                className="p-2 text-indigo-500 hover:text-indigo-700 bg-indigo-50 rounded-full transition duration-150"
                title="Edit Bookmark"
            >
                <Edit className="w-4 h-4" />
            </button>
            <button
                onClick={() => onDelete(bm._id)}
                className="p-2 text-red-500 hover:text-red-700 bg-red-50 rounded-full transition duration-150"
                title="Delete Bookmark"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </div>
    </div>
);

export default BookmarkCard;
