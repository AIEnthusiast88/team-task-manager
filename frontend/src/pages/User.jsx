import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = 'https://team-task-manager-backend-wkzs.onrender.com'

export default function Users() {
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const headers = { Authorization: `Bearer ${token}` }

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/api/users`, { headers })
      setUsers(res.data)
    } catch (err) { setError('Failed to fetch users') }
  }

  useEffect(() => { fetchUsers() }, [])

  const deleteUser = async (id) => {
    if (id === user.id) return setError("You can't delete yourself!")
    try {
      await axios.delete(`${API}/api/users/${id}`, { headers })
      fetchUsers()
    } catch (err) { setError('Failed to delete user') }
  }

  const roleColor = { Admin: '#6366f1', Member: '#22c55e' }

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>🚀 TaskManager</h2>
        <nav>
          <p style={styles.navItem} onClick={() => navigate('/')}>🏠 Dashboard</p>
          <p style={styles.navItem} onClick={() => navigate('/projects')}>📁 Projects</p>
          <p style={styles.navItem} onClick={() => navigate('/analytics')}>📊 Analytics</p>
          <p style={{...styles.navItem, background:'#334155'}} onClick={() => navigate('/users')}>👥 Users</p>
          <p style={styles.navItem} onClick={() => navigate('/deadlines')}>⏰ Deadlines</p>
        </nav>
        <div style={styles.userBox}>
          <p style={styles.userName}>{user?.name}</p>
          <p style={styles.userRole}>{user?.role}</p>
          <button style={styles.logoutBtn} onClick={() => { localStorage.clear(); navigate('/login') }}>Logout</button>
        </div>
      </div>
      <div style={styles.main}>
        <h1 style={styles.heading}>👥 User Management</h1>
        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statValue}>{users.length}</p>
            <p style={styles.statLabel}>Total Users</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statValue}>{users.filter(u => u.role === 'Admin').length}</p>
            <p style={styles.statLabel}>Admins</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statValue}>{users.filter(u => u.role === 'Member').length}</p>
            <p style={styles.statLabel}>Members</p>
          </div>
        </div>

        <div style={styles.table}>
          <div style={styles.tableHeader}>
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
            <span>Joined</span>
            <span>Actions</span>
          </div>
          {users.map(u => (
            <div key={u._id} style={styles.tableRow}>
              <span style={styles.userName2}>
                <div style={{...styles.avatar, background: roleColor[u.role]}}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                {u.name}
              </span>
              <span style={styles.email}>{u.email}</span>
              <span style={{...styles.roleBadge, background: roleColor[u.role] + '22', color: roleColor[u.role]}}>
                {u.role}
              </span>
              <span style={styles.date}>
                {new Date(u.createdAt).toLocaleDateString()}
              </span>
              <span>
                {u._id !== user.id && (
                  <button style={styles.deleteBtn} onClick={() => deleteUser(u._id)}>
                    🗑 Remove
                  </button>
                )}
              </span>
            </div>
          ))}
          {users.length === 0 && <p style={styles.empty}>No users found</p>}
        </div>
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
  heading: { fontSize: '28px', marginBottom: '32px' },
  error: { color: '#f87171', marginBottom: '16px' },
  statsRow: { display: 'flex', gap: '20px', marginBottom: '32px' },
  statCard: { background: '#1e293b', padding: '20px 32px', borderRadius: '12px', textAlign: 'center', borderTop: '3px solid #6366f1' },
  statValue: { fontSize: '28px', fontWeight: 'bold', color: '#fff', marginBottom: '4px' },
  statLabel: { color: '#94a3b8', fontSize: '13px' },
  table: { background: '#1e293b', borderRadius: '12px', overflow: 'hidden' },
  tableHeader: { display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1fr', padding: '16px 24px', background: '#0f172a', color: '#64748b', fontSize: '13px', fontWeight: 'bold' },
  tableRow: { display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1fr', padding: '16px 24px', borderBottom: '1px solid #0f172a', alignItems: 'center' },
  userName2: { display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontWeight: '500' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', color: '#fff', flexShrink: 0 },
  email: { color: '#94a3b8', fontSize: '13px' },
  roleBadge: { padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: 'bold', width: 'fit-content' },
  date: { color: '#64748b', fontSize: '13px' },
  deleteBtn: { padding: '6px 12px', background: '#7f1d1d', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  empty: { color: '#475569', padding: '24px', textAlign: 'center' }
}