import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

const API = 'https://team-task-manager-backend-wkzs.onrender.com'

export default function Tasks() {
  const { projectId } = useParams()
  const [tasks, setTasks] = useState([])
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', dueDate: '', priority: 'Medium' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const headers = { Authorization: `Bearer ${token}` }

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API}/api/tasks/project/${projectId}`, { headers })
      setTasks(res.data)
    } catch (err) { setError('Failed to fetch tasks') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchTasks() }, [projectId])

  const createTask = async () => {
    if (!form.title) return setError('Task title is required')
    setCreating(true)
    try {
      await axios.post(`${API}/api/tasks`, { ...form, project: projectId }, { headers })
      setForm({ title: '', description: '', assignedTo: '', dueDate: '', priority: 'Medium' })
      setShowForm(false); fetchTasks()
    } catch (err) { setError(err.response?.data?.msg || 'Failed to create task') }
    finally { setCreating(false) }
  }

  const updateStatus = async (id, status) => {
    try { await axios.put(`${API}/api/tasks/${id}`, { status }, { headers }); fetchTasks() }
    catch (err) { setError('Failed to update status') }
  }

  const deleteTask = async (id) => {
    try { await axios.delete(`${API}/api/tasks/${id}`, { headers }); fetchTasks() }
    catch (err) { setError('Failed to delete task') }
  }

  const logout = () => { localStorage.clear(); navigate('/login') }

  const columns = [
    { id: 'Todo', label: 'To Do', color: '#f59e0b', bg: 'rgba(245,158,11,.1)', dot: '#f59e0b' },
    { id: 'In Progress', label: 'In Progress', color: '#6366f1', bg: 'rgba(99,102,241,.1)', dot: '#6366f1' },
    { id: 'Done', label: 'Done', color: '#10b981', bg: 'rgba(16,185,129,.1)', dot: '#10b981' },
  ]

  const priorityConfig = {
    High: { color: '#ef4444', bg: 'rgba(239,68,68,.1)', label: '⬆ High' },
    Medium: { color: '#f59e0b', bg: 'rgba(245,158,11,.08)', label: '→ Medium' },
    Low: { color: '#10b981', bg: 'rgba(16,185,129,.08)', label: '⬇ Low' },
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#050608}
        .app{display:flex;min-height:100vh;font-family:'DM Sans',sans-serif;background:#080a0f;color:#fff}
        .sidebar{width:260px;background:#0d0f14;border-right:1px solid #1a1f2e;display:flex;flex-direction:column;position:sticky;top:0;height:100vh;flex-shrink:0;}
        .sidebar-brand{display:flex;align-items:center;gap:10px;padding:28px 24px 20px;border-bottom:1px solid #1a1f2e;}
        .brand-icon{width:34px;height:34px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px;}
        .brand-name{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:#fff;letter-spacing:-.2px}
        .sidebar-section{padding:20px 16px 8px;font-size:10px;font-weight:600;letter-spacing:1px;color:#374151;text-transform:uppercase}
        .nav-item{display:flex;align-items:center;gap:10px;padding:10px 16px;margin:2px 8px;border-radius:8px;cursor:pointer;color:#6b7280;font-size:14px;font-weight:500;transition:all .15s;}
        .nav-item:hover{background:#1a1f2e;color:#d1d5db}
        .nav-item.active{background:rgba(99,102,241,.12);color:#a5b4fc}
        .nav-icon{font-size:16px;width:20px;text-align:center}
        .sidebar-bottom{margin-top:auto;padding:16px;border-top:1px solid #1a1f2e}
        .user-card{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#111318;border-radius:10px;margin-bottom:10px;}
        .user-avatar{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#6366f1,#8b5cf6);display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:#fff;flex-shrink:0;}
        .user-name{font-size:13px;font-weight:600;color:#e2e8f0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
        .role-badge{font-size:10px;font-weight:600;padding:2px 7px;border-radius:999px;letter-spacing:.3px;}
        .role-badge.admin{background:rgba(99,102,241,.15);color:#a5b4fc;border:1px solid rgba(99,102,241,.2)}
        .role-badge.member{background:rgba(16,185,129,.1);color:#6ee7b7;border:1px solid rgba(16,185,129,.2)}
        .logout-btn{width:100%;padding:10px;background:transparent;color:#4b5563;border:1px solid #1a1f2e;border-radius:8px;font-size:13px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .15s;}
        .logout-btn:hover{background:#1a1f2e;color:#d1d5db}
        .main{flex:1;display:flex;flex-direction:column;overflow:hidden}
        .topbar{display:flex;align-items:center;justify-content:space-between;padding:20px 28px;border-bottom:1px solid #1a1f2e;background:#080a0f;position:sticky;top:0;z-index:10;flex-shrink:0;}
        .topbar-left{display:flex;align-items:center;gap:12px}
        .back-btn{display:flex;align-items:center;gap:6px;padding:8px 12px;background:#0d0f14;border:1px solid #1a1f2e;border-radius:8px;color:#6b7280;font-size:13px;cursor:pointer;transition:all .15s;font-family:'DM Sans',sans-serif;}
        .back-btn:hover{background:#1a1f2e;color:#d1d5db}
        .topbar-title{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:#fff;letter-spacing:-.3px}
        .new-btn{display:flex;align-items:center;gap:7px;padding:10px 18px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;border-radius:9px;font-size:13px;font-family:'Syne',sans-serif;font-weight:600;cursor:pointer;transition:opacity .2s;}
        .new-btn:hover{opacity:.9}
        .content{flex:1;padding:24px 28px;overflow-y:auto}
        .error-box{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);color:#f87171;padding:12px 16px;border-radius:8px;font-size:13px;margin-bottom:20px;}

        /* CREATE FORM */
        .create-form{background:#0d0f14;border:1px solid rgba(99,102,241,.2);border-radius:14px;padding:24px;margin-bottom:24px;}
        .create-form-title{font-family:'Syne',sans-serif;font-size:14px;font-weight:700;color:#fff;margin-bottom:18px}
        .form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px}
        .form-row-3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:12px}
        .field-label{font-size:11px;color:#6b7280;font-weight:600;letter-spacing:.5px;text-transform:uppercase;margin-bottom:6px;display:block}
        .field-input{width:100%;padding:11px 13px;background:#080a0f;border:1px solid #1a1f2e;border-radius:8px;color:#fff;font-size:13px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .2s,box-shadow .2s;}
        .field-input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
        .field-input::placeholder{color:#2d3748}
        .field-select{width:100%;padding:11px 13px;background:#080a0f;border:1px solid #1a1f2e;border-radius:8px;color:#fff;font-size:13px;font-family:'DM Sans',sans-serif;outline:none;cursor:pointer;}
        .field-select:focus{border-color:#6366f1}
        .form-actions{display:flex;gap:10px}
        .create-btn{padding:10px 20px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;border-radius:8px;font-size:13px;font-family:'Syne',sans-serif;font-weight:700;cursor:pointer;}
        .create-btn:disabled{opacity:.5;cursor:not-allowed}
        .cancel-btn{padding:10px 20px;background:transparent;color:#6b7280;border:1px solid #1a1f2e;border-radius:8px;font-size:13px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .15s;}
        .cancel-btn:hover{background:#1a1f2e;color:#d1d5db}

        /* KANBAN */
        .kanban{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;align-items:start}
        .column{background:#0d0f14;border:1px solid #1a1f2e;border-radius:14px;overflow:hidden}
        .col-header{display:flex;align-items:center;justify-content:space-between;padding:16px 18px;border-bottom:1px solid #1a1f2e}
        .col-title{display:flex;align-items:center;gap:8px;font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:#fff}
        .col-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}
        .col-count{font-size:11px;padding:2px 8px;border-radius:999px;font-weight:600}
        .col-body{padding:12px;display:flex;flex-direction:column;gap:10px;min-height:120px}
        
        /* TASK CARD */
        .task-card{background:#111318;border:1px solid #1a1f2e;border-radius:10px;padding:14px;transition:all .15s;position:relative}
        .task-card:hover{border-color:#2d3748}
        .task-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px;gap:8px}
        .task-title{font-size:13px;font-weight:600;color:#e2e8f0;line-height:1.4;flex:1}
        .task-del{background:transparent;border:none;color:#374151;cursor:pointer;font-size:14px;padding:2px;transition:color .15s;flex-shrink:0}
        .task-del:hover{color:#f87171}
        .task-desc{font-size:12px;color:#4b5563;line-height:1.4;margin-bottom:10px}
        .task-tags{display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:10px}
        .priority-tag{font-size:10px;font-weight:600;padding:3px 8px;border-radius:5px;letter-spacing:.3px}
        .due-tag{font-size:10px;color:#4b5563;background:#1a1f2e;padding:3px 8px;border-radius:5px}
        .assigned-tag{font-size:10px;color:#6b7280;background:#1a1f2e;padding:3px 8px;border-radius:5px}
        .task-footer{border-top:1px solid #1a1f2e;padding-top:10px;margin-top:4px}
        .status-select{width:100%;padding:7px 10px;background:#0d0f14;border:1px solid #1a1f2e;border-radius:7px;color:#9ca3af;font-size:12px;font-family:'DM Sans',sans-serif;outline:none;cursor:pointer;transition:border-color .2s;}
        .status-select:focus{border-color:#6366f1}
        .empty-col{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:32px 16px;color:#1f2937;font-size:12px;gap:6px}
        .stats-bar{display:flex;align-items:center;gap:16px;padding:12px 28px;background:#0d0f14;border-bottom:1px solid #1a1f2e;flex-shrink:0}
        .stat-item{display:flex;align-items:center;gap:6px;font-size:12px;color:#4b5563}
        .stat-dot{width:7px;height:7px;border-radius:50%}
      `}</style>
      <div className="app">
        <div className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-icon">⚡</div>
            <span className="brand-name">TaskFlow</span>
          </div>
          <div className="sidebar-section">Navigation</div>
          <div className="nav-item" onClick={() => navigate('/')}><span className="nav-icon">⊞</span>Dashboard</div>
          <div className="nav-item active" onClick={() => navigate('/projects')}><span className="nav-icon">◫</span>Projects</div>
          <div className="sidebar-bottom">
            <div className="user-card">
              <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
              <div style={{flex:1,minWidth:0}}>
                <div className="user-name">{user?.name}</div>
                <span className={`role-badge ${user?.role?.toLowerCase()}`}>{user?.role}</span>
              </div>
            </div>
            <button className="logout-btn" onClick={logout}>Sign out</button>
          </div>
        </div>

        <div className="main">
          <div className="topbar">
            <div className="topbar-left">
              <button className="back-btn" onClick={() => navigate('/projects')}>← Back</button>
              <span className="topbar-title">Task Board</span>
            </div>
            {user?.role === 'Admin' && (
              <button className="new-btn" onClick={() => setShowForm(!showForm)}>
                {showForm ? '✕ Cancel' : '+ New Task'}
              </button>
            )}
          </div>

          <div className="stats-bar">
            {columns.map(col => (
              <div className="stat-item" key={col.id}>
                <div className="stat-dot" style={{background:col.dot}}></div>
                {tasks.filter(t => t.status === col.id).length} {col.label}
              </div>
            ))}
            <div className="stat-item" style={{marginLeft:'auto'}}>
              {tasks.length} total tasks
            </div>
          </div>

          <div className="content">
            {error && <div className="error-box">{error}</div>}

            {showForm && user?.role === 'Admin' && (
              <div className="create-form">
                <div className="create-form-title">+ Create New Task</div>
                <div className="form-row">
                  <div>
                    <label className="field-label">Task Title *</label>
                    <input className="field-input" placeholder="What needs to be done?" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                  </div>
                  <div>
                    <label className="field-label">Description</label>
                    <input className="field-input" placeholder="Optional details..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                  </div>
                </div>
                <div className="form-row-3">
                  <div>
                    <label className="field-label">Assign To (User ID)</label>
                    <input className="field-input" placeholder="User ObjectId" value={form.assignedTo} onChange={e => setForm({...form, assignedTo: e.target.value})} />
                  </div>
                  <div>
                    <label className="field-label">Due Date</label>
                    <input className="field-input" type="date" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})} />
                  </div>
                  <div>
                    <label className="field-label">Priority</label>
                    <select className="field-select" value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                      <option value="High">⬆ High</option>
                      <option value="Medium">→ Medium</option>
                      <option value="Low">⬇ Low</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions">
                  <button className="create-btn" onClick={createTask} disabled={creating}>{creating ? 'Creating...' : 'Create Task'}</button>
                  <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </div>
            )}

            <div className="kanban">
              {columns.map(col => {
                const colTasks = tasks.filter(t => t.status === col.id)
                return (
                  <div className="column" key={col.id}>
                    <div className="col-header">
                      <div className="col-title">
                        <div className="col-dot" style={{background:col.dot}}></div>
                        {col.label}
                      </div>
                      <div className="col-count" style={{background:col.bg, color:col.color}}>
                        {colTasks.length}
                      </div>
                    </div>
                    <div className="col-body">
                      {loading ? (
                        <div className="empty-col">Loading...</div>
                      ) : colTasks.length === 0 ? (
                        <div className="empty-col">
                          <span style={{fontSize:'20px',opacity:.2}}>○</span>
                          No tasks
                        </div>
                      ) : colTasks.map(task => {
                        const p = priorityConfig[task.priority] || priorityConfig.Medium
                        return (
                          <div className="task-card" key={task._id}>
                            <div className="task-header">
                              <div className="task-title">{task.title}</div>
                              {user?.role === 'Admin' && <button className="task-del" onClick={() => deleteTask(task._id)}>✕</button>}
                            </div>
                            {task.description && <div className="task-desc">{task.description}</div>}
                            <div className="task-tags">
                              <span className="priority-tag" style={{background:p.bg, color:p.color}}>{p.label}</span>
                              {task.dueDate && <span className="due-tag">📅 {new Date(task.dueDate).toLocaleDateString('en-GB',{day:'2-digit',month:'short'})}</span>}
                              {task.assignedTo && <span className="assigned-tag">👤 {task.assignedTo.name}</span>}
                            </div>
                            <div className="task-footer">
                              <select className="status-select" value={task.status} onChange={e => updateStatus(task._id, e.target.value)}>
                                <option value="Todo">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                              </select>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}