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

const tokenSchema = new _mongoose2.default.Schema({
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
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

tokenSchema.index({ token: 1 });

tokenSchema.plugin(_mongooseEncryption2.default, {
  encryptionKey,
  signingKey,
  encryptedFields: ['tokenSecret']
});

tokenSchema.statics.getTokenSecret = function (token) {
  return this.findOne({ token }).exec();
};

module.exports = _mongoose2.default.model('Token', tokenSchema);