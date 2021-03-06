import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});


userSchema.index({ email: 1 });


userSchema.statics.getUserID = function (email) {
  return this.findOne({ email }, { _id: 1 }).exec();
};


module.exports = mongoose.model('User', userSchema);
