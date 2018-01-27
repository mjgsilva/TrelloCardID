import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const counterSchema = new mongoose.Schema({
  boardTrelloID: {
    type: String,
    required: true,
    unique: true,
  },
  boardName: {
    type: String,
    required: true,
  },
  prefix: {
    type: String,
//  required: true,
    default: '',
  },
  counter: {
    type: Number,
    required: true,
    default: 1,
  },
  separator: {
    type: String,
//  required: true,
    default: '',
  },
  webhookID: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
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

module.exports = mongoose.model('Counter', counterSchema);
