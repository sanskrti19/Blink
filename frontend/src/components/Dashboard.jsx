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
      {/* 🌈 Background gradient accents */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-purple-400/30 to-pink-300/20 blur-3xl rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-indigo-400/20 to-purple-300/10 blur-3xl rounded-full -z-10" />

      {/* Sidebar */}
      <SideNav
        onAddClick={handleOpenCreateModal}
        onLogout={handleLogout}
        isCollapsed={isCollapsed}
      />

      {/* Sidebar toggle button */}
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

      {/* Main content */}
      <div
        className={`flex-1 p-6 sm:p-12 space-y-8 overflow-auto transition-all duration-300 ${
          isCollapsed ? "pl-8" : "pl-16"
        }`}
      >
        {/* 🎨 Hero Section */}
        <div className="flex justify-between items-center flex-wrap gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Welcome Back!</h1>
            <p className="text-lg text-gray-500">
              Manage your collection of {bookmarks.length} saved links.
            </p>
          </div>
      <img src= "data:image/png;base64,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" alt="Bookmark illustration" 

            className="w-44 h-44 md:w-56 md:h-56 drop-shadow-xl"
          />
        </div>

        {/* Upload message */}
        {uploadMessage.text && (
          <div
            className={`p-4 rounded-xl border-l-4 text-sm font-medium shadow-md ${getMessageStyle()}`}
          >
            {uploadMessage.text}
          </div>
        )}

        {/* Upload section */}
        <details className="bg-white p-6 rounded-3xl shadow-xl border border-gray-200 transition duration-300 open:shadow-2xl">
          <summary className="flex items-center justify-between cursor-pointer font-extrabold text-indigo-600 text-xl hover:text-indigo-700 transition duration-150">
            <span className="flex items-center space-x-3">
              <UploadCloud className="w-6 h-6" />
              <span>Import Bookmarks (.html)</span>
            </span>
            <ChevronDown className="w-5 h-5 summary-icon" />
          </summary>

          <form
            onSubmit={handleUploadSubmit}
            className="mt-6 space-y-5 border-t pt-5 border-gray-100"
          >
            <label className="block text-sm font-medium text-gray-700">
              Select .html file:
            </label>
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
              {isUploading ? (
                <Loader className="animate-spin h-5 w-5 mr-3 text-white" />
              ) : (
                "Start Upload and Save"
              )}
            </button>
          </form>
        </details>

        {/* All saved links */}
        <h2 className="text-3xl font-extrabold text-gray-800 pt-4">
          All Saved Links{" "}
          <span className="text-indigo-500 font-medium text-xl">
            ({bookmarks.length})
          </span>
        </h2>

        {bookmarks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {bookmarks.map((bm) => (
              <div
                key={bm._id}
                className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              >
                <BookmarkCard
                  bm={bm}
                  onEdit={handleOpenEditModal}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        ) : (
           
          <div className="flex flex-col items-center justify-center text-center bg-white p-12 rounded-3xl shadow-inner border-2 border-dashed border-gray-300 mt-6">
            <img src="data:image/png;base64,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"

            alt="No bookmarks" className="w-56 h-56 mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              No bookmarks yet
            </h2>
            <p className="text-gray-500 text-lg mb-4">
              Start by adding your first link ✨ or import your collection above.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="bg-purple-600 text-white px-5 py-3 rounded-xl text-lg font-semibold hover:bg-purple-700 transition"
            >
              + Add Bookmark
            </button>
          </div>
        )}

        {/* Bookmark form modal */}
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
