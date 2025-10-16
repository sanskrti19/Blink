import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = "http://localhost:5000/api";

const Dashboard = () => {
    const navigate = useNavigate();
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBookmarks = async () => {
        setLoading(true);
        setError(null);
        
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
            
    
            const response = await axios.get(`${API_BASE_URL}/bookmarks`, config); 
            
            setBookmarks(response.data); 

        } catch (err) {
            console.error('Error fetching bookmarks:', err);
            
    
            if (err.response && err.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login'); 
            } else {
                setError('Failed to load bookmarks. Check server connection or network.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookmarks();
    }, [navigate]); 

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-xl text-indigo-600">Loading your bookmarks...</div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen p-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
            <button 
                onClick={handleLogout}
                className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
                Logout
            </button>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center pb-6 border-b border-gray-200">
                    <h1 className="text-4xl font-extrabold text-gray-900">Your Bookmarks</h1>
                    <button 
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
                    >
                        Logout
                    </button>
                </header>

                <div className="mt-8">
                    {bookmarks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {bookmarks.map((bm) => (
                                <a 
                                    key={bm._id} 
                                    href={bm.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="block bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-shadow border-t-4 border-indigo-500"
                                >
                                    <p className="text-xs font-semibold uppercase text-indigo-600 mb-1">{bm.folder || 'Root'}</p>
                                    <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">{bm.title}</h3>
                                    <p className="text-sm text-gray-500 truncate">{bm.url}</p>
                                    {bm.tags && (
                                        <span className="inline-block mt-3 px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                                            #{bm.tags}
                                        </span>
                                    )}
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-12 bg-white rounded-xl shadow-lg">
                            <h2 className="text-2xl font-semibold text-gray-700">No Bookmarks Found</h2>
                            <p className="mt-2 text-gray-500">You're logged in! Now you can use the upload feature to add your bookmarks.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
