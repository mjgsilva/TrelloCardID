import mongoose from 'mongoose';
import encrypt from 'mongoose-encryption';
import dotenv from 'dotenv';

dotenv.config();

const encryptionKey = process.env.MONGOOSE_ENCRYPT_ENCKEY;
const signingKey = process.env.MONGOOSE_ENCRYPT_SIGKEY;

const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true
  },
  tokenSecret: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});


tokenSchema.index({ token: 1 });


tokenSchema.plugin(encrypt, {
  encryptionKey,
  signingKey,
  encryptedFields: ['tokenSecret']
});


tokenSchema.statics.getTokenSecret = function(token) {
  return this.findOne({ token }).exec();
}


module.exports = mongoose.model('Token', tokenSchema);
