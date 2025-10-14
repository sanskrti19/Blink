
import React from 'react';
import { useNavigate } from 'react-router-dom';
 
 

const Home = () => {
  const navigate = useNavigate();

 
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">
            <span className="text-gray-800">B</span>LINK
          </h1>
          <button 
            onClick={handleLogout} 
            className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
          >
            Logout
          </button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-8">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
          Your Bookmarks Workspace 📖
        </h2>
        <div className="p-10 bg-white rounded-xl shadow-lg border border-gray-100">
            <p className="text-gray-600">
                You are successfully logged in!
            </p>
        </div>
      </main>
    </div>
  );
};

export default Home;