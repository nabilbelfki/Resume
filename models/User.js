import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  avatar: {type: String, required: false},
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  birthday: { type: Date, required: false },
  phoneNumber: { type: String, required: false },
  role: { type: String, required: false },
  status: { type: String, required: false },
  address: { 
    addressOne: { type: String, required: false},
    addressTwo: { type: String, required: false},
    city: { type: String, required: false},
    state: { type: String, required: false},
    zipCode: { type: String, required: false},
    country: { type: String, required: false}
  },
  created: { type: Date, required: true}
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
