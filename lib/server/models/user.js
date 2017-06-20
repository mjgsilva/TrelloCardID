'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const userSchema = new _mongoose2.default.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

userSchema.index({ email: 1 });

userSchema.statics.getUserID = function (email) {
  return this.findOne({ email }, { _id: 1 }).exec();
};

module.exports = _mongoose2.default.model('User', userSchema);