import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = 'https://team-task-manager-backend-wkzs.onrender.com'

export default function Deadlines() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const projectsRes = await axios.get(`${API}/api/projects`, { headers })
        const projects = projectsRes.data
        let allTasks = []
        for (const project of projects) {
          const tasksRes = await axios.get(`${API}/api/tasks/project/${project._id}`, { headers })
          allTasks = [...allTasks, ...tasksRes.data.map(t => ({ ...t, projectName: project.name }))]
        }
        const withDueDate = allTasks.filter(t => t.dueDate && t.status !== 'Done')
        withDueDate.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        setTasks(withDueDate)
        setLoading(false)
      } catch (err) { setLoading(false) }
    }
    fetchAllTasks()
  }, [])

  const getStatus = (dueDate) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24))
    if (diffDays < 0) return { label: `${Math.abs(diffDays)}d overdue`, color: '#ef4444', bg: '#7f1d1d' }
    if (diffDays === 0) return { label: 'Due today', color: '#f97316', bg: '#7c2d12' }
    if (diffDays <= 3) return { label: `${diffDays}d left`, color: '#f59e0b', bg: '#78350f' }
    return { label: `${diffDays}d left`, color: '#22c55e', bg: '#14532d' }
  }

  const priorityColor = { High: '#ef4444', Medium: '#f59e0b', Low: '#22c55e' }

  const overdue = tasks.filter(t => new Date(t.dueDate) < new Date())
  const dueToday = tasks.filter(t => {
    const d = new Date(t.dueDate)
    const today = new Date()
    return d.toDateString() === today.toDateString()
  })
  const upcoming = tasks.filter(t => new Date(t.dueDate) > new Date())

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>🚀 TaskManager</h2>
        <nav>
          <p style={styles.navItem} onClick={() => navigate('/')}>🏠 Dashboard</p>
          <p style={styles.navItem} onClick={() => navigate('/projects')}>📁 Projects</p>
          <p style={styles.navItem} onClick={() => navigate('/analytics')}>📊 Analytics</p>
          {user?.role === 'Admin' && <p style={styles.navItem} onClick={() => navigate('/users')}>👥 Users</p>}
          <p style={{...styles.navItem, background:'#334155'}} onClick={() => navigate('/deadlines')}>⏰ Deadlines</p>
        </nav>
        <div style={styles.userBox}>
          <p style={styles.userName}>{user?.name}</p>
          <p style={styles.userRole}>{user?.role}</p>
          <button style={styles.logoutBtn} onClick={() => { localStorage.clear(); navigate('/login') }}>Logout</button>
        </div>
      </div>
      <div style={styles.main}>
        <h1 style={styles.heading}>⏰ Deadline Tracker</h1>

        <div style={styles.alertsRow}>
          {overdue.length > 0 && (
            <div style={{...styles.alert, borderColor: '#ef4444', background: '#7f1d1d22'}}>
              <span style={{color: '#ef4444', fontWeight: 'bold'}}>🔴 {overdue.length} Overdue Tasks</span>
              <p style={{color: '#94a3b8', fontSize: '13px', marginTop: '4px'}}>These tasks need immediate attention!</p>
            </div>
          )}
          {dueToday.length > 0 && (
            <div style={{...styles.alert, borderColor: '#f97316', background: '#7c2d1222'}}>
              <span style={{color: '#f97316', fontWeight: 'bold'}}>🟠 {dueToday.length} Due Today</span>
              <p style={{color: '#94a3b8', fontSize: '13px', marginTop: '4px'}}>Complete these before end of day!</p>
            </div>
          )}
          {overdue.length === 0 && dueToday.length === 0 && (
            <div style={{...styles.alert, borderColor: '#22c55e', background: '#14532d22'}}>
              <span style={{color: '#22c55e', fontWeight: 'bold'}}>✅ All caught up!</span>
              <p style={{color: '#94a3b8', fontSize: '13px', marginTop: '4px'}}>No overdue or due-today tasks.</p>
            </div>
          )}
        </div>

        {loading ? <p style={{color: '#94a3b8'}}>Loading tasks...</p> : (
          <div>
            {tasks.length === 0 ? (
              <div style={styles.emptyBox}>
                <p style={{fontSize: '48px'}}>🎉</p>
                <p style={{color: '#94a3b8'}}>No pending deadlines! All tasks are either done or have no due date.</p>
              </div>
            ) : (
              tasks.map(task => {
                const status = getStatus(task.dueDate)
                return (
                  <div key={task._id} style={{...styles.taskCard, borderLeft: `4px solid ${status.color}`}}>
                    <div style={styles.taskLeft}>
                      <h4 style={styles.taskTitle}>{task.title}</h4>
                      <p style={styles.taskProject}>📁 {task.projectName}</p>
                      {task.assignedTo && <p style={styles.taskAssigned}>👤 {task.assignedTo.name}</p>}
                    </div>
                    <div style={styles.taskRight}>
                      <span style={{...styles.priorityBadge, color: priorityColor[task.priority]}}>
                        {task.priority} Priority
                      </span>
                      <span style={{...styles.deadlineBadge, background: status.bg, color: status.color}}>
                        {status.label}
                      </span>
                      <p style={styles.dueDate}>
                        📅 {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', background: '#0f172a', color: '#fff' },
  sidebar: { width: '240px', background: '#1e293b', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'sticky', top: 0, height: '100vh' },
  logo: { color: '#6366f1', marginBottom: '32px' },
  navItem: { padding: '12px', borderRadius: '8px', cursor: 'pointer', color: '#94a3b8', marginBottom: '8px' },
  userBox: { borderTop: '1px solid #334155', paddingTop: '16px' },
  userName: { color: '#fff', fontWeight: 'bold', marginBottom: '4px' },
  userRole: { color: '#6366f1', fontSize: '12px', marginBottom: '12px' },
  logoutBtn: { width: '100%', padding: '8px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' },
  heading: { fontSize: '28px', marginBottom: '24px' },
  alertsRow: { display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap' },
  alert: { padding: '16px 20px', borderRadius: '10px', border: '1px solid', flex: 1, minWidth: '200px' },
  taskCard: { background: '#1e293b', padding: '20px 24px', borderRadius: '10px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  taskLeft: {},
  taskTitle: { color: '#fff', marginBottom: '6px', fontSize: '15px' },
  taskProject: { color: '#94a3b8', fontSize: '13px', marginBottom: '4px' },
  taskAssigned: { color: '#64748b', fontSize: '12px' },
  taskRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' },
  priorityBadge: { fontSize: '12px', fontWeight: 'bold' },
  deadlineBadge: { padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold' },
  dueDate: { color: '#64748b', fontSize: '12px' },
  emptyBox: { background: '#1e293b', padding: '60px', borderRadius: '12px', textAlign: 'center' }
}