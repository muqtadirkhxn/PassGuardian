const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  website: {
    type: String,
    trim: true,
    default: ''
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true
  },
  // NOTE: We store passwords in plaintext for the user's ability to retrieve them.
  // In production, consider client-side encryption before sending to server.
  password: {
    type: String,
    required: [true, 'Password is required']
  },
  notes: {
    type: String,
    default: '',
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  category: {
    type: String,
    enum: {
      values: ['Social', 'Work', 'Finance', 'Shopping', 'Entertainment', 'Other'],
      message: 'Category must be Social, Work, Finance, Shopping, Entertainment, or Other'
    },
    default: 'Other'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

passwordSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

passwordSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

// Prevent model re-registration on hot reload (Vercel serverless fix)
module.exports = mongoose.models.Password || mongoose.model('Password', passwordSchema);
