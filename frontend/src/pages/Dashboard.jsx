 import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
       const token = localStorage.getItem('token'); 
      if (!token) {
        setLoading(false);
         return; 
      }
      
      try {
        const config = {
          headers: {
           
            Authorization: `Bearer ${token}`, 
          },
        };
      
        const { data } = await axios.get('/api/bookmarks', config); 
        
        setBookmarks(data); // ⬅️ THIS SAVES THE DATA TO REACT STATE
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookmarks:', error);
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);  
 
  if (loading) return <div>Loading your saved bookmarks...</div>;

  return (
    <div>
      <h2>Your Organized Links</h2>
      {bookmarks.length > 0 ? (
        // Map over the bookmarks state to render them
        bookmarks.map(bm => (
          <div key={bm._id}>
            <a href={bm.url}>{bm.title}</a>
            <span>Folder: {bm.folder}</span>
          </div>
        ))
      ) : (
        <p>No bookmarks found. Please upload an HTML file.</p>
      )}
    </div>
  );
}

export default Dashboard;