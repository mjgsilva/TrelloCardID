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
    required: true,
  },
  expiresIn: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});


authzeroSchema.plugin(encrypt, { encryptionKey, signingKey });


authzeroSchema.statics.getAccessToken = function () {
  const Self = this;

  return this.findOne()
    .sort({ createdAt: 'desc' })
    .exec()
    .then((creds) => {
      if (creds && !isTokenExpired(creds.expiresIn)) {
        return Promise.resolve(creds.accessToken);
      }

      return getAccessToken().then(({ accessToken, expiresIn }) => {
        const newCreds = new Self(
          {
            accessToken,
            expiresIn: addSecondsToDate(expiresIn),
          },
        );

        return newCreds.save()
          .then(() => Promise.resolve(accessToken))
          .catch(err => Promise.reject(err));
      })
        .then(accessToken => Promise.resolve(accessToken))
        .catch(err => Promise.reject(err));
    })
    .catch(() => {});
};


module.exports = mongoose.model('Authzero', authzeroSchema);
