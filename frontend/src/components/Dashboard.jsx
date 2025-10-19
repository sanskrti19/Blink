import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
 
import { LogOut, Plus, Loader } from 'lucide-react'; 
 

import BookmarkFormModal from './FormModal';  
import BookmarkCard from './BookmarkCard';  

const API_BASE_URL = 'http://localhost:5000/api'; 
 
 
function Dashboard() {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState({ type: '', text: '' });
    
  
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentBookmark, setCurrentBookmark] = useState(null);  

    const navigate = useNavigate();

    const fetchBookmarks = async () => {
        const token = localStorage.getItem('token'); 
        if (!token) {
            setLoading(false);
            navigate('/login');  
            return; 
        }
        
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            const { data } = await axios.get(`${API_BASE_URL}/bookmarks`, config); 
            
            setBookmarks(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching bookmarks:', error);
            
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookmarks();
    }, []); 

   

    const handleOpenCreateModal = () => {
        setCurrentBookmark(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (bookmark) => {
        setCurrentBookmark(bookmark);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentBookmark(null);
    };
    
    const handleSaveOrUpdate = (savedBookmark) => {
       
        if (currentBookmark) {
          
            setBookmarks(prev => prev.map(bm => bm._id === savedBookmark._id ? savedBookmark : bm));
        } else {
             
            setBookmarks(prev => [savedBookmark, ...prev]);
        }
        handleCloseModal();
    };

    const handleDelete = async (id) => {
         
        if (!window.confirm('Are you sure you want to delete this bookmark?')) return;
        
        const token = localStorage.getItem('token');
        try {
            const config = { headers: { Authorization: `Bearer ${token}` } };
            await axios.delete(`${API_BASE_URL}/bookmarks/${id}`, config);
        
            setBookmarks(prev => prev.filter(bm => bm._id !== id));
           
            setUploadMessage({ type: 'success', text: 'Bookmark deleted successfully.' });
            setTimeout(() => setUploadMessage({ type: '', text: '' }), 3000);
            
        } catch (error) {
            console.error('Delete Error:', error.response?.data?.message || error.message);
            setUploadMessage({ type: 'error', text: `Failed to delete: ${error.response?.data?.message || 'Check console.'}` });
            setTimeout(() => setUploadMessage({ type: '', text: '' }), 3000);
        }
    };

    

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.name.endsWith('.html')) {
            setFile(selectedFile);
            setUploadMessage({ type: 'info', text: `File selected: ${selectedFile.name}. Click 'Start Upload' to save.` });
        } else {
            setFile(null);
            setUploadMessage({ type: 'error', text: 'Please select a valid HTML bookmark file (.html extension).' });
        }
        setTimeout(() => setUploadMessage({ type: '', text: '' }), 3000);
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setUploadMessage({ type: 'error', text: 'Please select a file to upload.' });
            return;
        }

        setIsUploading(true);
        setUploadMessage({ type: 'info', text: 'Uploading and processing file... This may take a moment.' });

        const token = localStorage.getItem('token');
        if (!token) {
            setIsUploading(false);
            navigate('/login');
            return;
        }

        const formData = new FormData();
        formData.append('bookmarkFile', file);  

        try {
            const config = { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } };
            const response = await axios.post(`${API_BASE_URL}/bookmarks/upload`, formData, config);
            
            setFile(null); 
            e.target.reset(); 

            setUploadMessage({ 
                type: 'success', 
                text: response.data.message || 'Bookmarks uploaded successfully! Refreshing list...' 
            });
            
            setTimeout(() => {
                fetchBookmarks(); 
                setUploadMessage({ type: '', text: '' });  
            }, 1500); 

        } catch (error) {
            console.error('Upload error:', error);
            const msg = error.response?.data?.message || 'Upload failed. Check server console.';
            setUploadMessage({ type: 'error', text: msg });
            setTimeout(() => setUploadMessage({ type: '', text: '' }), 5000);
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
 

    if (loading) return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Loader className="animate-spin h-8 w-8 text-indigo-600 mr-3" />
            <div className="text-xl font-medium text-indigo-600">
                Loading your links...
            </div>
        </div>
    );

    const getMessageStyle = () => {
        switch (uploadMessage.type) {
            case 'error': return 'text-red-600 bg-red-50 border-red-200';
            case 'success': return 'text-green-600 bg-green-50 border-green-200';
            case 'info': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };
 

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8 font-inter">
             
            <header className="max-w-7xl mx-auto flex justify-between items-center mb-10 pb-4 border-b border-gray-200">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                    Blink Bookmarks
                </h1>
                <div className="flex items-center space-x-4">
                    <button 
                        onClick={handleOpenCreateModal}
                        className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:bg-indigo-700 transition duration-150 transform hover:scale-105 flex items-center"
                    >
                        <Plus className="w-5 h-5 mr-2" />
                        Add Link
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="py-2 px-4 bg-red-500 text-white font-semibold rounded-xl shadow-md hover:bg-red-600 transition duration-150 transform hover:scale-105 flex items-center"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </header>
            
            <main className="max-w-7xl mx-auto space-y-10">
                 
                {uploadMessage.text && (
                    <div className={`p-4 rounded-xl border text-sm font-medium ${getMessageStyle()}`}>
                        {uploadMessage.text}
                    </div>
                )}
                 
                <details className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100 transition duration-300">
                    <summary className="flex items-center cursor-pointer font-bold text-indigo-700 text-lg">
                        <svg className="w-6 h-6 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        Import Bookmarks from HTML
                    </summary>
                    <p className="text-gray-600 mt-4 mb-6">
                        Upload your browser's exported HTML bookmark file to bulk sync your links.
                    </p>

                    <form onSubmit={handleUploadSubmit} className="space-y-4">
                        <label className="block">
                            <span className="sr-only">Choose bookmark file</span>
                            <input 
                                type="file" 
                                accept=".html"
                                onChange={handleFileChange}
                                disabled={isUploading}
                                className="block w-full text-sm text-gray-500
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-indigo-100 file:text-indigo-700
                                    hover:file:bg-indigo-200 cursor-pointer transition duration-150"
                            />
                        </label>
                        
                        <button
                            type="submit" 
                            disabled={!file || isUploading}
                            className={`w-full py-3 px-6 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center transform hover:scale-[1.01] ${
                                !file || isUploading 
                                    ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                        >
                            {isUploading ? (
                                <Loader className="animate-spin h-5 w-5 mr-3 text-white" />
                            ) : 'Start Upload and Save'}
                        </button>
                    </form>
                </details>
 
                <h2 className="text-2xl font-bold text-gray-800">
                    All Saved Links ({bookmarks.length})
                </h2>
                
                {bookmarks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {bookmarks.map(bm => (
                            <BookmarkCard 
                                key={bm._id} 
                                bm={bm} 
                                onEdit={handleOpenEditModal} 
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                ) : (
                
                    <div className="bg-white p-12 rounded-2xl shadow-inner border border-dashed border-gray-300 text-center">
                        <svg className="w-12 h-12 text-indigo-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"></path></svg>
                        <p className="text-xl font-semibold text-gray-700 mb-2">
                            No Bookmarks Found
                        </p>
                        <p className="text-gray-500">
                            Start by clicking "Add Link" above or expand the import section.
                        </p>
                    </div>
                )}
            </main>
 
            <BookmarkFormModal 
                isOpen={isModalOpen} 
                onClose={handleCloseModal} 
                bookmarkToEdit={currentBookmark}
                onSave={handleSaveOrUpdate}
                setGlobalMessage={setUploadMessage}  
            />

        </div>
    );
}

export default Dashboard;