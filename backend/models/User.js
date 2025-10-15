 
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {  
    type: String,
    required: [true, 'Please provide name'],
    minlength: 2,
    trim: true,  
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    trim: true,
    lowercase: true,
     
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
  },
  password: { 
    type: String,
    required: [true, 'Please provide password'],
    minlength: 4,
  },
  bookmarks:[
    {
      type: mongoose.Schema.Types.ObjectId,
    ref: 'Bookmark'

    }
    

  ]
},{timestamps:true});

UserSchema.pre('save',async function (next){
  if(!this.isModified('password')){
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password= await bcrypt.hash(this.password,salt);
  next();
});
UserSchema.method.matchPassword=async function (enteredPassword){
  return await bcrypt.compare(enteredPassword,this.password);

}
const User = mongoose.model('User',UserSchema);
export default User;