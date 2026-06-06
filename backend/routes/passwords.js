const express = require('express');
const Password = require('../models/Password');
const { protect } = require('../middleware/auth');
const { encrypt, decrypt } = require('../utils/encryption');
const router = express.Router();

// @route   GET /api/passwords/stats/overview
// @desc    Get password statistics
// @access  Private
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const total = await Password.countDocuments({ user: req.user._id });
    const categories = await Password.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    res.json({ success: true, total, categories });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/passwords
// @desc    Get all passwords for logged in user (decrypted)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const passwords = await Password.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Decrypt passwords before sending
    const decryptedPasswords = passwords.map(p => ({
      ...p,
      password: decrypt(p.password)
    }));

    res.json({ success: true, count: decryptedPasswords.length, passwords: decryptedPasswords });
  } catch (error) {
    console.error('Get passwords error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch passwords',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   POST /api/passwords
// @desc    Create new password entry (encrypted)
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, website, username, password, notes, category } = req.body;

    // Validation
    if (!title || !username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title, username, and password are required' 
      });
    }

    // Encrypt password before storing
    const encryptedPassword = encrypt(password);

    const newPassword = await Password.create({
      user: req.user._id,
      title: title.trim(),
      website: website?.trim() || '',
      username: username.trim(),
      password: encryptedPassword, // AES-256 encrypted
      notes: notes?.trim() || '',
      category: category || 'Other'
    });

    // Return decrypted version for immediate use
    res.status(201).json({ 
      success: true, 
      password: {
        ...newPassword.toObject(),
        password: password // Return plaintext for UI
      }
    });
  } catch (error) {
    console.error('Create password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/passwords/:id
// @desc    Get single password (decrypted)
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const password = await Password.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    }).lean();

    if (!password) {
      return res.status(404).json({ 
        success: false, 
        message: 'Password not found' 
      });
    }

    // Decrypt before sending
    password.password = decrypt(password.password);

    res.json({ success: true, password });
  } catch (error) {
    console.error('Get password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   PUT /api/passwords/:id
// @desc    Update password (encrypt if changed)
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { title, website, username, password, notes, category } = req.body;

    let updateData = { 
      title: title?.trim(), 
      website: website?.trim() || '', 
      username: username?.trim(), 
      notes: notes?.trim() || '', 
      category: category || 'Other' 
    };

    if (password) {
      updateData.password = encrypt(password); // Encrypt new password
    }

    const updatedPassword = await Password.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedPassword) {
      return res.status(404).json({ 
        success: false, 
        message: 'Password not found' 
      });
    }

    // Return decrypted version
    res.json({ 
      success: true, 
      password: {
        ...updatedPassword.toObject(),
        password: password || decrypt(updatedPassword.password)
      }
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   DELETE /api/passwords/:id
// @desc    Delete password
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const password = await Password.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!password) {
      return res.status(404).json({ 
        success: false, 
        message: 'Password not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Password deleted successfully' 
    });
  } catch (error) {
    console.error('Delete password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete password',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;
