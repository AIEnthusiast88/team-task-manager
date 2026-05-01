const router = require('express').Router();
const auth = require('../middleware/auth');
const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

router.get('/', auth, async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const totalTasks = await Task.countDocuments();
    const totalUsers = await User.countDocuments();
    const todoTasks = await Task.countDocuments({ status: 'Todo' });
    const inProgressTasks = await Task.countDocuments({ status: 'In Progress' });
    const doneTasks = await Task.countDocuments({ status: 'Done' });
    const highPriority = await Task.countDocuments({ priority: 'High' });
    const mediumPriority = await Task.countDocuments({ priority: 'Medium' });
    const lowPriority = await Task.countDocuments({ priority: 'Low' });

    // Overdue tasks
    const overdueTasks = await Task.countDocuments({
      dueDate: { $lt: new Date() },
      status: { $ne: 'Done' }
    });

    // Due today
    const today = new Date();
    const todayStart = new Date(today.setHours(0,0,0,0));
    const todayEnd = new Date(today.setHours(23,59,59,999));
    const dueTodayTasks = await Task.countDocuments({
      dueDate: { $gte: todayStart, $lte: todayEnd },
      status: { $ne: 'Done' }
    });

    res.json({
      totalProjects, totalTasks, totalUsers,
      tasksByStatus: { todo: todoTasks, inProgress: inProgressTasks, done: doneTasks },
      tasksByPriority: { high: highPriority, medium: mediumPriority, low: lowPriority },
      overdueTasks, dueTodayTasks,
      completionRate: totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0
    });
  } catch (err) { res.status(500).json({ msg: err.message }); }
});

module.exports = router;