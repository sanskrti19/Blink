// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { // <--- NEWLY ADDED NAME FIELD
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    trim: true, // Removes whitespace from both ends of a string
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    // Simple email validation regex
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
  },
  password: { // Stores the BCRYPT HASHED password
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
});

export default mongoose.model('User', UserSchema);