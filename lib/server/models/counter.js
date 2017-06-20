'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

const counterSchema = new _mongoose2.default.Schema({
  boardTrelloID: {
    type: String,
    required: true,
    unique: true
  },
  boardName: {
    type: String,
    required: true
  },
  prefix: {
    type: String,
    required: true
  },
  counter: {
    type: Number,
    required: true,
    default: 1
  },
  separator: {
    type: String,
    required: true
  },
  webhookID: {
    type: String
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

counterSchema.index({ boardTrelloID: 1 });

counterSchema.statics.getCounters = function (ownerID) {
  return this.find({ _owner: ownerID }).exec();
};

counterSchema.statics.getCounter = function (boardTrelloID) {
  return this.findOne({ boardTrelloID }).exec();
};

counterSchema.statics.getCounterOwner = function (boardTrelloID, _owner) {
  return this.findOne({ boardTrelloID, _owner }, { webhookID: 1 }).exec();
};

counterSchema.statics.updateCounter = function (id, counter) {
  return this.update({ _id: id }, { $set: { counter } }).exec();
};

counterSchema.statics.updateWebhook = function (id, webhookID) {
  return this.update({ _id: id }, { $set: { webhookID } }).exec();
};

counterSchema.statics.deleteCounter = function (id) {
  return this.remove({ _id: id }).exec();
};

module.exports = _mongoose2.default.model('Counter', counterSchema);