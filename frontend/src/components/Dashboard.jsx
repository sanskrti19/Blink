import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
 
const API_BASE_URL = 'http://localhost:5000/api'; 

function Dashboard() {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();
    // console.log("Current Bookmarks State:", bookmarks); // Commented out to reduce console noise
 
    const fetchBookmarks = async () => {
        const token = localStorage.getItem('token'); 
        if (!token) {
            setLoading(false);
            navigate('/login');  
            return; 
        }
        
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`, 
                },
            };
            
           
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
     

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.name.endsWith('.html')) {
            setFile(selectedFile);
            setUploadMessage({ type: 'info', text: `File selected: ${selectedFile.name}. Click 'Start Upload' to save.` });
        } else {
            setFile(null);
            setUploadMessage({ type: 'error', text: 'Please select a valid HTML bookmark file (.html extension).' });
        }
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setUploadMessage({ type: 'error', text: 'Please select a file to upload.' });
            return;
        }

        setIsUploading(true);
        setUploadMessage({ type: 'info', text: 'Uploading and processing file... This may take a moment for large files.' });

        const token = localStorage.getItem('token');
        if (!token) {
            setIsUploading(false);
            navigate('/login');
            return;
        }

        const formData = new FormData();
        formData.append('bookmarkFile', file);  

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`, 
                },
            };
             
            const response = await axios.post(`${API_BASE_URL}/bookmarks/upload`, formData, config);
             
            setFile(null); 
            e.target.reset(); 

            // Success logic is correctly placed here:
            setUploadMessage({ 
                type: 'success', 
                text: response.data.message || 'Bookmarks uploaded successfully! Refreshing list...' 
            });
            
             
            setTimeout(() => {
                fetchBookmarks(); // CRITICAL: Re-fetch data to update the UI
                setUploadMessage({ type: '', text: '' });  
            }, 1500); 

        } catch (error) {
            console.error('Upload error:', error);
            const msg = error.response?.data?.message || 'Upload failed. Check server console.';
            setUploadMessage({ type: 'error', text: msg });
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
            <div className="text-xl font-medium text-indigo-600 animate-pulse">
                <svg className="animate-spin h-6 w-6 mr-3 inline text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
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
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-inter">
            {/* Header */}
            <header className="flex justify-between items-center mb-10 pb-4">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                    Your Blink Bookmarks
                </h1>
                <button 
                    onClick={handleLogout}
                    className="py-2 px-6 bg-red-500 text-white font-semibold rounded-xl shadow-md hover:bg-red-600 transition duration-150 transform hover:scale-105"
                >
                    Logout
                </button>
            </header>
            
            {/* --- File Upload Card --- */}
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-indigo-100 mb-12">
                <div className="flex items-center mb-4">
                    <svg className="w-6 h-6 text-indigo-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    <h2 className="text-2xl font-bold text-indigo-700">Import Bookmarks</h2>
                </div>
                <p className="text-gray-600 mb-6">
                    Upload your browser's exported **HTML bookmark file** to sync your links instantly.
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

                    {/* Dynamic Message Box */}
                    {uploadMessage.text && (
                        <div className={`p-3 rounded-lg border text-sm font-medium ${getMessageStyle()}`}>
                            {uploadMessage.text}
                        </div>
                    )}
                    

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
                            <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : 'Start Upload and Save'}
                    </button>
                </form>
            </div>


            {/* --- Bookmarks List Section --- */}
            <h2 className="text-2xl font-bold text-gray-800 mb-5 max-w-4xl mx-auto">
                All Saved Links ({bookmarks.length})
            </h2>
            
            {bookmarks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {bookmarks.map(bm => (
                        <div key={bm._id} className="bg-white p-5 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:translate-y-[-2px] border border-gray-100">
                            <a 
                                href={bm.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-lg font-semibold text-indigo-600 hover:text-indigo-700 transition block mb-1 truncate"
                                title={bm.title}
                            >
                                {bm.title}
                            </a>
                            <p className="text-sm text-gray-500 truncate mb-3">{bm.url}</p>
                            
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    {bm.folder || 'Root'}
                                </span>
                                {bm.tags && Array.isArray(bm.tags) && bm.tags.map((tag, index) => (
                                    <span key={index} className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Enhanced Empty State */
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-2xl shadow-inner border border-dashed border-gray-300 text-center">
                    <svg className="w-12 h-12 text-indigo-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                    <p className="text-xl font-semibold text-gray-700 mb-2">
                        No Bookmarks Found
                    </p>
                    <p className="text-gray-500">
                        You're logged in! Upload your browser's HTML bookmark file above to get started.
                    </p>
                </div>
            )}

        </div>
    );
}

export default Dashboard;