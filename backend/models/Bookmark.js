import mongoose from 'mongoose';

const BookmarkSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    url: {
        type: String,
        required: true,
        trim: true,
    },
    folder: {
        type: String,
        default: 'Uncategorized',
        trim: true,
    },
 
    tags: {
        type: [String], 
        trim: true,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Bookmark', BookmarkSchema);
