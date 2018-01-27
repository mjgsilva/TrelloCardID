'use strict';

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseEncryption = require('mongoose-encryption');

var _mongooseEncryption2 = _interopRequireDefault(_mongooseEncryption);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _utils = require('../utils');

var _authzero = require('../services/authzero');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const encryptionKey = process.env.MONGOOSE_ENCRYPT_ENCKEY;
const signingKey = process.env.MONGOOSE_ENCRYPT_SIGKEY;

const authzeroSchema = new _mongoose2.default.Schema({
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

authzeroSchema.plugin(_mongooseEncryption2.default, { encryptionKey, signingKey });

authzeroSchema.statics.getAccessToken = function () {
  const Self = this;

  return this.findOne().sort({ createdAt: 'desc' }).exec().then(creds => {
    if (creds && !(0, _utils.isTokenExpired)(creds.expiresIn)) {
      return _bluebird2.default.resolve(creds.accessToken);
    }

    return (0, _authzero.getAccessToken)().then(({ accessToken, expiresIn }) => {
      const newCreds = new Self({
        accessToken,
        expiresIn: (0, _utils.addSecondsToDate)(expiresIn)
      });

      return newCreds.save().then(() => _bluebird2.default.resolve(accessToken)).catch(err => _bluebird2.default.reject(err));
    }).then(accessToken => _bluebird2.default.resolve(accessToken)).catch(err => _bluebird2.default.reject(err));
  }).catch(err => {
    _logger2.default.logError(new Error(err));
    return _bluebird2.default.reject(err);
  });
};

module.exports = _mongoose2.default.model('Authzero', authzeroSchema);