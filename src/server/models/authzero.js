import Promise from 'bluebird';
import mongoose from 'mongoose';
import encrypt from 'mongoose-encryption';
import dotenv from 'dotenv';

import { addSecondsToDate, isTokenExpired } from '../utils';
import { getAccessToken } from '../services/authzero';

dotenv.config();

const encryptionKey = process.env.MONGOOSE_ENCRYPT_ENCKEY;
const signingKey = process.env.MONGOOSE_ENCRYPT_SIGKEY;

const authzeroSchema = new mongoose.Schema({
  accessToken: {
    type: String,
    required: true
  },
  expiresIn: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});


authzeroSchema.plugin(encrypt, { encryptionKey, signingKey });


authzeroSchema.statics.getAccessToken = function() {
  const self = this;

  return this.findOne()
    .sort({ createdAt: 'desc' })
    .exec()
    .then((creds) => {
      if (creds && !isTokenExpired(creds.expiresIn)) {
        return Promise.resolve(creds.accessToken);
      }
      else {
        return getAccessToken().then(({ accessToken, expiresIn }) => {
          const creds = new self(
            { accessToken, expiresIn: addSecondsToDate(expiresIn) }
          );
          creds.save().catch((err) => Promise.reject(err));
          return Promise.resolve(accessToken);
        })
        .catch((err) => Promise.reject(err));

      }
    })
  .catch((err) => console.log('ERR', err));
};


module.exports = mongoose.model('Authzero', authzeroSchema);
