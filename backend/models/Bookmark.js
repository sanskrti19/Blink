// backend/models/Bookmark.js
import mongoose from 'mongoose';
const BookmarkSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    url: { type: String, required: true },
    category: { type: String, default: 'Unsorted' },
    tags: [{ type: String }],
    dateAdded: { type: Date, default: Date.now }
});
export default mongoose.model('Bookmark', BookmarkSchema);