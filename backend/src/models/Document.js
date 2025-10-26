const mongoose = require('mongoose');

const chunkSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  embedding: {
    type: [Number],
    required: true
  },
  index: {
    type: Number,
    required: true
  }
});

const documentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['resume', 'jd'],
    required: true
  },
  filename: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String
  },
  cloudinaryPublicId: {
    type: String
  },
  chunks: [chunkSchema],
  rawText: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
documentSchema.index({ userId: 1, type: 1 });

module.exports = mongoose.model('Document', documentSchema);
