'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseEncryption = require('mongoose-encryption');

var _mongooseEncryption2 = _interopRequireDefault(_mongooseEncryption);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const encryptionKey = process.env.MONGOOSE_ENCRYPT_ENCKEY;
const signingKey = process.env.MONGOOSE_ENCRYPT_SIGKEY;

const accessTokenSchema = new _mongoose2.default.Schema({
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
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

accessTokenSchema.index({ token: 1 });

accessTokenSchema.plugin(_mongooseEncryption2.default, {
  encryptionKey,
  signingKey,
  encryptedFields: ['accessTokenSecret']
});

accessTokenSchema.statics.getAccessToken = function (owner) {
  return this.findOne({ _owner: owner }).sort({ createdAt: 'desc' }).limit(1).exec();
};

module.exports = _mongoose2.default.model('AccessToken', accessTokenSchema);