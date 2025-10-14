import mongoose from 'mongoose';
 

const BookmarkSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    description: String,
    tags: [String],
    
    // *** NEW FIELD FOR AUTHENTICATION ***
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        required: true 
    }
    // *************************************
});

export default mongoose.model('Bookmark', BookmarkSchema);