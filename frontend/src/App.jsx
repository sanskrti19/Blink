import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    const res = await axios.get("http://localhost:5000/api/bookmarks");
    setBookmarks(res.data);
  };

  const addBookmark = async () => {
    if (!title || !url) return;
    await axios.post("http://localhost:5000/api/bookmarks", { title, url });
    setTitle(""); setUrl("");
    fetchBookmarks();
  };

  const deleteBookmark = async (id) => {
    await axios.delete(`http://localhost:5000/api/bookmarks/${id}`);
    fetchBookmarks();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Blink</h1>
      
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Title"
          className="border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL"
          className="border p-2 rounded"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={addBookmark} className="bg-blue-500 text-white p-2 rounded">
          Add
        </button>
      </div>

      <ul>
        {bookmarks.map((b) => (
          <li key={b._id} className="mb-2 flex justify-between border p-2 rounded">
            <a href={b.url} target="_blank" className="text-blue-600">{b.title}</a>
            <button onClick={() => deleteBookmark(b._id)} className="text-red-500">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
