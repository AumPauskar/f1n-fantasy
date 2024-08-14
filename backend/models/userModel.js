import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  passwd: {
    type: String,
    required: true
  }
});

// Create the model
const User = mongoose.model('User', userSchema);

export default User;