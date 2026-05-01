import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = 'https://team-task-manager-backend-wkzs.onrender.com'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const headers = { Authorization: `Bearer ${token}` }

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API}/api/projects`, { headers })
      setProjects(res.data)
    } catch (err) { setError('Failed to fetch projects') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProjects() }, [])

  const createProject = async () => {
    if (!name) return setError('Project name is required')
    setCreating(true)
    try {
      await axios.post(`${API}/api/projects`, { name, description }, { headers })
      setName(''); setDescription(''); setShowForm(false); fetchProjects()
    } catch (err) { setError(err.response?.data?.msg || 'Failed') }
    finally { setCreating(false) }
  }

  const deleteProject = async (id) => {
    try { await axios.delete(`${API}/api/projects/${id}`, { headers }); fetchProjects() }
    catch (err) { setError('Failed to delete') }
  }

  const logout = () => { localStorage.clear(); navigate('/login') }

  const colors = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4']

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
        .user-name{font-size:13px;font-weight:600;color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .role-badge{font-size:10px;font-weight:600;padding:2px 7px;border-radius:999px;letter-spacing:.3px;}
        .role-badge.admin{background:rgba(99,102,241,.15);color:#a5b4fc;border:1px solid rgba(99,102,241,.2)}
        .role-badge.member{background:rgba(16,185,129,.1);color:#6ee7b7;border:1px solid rgba(16,185,129,.2)}
        .logout-btn{width:100%;padding:10px;background:transparent;color:#4b5563;border:1px solid #1a1f2e;border-radius:8px;font-size:13px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .15s;}
        .logout-btn:hover{background:#1a1f2e;color:#d1d5db}
        .main{flex:1;overflow-y:auto}
        .topbar{display:flex;align-items:center;justify-content:space-between;padding:24px 36px;border-bottom:1px solid #1a1f2e;background:#080a0f;position:sticky;top:0;z-index:10;}
        .topbar h1{font-family:'Syne',sans-serif;font-size:20px;font-weight:700;color:#fff;letter-spacing:-.3px}
        .topbar p{font-size:13px;color:#4b5563;margin-top:2px}
        .new-btn{display:flex;align-items:center;gap:7px;padding:10px 18px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;border-radius:9px;font-size:13px;font-family:'Syne',sans-serif;font-weight:600;cursor:pointer;transition:opacity .2s;letter-spacing:.2px;}
        .new-btn:hover{opacity:.9}
        .content{padding:36px}
        .error-box{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);color:#f87171;padding:12px 16px;border-radius:8px;font-size:13px;margin-bottom:20px;}

        /* CREATE FORM */
        .create-form{
          background:#0d0f14;border:1px solid rgba(99,102,241,.25);border-radius:14px;
          padding:28px;margin-bottom:32px;
        }
        .create-form-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:#fff;margin-bottom:20px;display:flex;align-items:center;gap:8px}
        .form-row{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
        .field-label{font-size:11px;color:#6b7280;font-weight:600;letter-spacing:.5px;text-transform:uppercase;margin-bottom:7px;display:block}
        .field-input{width:100%;padding:12px 14px;background:#080a0f;border:1px solid #1a1f2e;border-radius:9px;color:#fff;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .2s,box-shadow .2s;}
        .field-input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
        .field-input::placeholder{color:#2d3748}
        .form-actions{display:flex;gap:10px;margin-top:4px}
        .create-btn{padding:11px 22px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;border-radius:8px;font-size:13px;font-family:'Syne',sans-serif;font-weight:700;cursor:pointer;transition:opacity .2s;}
        .create-btn:hover{opacity:.9}
        .create-btn:disabled{opacity:.5;cursor:not-allowed}
        .cancel-btn{padding:11px 22px;background:transparent;color:#6b7280;border:1px solid #1a1f2e;border-radius:8px;font-size:13px;font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .15s;}
        .cancel-btn:hover{background:#1a1f2e;color:#d1d5db}

        /* PROJECTS GRID */
        .section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:20px}
        .section-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:#fff}
        .project-count{font-size:12px;color:#374151;background:#111318;padding:3px 10px;border-radius:999px;border:1px solid #1a1f2e}
        .projects-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px}
        .project-card{
          background:#0d0f14;border:1px solid #1a1f2e;border-radius:14px;
          overflow:hidden;cursor:pointer;transition:all .2s;position:relative;
        }
        .project-card:hover{border-color:#2d3748;transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,.3)}
        .project-card-accent{height:3px;width:100%}
        .project-card-body{padding:20px}
        .project-card-header{display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px}
        .project-initial{
          width:38px;height:38px;border-radius:10px;
          display:flex;align-items:center;justify-content:center;
          font-family:'Syne',sans-serif;font-size:15px;font-weight:800;color:#fff;
          opacity:.9;flex-shrink:0;
        }
        .project-menu{display:flex;gap:6px}
        .project-name{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:#fff;margin-bottom:6px;line-height:1.3}
        .project-desc{font-size:13px;color:#4b5563;line-height:1.5;margin-bottom:16px;min-height:20px}
        .project-footer{display:flex;align-items:center;justify-content:space-between}
        .project-meta{font-size:11px;color:#374151}
        .view-btn{
          display:flex;align-items:center;gap:5px;padding:7px 14px;
          background:rgba(99,102,241,.1);color:#a5b4fc;border:1px solid rgba(99,102,241,.15);
          border-radius:7px;font-size:12px;font-weight:600;font-family:'Syne',sans-serif;
          cursor:pointer;transition:all .15s;
        }
        .view-btn:hover{background:rgba(99,102,241,.2)}
        .del-btn{
          padding:7px 12px;background:transparent;color:#374151;
          border:1px solid #1a1f2e;border-radius:7px;font-size:12px;
          cursor:pointer;transition:all .15s;
        }
        .del-btn:hover{background:rgba(239,68,68,.08);color:#f87171;border-color:rgba(239,68,68,.2)}
        .empty-state{
          grid-column:1/-1;text-align:center;padding:80px 40px;
          background:#0d0f14;border:1px dashed #1a1f2e;border-radius:14px;
        }
        .empty-icon{font-size:40px;margin-bottom:16px;opacity:.3}
        .empty-title{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:#374151;margin-bottom:8px}
        .empty-sub{font-size:13px;color:#1f2937}
        .skeleton{animation:shimmer 1.5s infinite linear;background:linear-gradient(90deg,#1a1f2e 25%,#212633 50%,#1a1f2e 75%);background-size:200%}
        @keyframes shimmer{0%{background-position:200%}100%{background-position:-200%}}
        .skel-card{height:160px;border-radius:14px}
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
            <div>
              <h1>Projects</h1>
              <p>Manage and track all your projects</p>
            </div>
            {user?.role === 'Admin' && (
              <button className="new-btn" onClick={() => setShowForm(!showForm)}>
                {showForm ? '✕ Cancel' : '+ New Project'}
              </button>
            )}
          </div>
          <div className="content">
            {error && <div className="error-box">{error}</div>}

            {showForm && user?.role === 'Admin' && (
              <div className="create-form">
                <div className="create-form-title">◫ Create New Project</div>
                <div className="form-row">
                  <div>
                    <label className="field-label">Project Name *</label>
                    <input className="field-input" placeholder="e.g. Website Redesign" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div>
                    <label className="field-label">Description</label>
                    <input className="field-input" placeholder="Brief description..." value={description} onChange={e => setDescription(e.target.value)} />
                  </div>
                </div>
                <div className="form-actions">
                  <button className="create-btn" onClick={createProject} disabled={creating}>{creating ? 'Creating...' : 'Create Project'}</button>
                  <button className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </div>
            )}

            <div className="section-header">
              <span className="section-title">All Projects</span>
              <span className="project-count">{projects.length} projects</span>
            </div>

            <div className="projects-grid">
              {loading ? <>
                <div className="skeleton skel-card"></div>
                <div className="skeleton skel-card"></div>
                <div className="skeleton skel-card"></div>
              </> : projects.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">◫</div>
                  <div className="empty-title">No projects yet</div>
                  <div className="empty-sub">{user?.role==='Admin' ? 'Create your first project using the button above.' : 'No projects have been created yet.'}</div>
                </div>
              ) : projects.map((p, i) => (
                <div key={p._id} className="project-card">
                  <div className="project-card-accent" style={{background:colors[i%colors.length]}}></div>
                  <div className="project-card-body">
                    <div className="project-card-header">
                      <div className="project-initial" style={{background:colors[i%colors.length]+'22',color:colors[i%colors.length]}}>
                        {p.name?.[0]?.toUpperCase()}
                      </div>
                    </div>
                    <div className="project-name">{p.name}</div>
                    <div className="project-desc">{p.description || 'No description provided'}</div>
                    <div className="project-footer">
                      <span className="project-meta">by {p.createdBy?.name || 'Unknown'}</span>
                      <div style={{display:'flex',gap:6}}>
                        <button className="view-btn" onClick={() => navigate(`/tasks/${p._id}`)}>Tasks →</button>
                        {user?.role === 'Admin' && <button className="del-btn" onClick={() => deleteProject(p._id)}>✕</button>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}