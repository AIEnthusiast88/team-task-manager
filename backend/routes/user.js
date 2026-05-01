const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get all users (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ msg: 'Admins only' });
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Delete user (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ msg: 'Admins only' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ msg: 'User deleted' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

module.exports = router;