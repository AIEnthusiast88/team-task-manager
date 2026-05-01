import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')
  const navigate = useNavigate()

  const headers = { Authorization: `Bearer ${token}` }

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects', { headers })
      setProjects(res.data)
    } catch (err) { setError('Failed to fetch projects') }
  }

  useEffect(() => { fetchProjects() }, [])

  const createProject = async () => {
    if (!name) return setError('Project name is required')
    try {
      await axios.post('http://localhost:5000/api/projects', { name, description }, { headers })
      setName(''); setDescription(''); fetchProjects()
    } catch (err) { setError(err.response?.data?.msg || 'Failed to create project') }
  }

  const deleteProject = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`, { headers })
      fetchProjects()
    } catch (err) { setError('Failed to delete project') }
  }

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>🚀 TaskManager</h2>
        <nav>
          <p style={styles.navItem} onClick={() => navigate('/')}>🏠 Dashboard</p>
          <p style={{...styles.navItem, background: '#334155'}} onClick={() => navigate('/projects')}>📁 Projects</p>
        </nav>
        <div style={styles.userBox}>
          <p style={styles.userName}>{user?.name}</p>
          <p style={styles.userRole}>{user?.role}</p>
          <button style={styles.logoutBtn} onClick={() => { localStorage.clear(); navigate('/login') }}>Logout</button>
        </div>
      </div>
      <div style={styles.main}>
        <h1 style={styles.heading}>📁 Projects</h1>
        {error && <p style={styles.error}>{error}</p>}

        {user?.role === 'Admin' && (
          <div style={styles.form}>
            <h3 style={styles.formTitle}>Create New Project</h3>
            <input style={styles.input} placeholder="Project Name" value={name}
              onChange={e => setName(e.target.value)} />
            <input style={styles.input} placeholder="Description (optional)" value={description}
              onChange={e => setDescription(e.target.value)} />
            <button style={styles.btn} onClick={createProject}>+ Create Project</button>
          </div>
        )}

        <div style={styles.grid}>
          {projects.map(p => (
            <div key={p._id} style={styles.card}>
              <h3 style={styles.cardTitle}>{p.name}</h3>
              <p style={styles.cardDesc}>{p.description || 'No description'}</p>
              <p style={styles.cardMeta}>Created by: {p.createdBy?.name || 'Unknown'}</p>
              <div style={styles.cardActions}>
                <button style={styles.viewBtn} onClick={() => navigate(`/tasks/${p._id}`)}>View Tasks</button>
                {user?.role === 'Admin' && (
                  <button style={styles.deleteBtn} onClick={() => deleteProject(p._id)}>Delete</button>
                )}
              </div>
            </div>
          ))}
          {projects.length === 0 && <p style={styles.empty}>No projects yet. Create one above!</p>}
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
  main: { flex: 1, padding: '40px' },
  heading: { fontSize: '28px', marginBottom: '24px' },
  error: { color: '#f87171', marginBottom: '12px' },
  form: { background: '#1e293b', padding: '24px', borderRadius: '12px', marginBottom: '32px' },
  formTitle: { color: '#6366f1', marginBottom: '16px' },
  input: { width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#0f172a', color: '#fff', fontSize: '14px', boxSizing: 'border-box' },
  btn: { padding: '12px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
  card: { background: '#1e293b', padding: '24px', borderRadius: '12px', borderLeft: '4px solid #6366f1' },
  cardTitle: { color: '#fff', marginBottom: '8px' },
  cardDesc: { color: '#94a3b8', fontSize: '14px', marginBottom: '12px' },
  cardMeta: { color: '#64748b', fontSize: '12px', marginBottom: '16px' },
  cardActions: { display: 'flex', gap: '8px' },
  viewBtn: { padding: '8px 16px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  deleteBtn: { padding: '8px 16px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  empty: { color: '#64748b', gridColumn: '1/-1' }
}