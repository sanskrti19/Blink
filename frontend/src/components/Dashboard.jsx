import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";

import FormModal from "./FormModal";
import BookmarkCard from "./BookmarkCard";
import SideNav from "./SideNav";
import { useTheme } from "../context/ThemeContext";


import { Loader, UploadCloud, ChevronDown } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api";

function Dashboard() {
  const { mode } = useTheme();
  const darkMode = mode === "dark";  

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBookmark, setCurrentBookmark] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ type: "", text: "" });
  const [bookmarkToEdit, setBookmarkToEdit] = useState(null);

   
  const [selectedTags, setSelectedTags] = useState([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setBookmarkToEdit(null);
  };

  const handleEdit = (bookmark) => {
    setBookmarkToEdit(bookmark);
    openModal();
  };

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

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
        text: `Failed to delete: ${error.response?.data?.message || "Retry"}`,
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
      const response = await axios.post(
        `${API_BASE_URL}/bookmarks/upload`,
        formData,
        config
      );
      setFile(null);
      e.target.reset();
      setUploadMessage({
        type: "success",
        text: response.data.message || "Bookmarks uploaded!",
      });

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
        return "text-red-600 bg-red-100 border-red-300 dark:text-red-300 dark:bg-red-900/50 dark:border-red-700";
      case "success":
        return "text-green-700 bg-green-100 border-green-300 dark:text-green-300 dark:bg-green-900/50 dark:border-green-700";
      case "info":
        return "text-indigo-700 bg-indigo-100 border-indigo-300 dark:text-indigo-300 dark:bg-indigo-900/50 dark:border-indigo-700";
      default:
        return "text-gray-700 bg-gray-100 border-gray-300 dark:text-gray-300 dark:bg-gray-700/50 dark:border-gray-500";
    }   
  };

 
  const tagsForSidebar = useMemo(() => {
    const tagMap = new Map();  

    bookmarks.forEach((bm) => {
      (bm.tags || []).forEach((tag) => {
        if (!tag?.name) return;
        const key = `${tag.name}|${tag.color || ""}`;
        if (!tagMap.has(key)) {
          tagMap.set(key, {
            name: tag.name,
            color: tag.color || "#a855f7", 
            count: 1,
          });
        } else {
          tagMap.get(key).count += 1;
        }
      });
    });

    return Array.from(tagMap.values());
  }, [bookmarks]);

 
  const filteredBookmarks = useMemo(() => {
    if (!selectedTags.length) return bookmarks;
    return bookmarks.filter((bm) =>
      (bm.tags || []).some((tag) => selectedTags.includes(tag.name))
    );
  }, [bookmarks, selectedTags]);
 
  const handleToggleTag = (tagName) => {
    setSelectedTags((prev) =>
      prev.includes(tagName)
        ? prev.filter((t) => t !== tagName)
        : [...prev, tagName]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-purple-400 text-white dark:bg-purple-950">
        <Loader className="animate-spin h-8 w-8 text-white mr-3" />
        <div className="text-xl font-medium">Loading your links...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-500 relative">

      <SideNav
  onAddClick={handleOpenCreateModal}
  onLogout={handleLogout}
  isCollapsed={isCollapsed}
  toggleCollapse={toggleCollapse}
  tags={tagsForSidebar}
  selectedTags={selectedTags}
  onToggleTag={handleToggleTag}
/>


      <div
        className={`flex-1 p-6 sm:p-12 space-y-8 overflow-auto transition-all duration-300 ${
          isCollapsed ? "pl-8" : "pl-6"
        }`}
      >
        <div className="flex justify-between items-center flex-wrap gap-6">
          <div>
            <h1 className="text-4xl font-extrabold mb-2">Welcome Back!</h1>
            <p className="text-lg">
              Manage your collection of {bookmarks.length} saved links.
            </p>
            {selectedTags.length > 0 && (
              <p className="text-sm text-black-900 mt-1">
                 {selectedTags.join(", ")} (
                {filteredBookmarks.length} )
              </p>
            )}
          </div>
          <img
            src="https://stories.freepiklabs.com/api/vectors/bookmarks/cuate/render?color=&background=complete"
            alt="Bookmark illustration"
            className="w-44 h-44 md:w-56 md:h-56 drop-shadow-xl"
          />
        </div>

        {uploadMessage.text && (
          <div
            className={`p-4 rounded-xl border-l-4 text-sm font-medium shadow-md ${getMessageStyle()}`}
          >
            {uploadMessage.text}
          </div>
        )}

        <details className="p-6 rounded-3xl shadow-lg border bg-purple-50 dark:bg-purple-800/80 border-gray-300 dark:border-purple-600 transition-colors duration-300">
          <summary className="flex items-center justify-between cursor-pointer font-extrabold text-xl">
            <span className="flex items-center space-x-3">
              <UploadCloud className="w-6 h-6" />
              <span>Import Bookmarks (.html)</span>
            </span>
            <ChevronDown className="w-5 h-5 summary-icon" />
          </summary>

          <form
            onSubmit={handleUploadSubmit}
            className="mt-6 space-y-3 border-t pt-5 border-gray-200 dark:border-purple-600"
          >
            <div className="flex items-center gap-4 mt-4">
              <input
                type="file"
                accept=".html"
                onChange={handleFileChange}
                disabled={isUploading}
                className="
                  block w-60 text-sm font-medium 
                  px-2 py-1 
                  rounded-lg border border-gray-300 
                  bg-white text-gray-800
                  dark:bg-gray-900 dark:border-gray-700 dark:text-gray-100
                  transition-all
                "
              />

              <button
                type="submit"
                disabled={!file || isUploading}
                className="
                  py-2 px-5 rounded-lg font-semibold text-sm
                  shadow-md bg-indigo-900 text-white
                  hover:bg-indigo-700 active:scale-95
                  disabled:opacity-90 disabled:cursor-not-allowed
                  transition-all
                "
              >
                {isUploading ? (
                  <Loader className="animate-spin h-4 w-4 text-white" />
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </form>
        </details>

        <h2 className="text-3xl font-extrabold pt-4">
          All Saved Links{" "}
          <span className="font-medium text-amber-400">
            ({filteredBookmarks.length}
            {selectedTags.length ? ` of ${bookmarks.length}` : ""})
          </span>
        </h2>

        {bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center bg-purple-50 dark:bg-purple-800/80 p-12 rounded-3xl shadow-inner border-2 border-purple-600 mt-6">
            <img
              src="https://stories.freepiklabs.com/api/vectors/bookmarks/amico/render?color=&background=complete"
              alt="No bookmarks"
              className="w-56 h-56 mb-6"
            />
            <h2 className="text-3xl font-bold mb-2">No bookmarks yet</h2>
            <p className="text-lg mb-4">
              Start by adding your first link or import your collection above.
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="bg-indigo-600 text-white px-5 py-3 rounded-xl text-lg font-semibold hover:bg-indigo-700 transition"
            >
              + Add Bookmark
            </button>
          </div>
        ) : filteredBookmarks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-19">
            {filteredBookmarks.map((bm) => (
              <BookmarkCard
                key={bm._id}
                bm={bm}
                onEdit={handleOpenEditModal}
                onDelete={handleDelete}
                darkMode={darkMode}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 text-sm text-gray-600 dark:text-gray-300">
            No bookmarks match the selected tags.
          </div>
        )}

        <FormModal
          isOpen={isModalOpen}
          onClose={closeModal}
          bookmarkToEdit={bookmarkToEdit}
          onSave={handleSaveOrUpdate}
          setGlobalMessage={setUploadMessage}
          API_BASE_URL={API_BASE_URL}
        />
      </div>
    </div>
  );
}

export default Dashboard;
