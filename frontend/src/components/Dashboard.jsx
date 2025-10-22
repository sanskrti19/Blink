import React, { useEffect, useState } from "react";
import axios from "axios";

import BookmarkFormModal from "./FormModal";
import BookmarkCard from "./BookmarkCard";
import SideNav from "./SideNav";

import {
  Loader,
  UploadCloud,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

function Dashboard() {
 
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);
 
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBookmark, setCurrentBookmark] = useState(null);
 
  const [isModalOpen, setIsModalOpen] = useState(false);

 
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ type: "", text: "" });
 
  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      window.location.href = "/login";
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data } = await axios.get(`${API_BASE_URL}/bookmarks`, config);
      setBookmarks(data);
    } catch (error) {
      console.error(error);
      localStorage.removeItem("token");
      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };
 
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
      setBookmarks((prev) =>
        prev.map((b) => (b._id === savedBookmark._id ? savedBookmark : b))
      );
    } else {
      setBookmarks((prev) => [savedBookmark, ...prev]);
    }
    handleCloseModal();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bookmark?")) return;

    const token = localStorage.getItem("token");
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`${API_BASE_URL}/bookmarks/${id}`, config);
      setBookmarks((prev) => prev.filter((b) => b._id !== id));
      setUploadMessage({ type: "success", text: "Bookmark deleted successfully." });
    } catch (error) {
      console.error(error);
      setUploadMessage({
        type: "error",
        text: `Failed to delete: ${error.response?.data?.message || "Check console."}`,
      });
    } finally {
      setTimeout(() => setUploadMessage({ type: "", text: "" }), 3000);
    }
  };
 

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith(".html")) {
      setFile(selectedFile);
      setUploadMessage({ type: "info", text: `File selected: ${selectedFile.name}` });
    } else {
      setFile(null);
      setUploadMessage({ type: "error", text: "Please select a valid .html file" });
    }
    setTimeout(() => setUploadMessage({ type: "", text: "" }), 3000);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadMessage({ type: "info", text: "Uploading and processing..." });

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("bookmarkFile", file);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${API_BASE_URL}/bookmarks/upload`, formData, config);
      setFile(null);
      e.target.reset();
      setUploadMessage({ type: "success", text: response.data.message || "Bookmarks uploaded!" });

      setTimeout(() => {
        fetchBookmarks();
        setUploadMessage({ type: "", text: "" });
      }, 1500);
    } catch (error) {
      console.error(error);
      setUploadMessage({
        type: "error",
        text: error.response?.data?.message || "Upload failed",
      });
      setTimeout(() => setUploadMessage({ type: "", text: "" }), 5000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const getMessageStyle = () => {
    switch (uploadMessage.type) {
      case "error":
        return "text-red-700 bg-red-100 border-red-300";
      case "success":
        return "text-green-700 bg-green-100 border-green-300";
      case "info":
        return "text-indigo-700 bg-indigo-100 border-indigo-300";
      default:
        return "text-gray-700 bg-gray-100 border-gray-300";
    }
  };
 
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Loader className="animate-spin h-8 w-8 text-indigo-600 mr-3" />
        <div className="text-xl font-medium text-indigo-600">Loading your links...</div>
      </div>
    );
  }
 
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans relative">
      
      <SideNav
        onAddClick={handleOpenCreateModal}
        onLogout={handleLogout}
        isCollapsed={isCollapsed}
      />

  
      <button
        onClick={toggleCollapse}
        title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        className={`
          absolute top-1/2 -translate-y-1/2 z-10 p-2 rounded-full 
          bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg 
          transition-all duration-300 ${isCollapsed ? "left-20" : "left-64"}
        `}
      >
        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
 
      <div className={`flex-1 p-6 sm:p-12 space-y-8 overflow-auto transition-all duration-300 ${isCollapsed ? "pl-8" : "pl-16"}`}>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2"> Welcome Back!</h1>
        <p className="text-lg text-gray-500">
          Manage your collection of {bookmarks.length} saved links.
        </p>

        {uploadMessage.text && (
          <div className={`p-4 rounded-xl border-l-4 text-sm font-medium shadow-md ${getMessageStyle()}`}>
            {uploadMessage.text}
          </div>
        )}

        
        <details className="bg-white p-6 rounded-3xl shadow-xl border border-gray-200 transition duration-300 open:shadow-2xl">
          <summary className="flex items-center justify-between cursor-pointer font-extrabold text-indigo-600 text-xl hover:text-indigo-700 transition duration-150">
            <span className="flex items-center space-x-3">
              <UploadCloud className="w-6 h-6" />
              <span>Import Bookmarks (.html)</span>
            </span>
            <ChevronDown className="w-5 h-5 summary-icon" />
          </summary>

          <form onSubmit={handleUploadSubmit} className="mt-6 space-y-5 border-t pt-5 border-gray-100">
            <label className="block text-sm font-medium text-gray-700">Select .html file:</label>
            <input
              type="file"
              accept=".html"
              onChange={handleFileChange}
              disabled={isUploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer transition duration-150"
            />
            <button
              type="submit"
              disabled={!file || isUploading}
              className={`w-full py-3 px-6 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center transform hover:scale-[1.01] ${
                !file || isUploading
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-300/50"
              }`}
            >
              {isUploading ? <Loader className="animate-spin h-5 w-5 mr-3 text-white" /> : "Start Upload and Save"}
            </button>
          </form>
        </details>

    
        <h2 className="text-3xl font-extrabold text-gray-800 pt-4">
          All Saved Links <span className="text-indigo-500 font-medium text-xl">({bookmarks.length})</span>
        </h2>

        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {bookmarks.map((bm) => (
              <BookmarkCard key={bm._id} bm={bm} onEdit={handleOpenEditModal} onDelete={handleDelete} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-12 rounded-3xl shadow-inner border-2 border-dashed border-gray-300 text-center mt-6">
            <p className="text-2xl font-bold text-gray-700 mb-2">Empty Nest 🕊️</p>
            <p className="text-gray-500 text-lg">
              Add your first link using the button on the side, or import your entire collection above!
            </p>
          </div>
        )}

      
        <BookmarkFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          bookmarkToEdit={currentBookmark}
          onSave={handleSaveOrUpdate}
          setGlobalMessage={setUploadMessage}
        />
      </div>
    </div>
  );
}

export default Dashboard;
