'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const entrySchema = new _mongoose2.default.Schema({
  id: {
    type: String,
    required: true
  },
  shortID: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  _counter: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'Counter',
    required: true
  }
});

entrySchema.index({ id: 1 });

module.exports = _mongoose2.default.model('Entry', entrySchema);