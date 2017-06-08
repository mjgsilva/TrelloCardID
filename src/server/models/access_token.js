import mongoose from 'mongoose';
import encrypt from 'mongoose-encryption';
import dotenv from 'dotenv';

dotenv.config();

const encryptionKey = process.env.MONGOOSE_ENCRYPT_ENCKEY;
const signingKey = process.env.MONGOOSE_ENCRYPT_SIGKEY;

const accessTokenSchema = new mongoose.Schema({
  accessToken: {
    type: String,
    required: true
  },
  accessTokenSecret: {
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


accessTokenSchema.index({ token: 1 });


accessTokenSchema.plugin(encrypt, {
  encryptionKey,
  signingKey,
  encryptedFields: ['accessTokenSecret']
});


accessTokenSchema.statics.getAccessToken = function(owner) {
  return this.findOne({ _owner: owner }).sort({ createdAt : 'desc'}).limit(1).exec();
}


module.exports = mongoose.model('AccessToken', accessTokenSchema);
