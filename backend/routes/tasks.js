const router = require('express').Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// Get tasks by project
router.get('/project/:projectId', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Create task (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ msg: 'Admins only' });
    const task = await Task.create(req.body);
    res.json(task);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Update task status (Member can update status only, Admin can update all)
router.put('/:id', auth, async (req, res) => {
  try {
    let updateData = req.body;
    if (req.user.role === 'Member') {
      updateData = { status: req.body.status }; // Members can only change status
    }
    const task = await Task.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(task);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Delete task (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ msg: 'Admins only' });
    await Task.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Task deleted' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

module.exports = router;