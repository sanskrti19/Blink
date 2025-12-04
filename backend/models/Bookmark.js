import mongoose from 'mongoose';
 
const bookmarkSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  url: { type: String, required: true },
  folder: { type: String, default: 'Uncategorized' },
  tags: [
    {
      name: { type: String, required: true },
      color: { type: String, required: true },
    },
  ],
}, { timestamps: true });

 
const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
