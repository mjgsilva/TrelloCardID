import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Counter',
    required: true
  }
});


entrySchema.index({ id: 1 });


module.exports = mongoose.model('Entry', entrySchema);
