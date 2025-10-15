 
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {  
    type: String,
    required: [true, 'Please provide name'],
    minlength: 3,
    trim: true,  
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
     
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
  },
  password: { 
    type: String,
    required: [true, 'Please provide password'],
    minlength: 6,
  },
});

export default mongoose.model('User', UserSchema);