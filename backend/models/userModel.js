import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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


// hash the password before saving it to the database
// Hash the password before saving the user
userSchema.pre('save', async function(next) {
  if (!this.isModified('passwd')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.passwd = await bcrypt.hash(this.passwd, salt);
  next();
});

// Create the model
const User = mongoose.model('User', userSchema);

export default User;