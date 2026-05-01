import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

export default function Tasks() {
  const { projectId } = useParams()
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', dueDate: '', priority: 'Medium' })
  const [error, setError] = useState('')
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const headers = { Authorization: `Bearer ${token}` }

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/project/${projectId}`, { headers })
      setTasks(res.data)
    } catch (err) { setError('Failed to fetch tasks') }
  }

  useEffect(() => { fetchTasks() }, [projectId])

  const createTask = async () => {
    if (!form.title) return setError('Task title is required')
    try {
      await axios.post('http://localhost:5000/api/tasks', { ...form, project: projectId }, { headers })
      setForm({ title: '', description: '', assignedTo: '', dueDate: '', priority: 'Medium' })
      fetchTasks()
    } catch (err) { setError(err.response?.data?.msg || 'Failed to create task') }
  }

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, { status }, { headers })
      fetchTasks()
    } catch (err) { setError('Failed to update status') }
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, { headers })
      fetchTasks()
    } catch (err) { setError('Failed to delete task') }
  }

  const statusColor = { 'Todo': '#f59e0b', 'In Progress': '#6366f1', 'Done': '#22c55e' }
  const priorityColor = { 'Low': '#22c55e', 'Medium': '#f59e0b', 'High': '#ef4444' }

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>🚀 TaskManager</h2>
        <nav>
          <p style={styles.navItem} onClick={() => navigate('/')}>🏠 Dashboard</p>
          <p style={styles.navItem} onClick={() => navigate('/projects')}>📁 Projects</p>
        </nav>
        <div style={styles.userBox}>
          <p style={styles.userName}>{user?.name}</p>
          <p style={styles.userRole}>{user?.role}</p>
          <button style={styles.logoutBtn} onClick={() => { localStorage.clear(); navigate('/login') }}>Logout</button>
        </div>
      </div>
      <div style={styles.main}>
        <h1 style={styles.heading}>✅ Tasks</h1>
        {error && <p style={styles.error}>{error}</p>}

        {user?.role === 'Admin' && (
          <div style={styles.form}>
            <h3 style={styles.formTitle}>Create New Task</h3>
            <input style={styles.input} placeholder="Task Title" value={form.title}
              onChange={e => setForm({...form, title: e.target.value})} />
            <input style={styles.input} placeholder="Description" value={form.description}
              onChange={e => setForm({...form, description: e.target.value})} />
            <input style={styles.input} placeholder="Assigned To (User ID)" value={form.assignedTo}
              onChange={e => setForm({...form, assignedTo: e.target.value})} />
            <input style={styles.input} type="date" value={form.dueDate}
              onChange={e => setForm({...form, dueDate: e.target.value})} />
            <select style={styles.input} value={form.priority}
              onChange={e => setForm({...form, priority: e.target.value})}>
              <option value="Low">Low Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="High">High Priority</option>
            </select>
            <button style={styles.btn} onClick={createTask}>+ Create Task</button>
          </div>
        )}

        <div style={styles.columns}>
          {['Todo', 'In Progress', 'Done'].map(status => (
            <div key={status} style={styles.column}>
              <h3 style={{...styles.columnTitle, color: statusColor[status]}}>{status}</h3>
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task._id} style={styles.card}>
                  <h4 style={styles.taskTitle}>{task.title}</h4>
                  <p style={styles.taskDesc}>{task.description}</p>
                  <span style={{...styles.priority, background: priorityColor[task.priority]}}>
                    {task.priority}
                  </span>
                  {task.dueDate && <p style={styles.due}>Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
                  {task.assignedTo && <p style={styles.assigned}>👤 {task.assignedTo.name}</p>}
                  <select style={styles.statusSelect} value={task.status}
                    onChange={e => updateStatus(task._id, e.target.value)}>
                    <option value="Todo">Todo</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                  {user?.role === 'Admin' && (
                    <button style={styles.deleteBtn} onClick={() => deleteTask(task._id)}>🗑 Delete</button>
                  )}
                </div>
              ))}
              {tasks.filter(t => t.status === status).length === 0 &&
                <p style={styles.empty}>No tasks</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', background: '#0f172a', color: '#fff' },
  sidebar: { width: '240px', background: '#1e293b', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  logo: { color: '#6366f1', marginBottom: '32px' },
  navItem: { padding: '12px', borderRadius: '8px', cursor: 'pointer', color: '#94a3b8', marginBottom: '8px' },
  userBox: { borderTop: '1px solid #334155', paddingTop: '16px' },
  userName: { color: '#fff', fontWeight: 'bold', marginBottom: '4px' },
  userRole: { color: '#6366f1', fontSize: '12px', marginBottom: '12px' },
  logoutBtn: { width: '100%', padding: '8px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  main: { flex: 1, padding: '40px', overflowY: 'auto' },
  heading: { fontSize: '28px', marginBottom: '24px' },
  error: { color: '#f87171', marginBottom: '12px' },
  form: { background: '#1e293b', padding: '24px', borderRadius: '12px', marginBottom: '32px' },
  formTitle: { color: '#6366f1', marginBottom: '16px' },
  input: { width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '14px', boxSizing: 'border-box' },
  btn: { padding: '12px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  columns: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' },
  column: { background: '#1e293b', padding: '16px', borderRadius: '12px', minHeight: '300px' },
  columnTitle: { fontSize: '16px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' },
  card: { background: '#0f172a', padding: '16px', borderRadius: '8px', marginBottom: '12px' },
  taskTitle: { color: '#fff', marginBottom: '6px' },
  taskDesc: { color: '#94a3b8', fontSize: '13px', marginBottom: '8px' },
  priority: { fontSize: '11px', padding: '2px 8px', borderRadius: '999px', color: '#000', fontWeight: 'bold' },
  due: { color: '#64748b', fontSize: '12px', marginTop: '8px' },
  assigned: { color: '#94a3b8', fontSize: '12px', marginTop: '4px' },
  statusSelect: { width: '100%', padding: '8px', marginTop: '10px', borderRadius: '6px', border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: '13px' },
  deleteBtn: { width: '100%', padding: '6px', marginTop: '8px', background: '#7f1d1d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  empty: { color: '#475569', textAlign: 'center', fontSize: '13px' }
}