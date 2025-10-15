import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- 1. Authentication Protection ---
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Immediately redirect unauthenticated users
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  // --- 2. HTML Parsing Logic ---

  /**
   * Recursively traverses the Chrome Bookmarks HTML structure (<DL>, <DT>, <H3>, <A> tags)
   * to extract links, folders, and tags.
   */
  const parseBookmarks = (doc) => {
    const result = [];
    setErrorMessage(''); // Clear previous errors
    
    // Chrome bookmarks start with <DL> (Description List)
    const rootDl = doc.querySelector('DL');

    if (!rootDl) {
        setErrorMessage("Error: Could not find the root bookmark structure (DL tag). Ensure this is a standard Chrome/Firefox export file.");
        return [];
    }

    // Recursive function to handle nested folders
    const traverse = (node, currentPath = []) => {
      // Look at all immediate DT children (which contain either a link or a folder)
      const dtNodes = node.querySelectorAll(':scope > DT');
      
      dtNodes.forEach(dt => {
        const folderH3 = dt.querySelector(':scope > H3');
        const linkA = dt.querySelector(':scope > A');

        if (folderH3) {
          // Found a Folder
          const folderName = folderH3.textContent.trim();
          const newPath = [...currentPath, folderName];
          
          // Find the DL sibling for this folder's contents
          const dlSibling = dt.querySelector(':scope > DL');
          if (dlSibling) {
            traverse(dlSibling, newPath); // Recurse into the folder's DL
          }
        } else if (linkA) {
          // Found a Link
          result.push({
            url: linkA.href,
            title: linkA.textContent.trim(),
            tags: linkA.getAttribute('TAGS') || '', // Standard attribute for tags
            folder: currentPath.join(' / ') || 'Root',
          });
        }
      });
    };

    // Start traversing from the root DL
    traverse(rootDl);
    return result;
  };

  /**
   * Handles the file input change event.
   */
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // We only accept HTML files
    if (!file.name.toLowerCase().endsWith('.html')) {
      setErrorMessage('Please select an HTML file (usually named "bookmarks_date.html").');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const htmlContent = e.target.result;
      const parser = new DOMParser();
      
      // Use DOMParser to safely parse the HTML content
      const doc = parser.parseFromString(htmlContent, 'text/html');

      const parsedData = parseBookmarks(doc);
      if (parsedData.length > 0) {
        setBookmarks(parsedData);
        setErrorMessage(`Successfully loaded ${parsedData.length} bookmarks!`);
      } else if (!errorMessage) {
        setErrorMessage("Found 0 bookmarks. Check if your file is valid.");
      }
    };
    reader.readAsText(file);
  };
  
  // Filter bookmarks based on search term (title, URL, folder, or tags)
  const filteredBookmarks = bookmarks.filter(bookmark => {
    const term = searchTerm.toLowerCase();
    return (
      bookmark.title.toLowerCase().includes(term) ||
      bookmark.url.toLowerCase().includes(term) ||
      bookmark.folder.toLowerCase().includes(term) ||
      bookmark.tags.toLowerCase().includes(term)
    );
  });
  
  // Wait until the token check has run and redirected if necessary
  if (!localStorage.getItem('authToken')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Redirecting...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col pt-20"> {/* pt-20 for fixed header */}
      
      {/* 1. FIXED HEADER/NAVBAR */}
      <div className="fixed top-0 z-10 w-full bg-white shadow-xl flex justify-center">
        <div className="w-full max-w-6xl flex justify-between items-center px-8 py-4">
          <h1 className="text-3xl font-bold text-indigo-600">
            Bookmark Viewer 🔖
          </h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* 2. MAIN CONTENT & FILE INPUT */}
      <div className="w-full max-w-6xl mx-auto p-8">
        
        {/* Input Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Load Your Chrome Bookmarks</h2>
          
          <label className="block mb-4">
            <span className="sr-only">Choose bookmarks file</span>
            <input 
              type="file"
              accept=".html"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-indigo-50 file:text-indigo-700
                hover:file:bg-indigo-100"
            />
          </label>
          
          {errorMessage && (
            <p className={`text-sm font-medium ${errorMessage.startsWith('Successfully') ? 'text-green-600' : 'text-red-600'}`}>
              {errorMessage}
            </p>
          )}

        </div>

        {/* 3. BOOKMARK DISPLAY AREA */}
        {bookmarks.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {filteredBookmarks.length} of {bookmarks.length} Bookmarks Loaded
            </h3>
            
            <input 
              type="text"
              placeholder="Search by title, folder, or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 w-full mb-6 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[70vh] overflow-y-auto pr-2">
              {filteredBookmarks.map((b, index) => (
                <a 
                  key={index}
                  href={b.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-gray-200"
                >
                  <h4 className="text-lg font-semibold text-indigo-700 truncate">{b.title}</h4>
                  <p className="text-xs text-gray-500 truncate mt-1">{b.url}</p>
                  
                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-medium text-gray-600 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      {b.folder}
                    </p>
                    {b.tags && (
                      <p className="text-xs font-mono text-purple-600 bg-purple-100 inline-block px-2 py-0.5 rounded-full">
                        {b.tags.split(',').join(', ')}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default Home;
