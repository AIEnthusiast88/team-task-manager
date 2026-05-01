import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate()

  const logout = () => {
    localStorage.clear()
    navigate('/login')
  }

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
          <button style={styles.logoutBtn} onClick={logout}>Logout</button>
        </div>
      </div>
      <div style={styles.main}>
        <h1 style={styles.heading}>Welcome back, {user?.name}! 👋</h1>
        <div style={styles.cards}>
          <div style={{...styles.card, borderLeft: '4px solid #6366f1'}}>
            <h3 style={styles.cardTitle}>Your Role</h3>
            <p style={styles.cardValue}>{user?.role}</p>
          </div>
          <div style={{...styles.card, borderLeft: '4px solid #22c55e'}}>
            <h3 style={styles.cardTitle}>Status</h3>
            <p style={styles.cardValue}>Active ✅</p>
          </div>
          <div style={{...styles.card, borderLeft: '4px solid #f59e0b'}}>
            <h3 style={styles.cardTitle}>Access</h3>
            <p style={styles.cardValue}>{user?.role === 'Admin' ? 'Full Access' : 'Member Access'}</p>
          </div>
        </div>
        <div style={styles.infoBox}>
          <h3 style={styles.infoTitle}>Quick Guide</h3>
          {user?.role === 'Admin' ? (
            <ul style={styles.list}>
              <li>📁 Go to Projects to create and manage projects</li>
              <li>✅ Create tasks and assign them to team members</li>
              <li>📊 Track task status across all projects</li>
              <li>👥 Manage team members and their access</li>
            </ul>
          ) : (
            <ul style={styles.list}>
              <li>📁 View projects you are part of</li>
              <li>✅ View tasks assigned to you</li>
              <li>🔄 Update task status (Todo → In Progress → Done)</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', background: '#0f172a', color: '#fff' },
  sidebar: { width: '240px', background: '#1e293b', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  logo: { color: '#6366f1', marginBottom: '32px' },
  navItem: { padding: '12px', borderRadius: '8px', cursor: 'pointer', color: '#94a3b8', marginBottom: '8px', ':hover': { background: '#334155' } },
  userBox: { borderTop: '1px solid #334155', paddingTop: '16px' },
  userName: { color: '#fff', fontWeight: 'bold', marginBottom: '4px' },
  userRole: { color: '#6366f1', fontSize: '12px', marginBottom: '12px' },
  logoutBtn: { width: '100%', padding: '8px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' },
  main: { flex: 1, padding: '40px' },
  heading: { fontSize: '28px', marginBottom: '32px' },
  cards: { display: 'flex', gap: '20px', marginBottom: '32px' },
  card: { background: '#1e293b', padding: '24px', borderRadius: '12px', flex: 1 },
  cardTitle: { color: '#94a3b8', fontSize: '14px', marginBottom: '8px' },
  cardValue: { color: '#fff', fontSize: '20px', fontWeight: 'bold' },
  infoBox: { background: '#1e293b', padding: '24px', borderRadius: '12px' },
  infoTitle: { color: '#6366f1', marginBottom: '16px' },
  list: { color: '#94a3b8', lineHeight: '2' }
}