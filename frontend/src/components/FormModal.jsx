import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { X, Loader, BookOpen, Tag, Folder, Send, Save } from 'lucide-react';

// Define a list of colors for deterministic assignment (must match backend parser)
const COLORS = [
    "#6366F1", // indigo
    "#10B981", // green
    "#F59E0B", // amber
    "#EC4899", // pink
    "#3B82F6", // blue
    "#8B5CF6", // violet
    "#F43F5E", // rose
];

// Helper to deterministically assign a color based on the tag name
const getTagColor = (tagName) => {
    let hash = 0;
    for (let i = 0; i < tagName.length; i++) {
        hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % COLORS.length;
    return COLORS[index];
};


const FormModal = ({ isOpen, onClose, bookmarkToEdit, onSave, setGlobalMessage, API_BASE_URL }) => {
    
    // Initial state for form data, using a string for tags input
    const initialFormData = {
        title: '',
        url: '',
        folder: '',
        tags: '', 
    };

    const [formData, setFormData] = useState(initialFormData);
    const [isSaving, setIsSaving] = useState(false);

    // 💡 REMOVED: The unused `const [tags, setTags] = useState([]);` state

    useEffect(() => {
        if (bookmarkToEdit) {
            // Convert the array of tag objects back to a comma-separated string for the input field
            const tagsString = Array.isArray(bookmarkToEdit.tags) 
                ? bookmarkToEdit.tags.map(t => t.name).join(', ') 
                : '';

            setFormData({
                title: bookmarkToEdit.title || '',
                url: bookmarkToEdit.url || '',
                folder: bookmarkToEdit.folder || '',
                tags: tagsString, // Use the comma-separated string
            });
        } else {
            setFormData(initialFormData);
        }
    }, [bookmarkToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        const token = localStorage.getItem('token');
        if (!token) {
            setGlobalMessage({ type: 'error', text: 'Authentication failed. Please log in again.' });
            onClose(); 
            return;
        }

        try {
            // 🔑 CRITICAL FIX: Convert comma-separated string to array of { name, color } objects
            const structuredTags = formData.tags
                .split(',')
                .map(t => t.trim())
                .filter(t => t.length > 0)
                .map(tagName => ({
                    name: tagName,
                    color: getTagColor(tagName), // Assign the deterministic color
                }));

            const payload = {
                title: formData.title, // Explicitly list fields for clarity/safety
                url: formData.url,
                folder: formData.folder,
                tags: structuredTags, // Send the structured array
            };

            const config = { headers: { Authorization: `Bearer ${token}` } };
            let response;
            let successMessage;

            if (bookmarkToEdit) {
                response = await axios.put(`${API_BASE_URL}/bookmarks/${bookmarkToEdit._id}`, payload, config);
                successMessage = 'Bookmark updated successfully!';
            } else {
                response = await axios.post(`${API_BASE_URL}/bookmarks`, payload, config);
                successMessage = 'New bookmark created successfully!';
            }

            setGlobalMessage({ type: 'success', text: successMessage });
            onSave(response.data);
            
        } catch (error) {
            console.error('Save/Update Error:', error.response?.data?.message || error.message);
            setGlobalMessage({ type: 'error', text: `Error saving bookmark: ${error.response?.data?.message || 'Connection failed.'}` });
        } finally {
            setIsSaving(false);
            setTimeout(() => setGlobalMessage({ type: '', text: '' }), 3000);
        }
    };

    const titleText = bookmarkToEdit ? 'Edit Bookmark' : 'Create New Bookmark'; // Corrected text

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-xl w-full max-w-md mx-4 p-6 shadow-2xl">
                <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-indigo-700">{titleText}</h2>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 rounded-full transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
                    <label className="block">
                        <span className="text-gray-700 font-medium flex items-center mb-1"><BookOpen className="w-4 h-4 mr-2"/>Title</span>
                        <input 
                            type="text" 
                            name="title" 
                            value={formData.title} 
                            onChange={handleChange} 
                            required 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </label>
                    <label className="block">
                        <span className="text-gray-700 font-medium flex items-center mb-1"><Send className="w-4 h-4 mr-2"/>URL (HREF)</span>
                        <input 
                            type="url" 
                            name="url" 
                            value={formData.url} 
                            onChange={handleChange} 
                            required 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </label>
                    <label className="block">
                        <span className="text-gray-700 font-medium flex items-center mb-1"><Folder className="w-4 h-4 mr-2"/>Folder/Category</span>
                        <input 
                            type="text" 
                            name="folder" 
                            value={formData.folder} 
                            onChange={handleChange} 
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </label>
                    <label className="block">
                        <span className="text-gray-700 font-medium flex items-center mb-1"><Tag className="w-4 h-4 mr-2"/>Tags (Comma-separated)</span>
                        <input 
                            type="text" 
                            name="tags" 
                            value={formData.tags} 
                            onChange={handleChange} 
                            placeholder="e.g., react, css, learning"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition"
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`w-full py-3 mt-4 flex items-center justify-center rounded-xl font-bold transition-all shadow-lg ${
                            isSaving 
                                ? 'bg-indigo-300 text-white cursor-not-allowed' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 transform hover:scale-[1.01]'
                        }`}
                    >
                        {isSaving ? <Loader className="animate-spin w-5 h-5 mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                        {bookmarkToEdit ? 'Save Changes' : 'Create Bookmark'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FormModal;