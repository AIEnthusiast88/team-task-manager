const router = require('express').Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');

// Get all projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find().populate('createdBy', 'name email').populate('members', 'name email');
    res.json(projects);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Create project (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ msg: 'Admins only' });
    const project = await Project.create({ ...req.body, createdBy: req.user.id });
    res.json(project);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Update project (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ msg: 'Admins only' });
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(project);
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

// Delete project (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'Admin') return res.status(403).json({ msg: 'Admins only' });
    await Project.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Project deleted' });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

module.exports = router;