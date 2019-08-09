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

entrySchema.statics.getStats = function (userID) {
  const limit = new Date();
  limit.setDate(limit.getDate() - 7);

  return this.aggregate([{
    $lookup: {
      from: 'counters',
      localField: '_counter',
      foreignField: '_id',
      as: 'counter'
    }
  }, {
    $unwind: {
      path: '$counter',
      preserveNullAndEmptyArrays: false
    }
  }, {
    $match: {
      'counter._owner': _mongoose2.default.Types.ObjectId(userID._id),
      createdAt: { $gte: limit }
    }
  }, {
    $project: {
      counter: { boardName: 1, _owner: 1 },
      createdAt: 1
    }
  }, {
    $group: {
      _id: {
        $subtract: [{ $subtract: ['$createdAt', new Date('1970-01-01')]
        }, { $mod: [{ $subtract: ['$createdAt', new Date('1970-01-01')] }, 1000 * 60 * 60 * 24] }]
      },
      entries: { $sum: 1 }
    }
  }]).cursor().exec().toArray();
};

entrySchema.statics.getRecentEntries = function (userID) {
  const limit = new Date();
  limit.setDate(limit.getDate() - 7);

  return this.aggregate([{
    $lookup: {
      from: 'counters',
      localField: '_counter',
      foreignField: '_id',
      as: 'counter'
    }
  }, {
    $unwind: {
      path: '$counter',
      preserveNullAndEmptyArrays: false
    }
  }, {
    $match: {
      'counter._owner': _mongoose2.default.Types.ObjectId(userID._id),
      createdAt: { $gte: limit }
    }
  }, {
    $project: {
      counter: { boardName: 1, _owner: 1 },
      createdAt: 1
    }
  }]).cursor().exec().toArray();
};

module.exports = _mongoose2.default.model('Entry', entrySchema);