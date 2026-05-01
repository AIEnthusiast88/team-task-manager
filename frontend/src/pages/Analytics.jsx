import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const API = 'https://team-task-manager-backend-wkzs.onrender.com'

export default function Analytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const user = JSON.parse(localStorage.getItem('user'))
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    axios.get(`${API}/api/analytics`, { headers })
      .then(res => { setData(res.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={styles.container}>
      <div style={styles.sidebar}><h2 style={styles.logo}>🚀 TaskManager</h2></div>
      <div style={styles.main}><p style={{color:'#94a3b8'}}>Loading analytics...</p></div>
    </div>
  )

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>🚀 TaskManager</h2>
        <nav>
          <p style={styles.navItem} onClick={() => navigate('/')}>🏠 Dashboard</p>
          <p style={styles.navItem} onClick={() => navigate('/projects')}>📁 Projects</p>
          <p style={{...styles.navItem, background:'#334155'}} onClick={() => navigate('/analytics')}>📊 Analytics</p>
          {user?.role === 'Admin' && <p style={styles.navItem} onClick={() => navigate('/users')}>👥 Users</p>}
          <p style={styles.navItem} onClick={() => navigate('/deadlines')}>⏰ Deadlines</p>
        </nav>
        <div style={styles.userBox}>
          <p style={styles.userName}>{user?.name}</p>
          <p style={styles.userRole}>{user?.role}</p>
          <button style={styles.logoutBtn} onClick={() => { localStorage.clear(); navigate('/login') }}>Logout</button>
        </div>
      </div>
      <div style={styles.main}>
        <h1 style={styles.heading}>📊 Analytics Dashboard</h1>

        {/* Top Stats */}
        <div style={styles.statsGrid}>
          {[
            { label: 'Total Projects', value: data?.totalProjects, color: '#6366f1', icon: '📁' },
            { label: 'Total Tasks', value: data?.totalTasks, color: '#22c55e', icon: '✅' },
            { label: 'Total Users', value: data?.totalUsers, color: '#f59e0b', icon: '👥' },
            { label: 'Completion Rate', value: `${data?.completionRate}%`, color: '#06b6d4', icon: '🎯' },
            { label: 'Overdue Tasks', value: data?.overdueTasks, color: '#ef4444', icon: '🔴' },
            { label: 'Due Today', value: data?.dueTodayTasks, color: '#f97316', icon: '📅' },
          ].map((stat, i) => (
            <div key={i} style={{...styles.statCard, borderTop: `3px solid ${stat.color}`}}>
              <span style={styles.statIcon}>{stat.icon}</span>
              <p style={styles.statValue}>{stat.value}</p>
              <p style={styles.statLabel}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Task Status Breakdown */}
        <div style={styles.row}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Tasks by Status</h3>
            {[
              { label: 'Todo', value: data?.tasksByStatus?.todo, color: '#f59e0b', total: data?.totalTasks },
              { label: 'In Progress', value: data?.tasksByStatus?.inProgress, color: '#6366f1', total: data?.totalTasks },
              { label: 'Done', value: data?.tasksByStatus?.done, color: '#22c55e', total: data?.totalTasks },
            ].map((item, i) => (
              <div key={i} style={styles.barRow}>
                <span style={styles.barLabel}>{item.label}</span>
                <div style={styles.barBg}>
                  <div style={{
                    ...styles.barFill,
                    width: item.total > 0 ? `${(item.value/item.total)*100}%` : '0%',
                    background: item.color
                  }}/>
                </div>
                <span style={styles.barValue}>{item.value}</span>
              </div>
            ))}
          </div>

          {/* Priority Breakdown */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Tasks by Priority</h3>
            {[
              { label: 'High', value: data?.tasksByPriority?.high, color: '#ef4444', total: data?.totalTasks },
              { label: 'Medium', value: data?.tasksByPriority?.medium, color: '#f59e0b', total: data?.totalTasks },
              { label: 'Low', value: data?.tasksByPriority?.low, color: '#22c55e', total: data?.totalTasks },
            ].map((item, i) => (
              <div key={i} style={styles.barRow}>
                <span style={styles.barLabel}>{item.label}</span>
                <div style={styles.barBg}>
                  <div style={{
                    ...styles.barFill,
                    width: item.total > 0 ? `${(item.value/item.total)*100}%` : '0%',
                    background: item.color
                  }}/>
                </div>
                <span style={styles.barValue}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Completion Ring */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Overall Project Health</h3>
          <div style={styles.healthGrid}>
            <div style={styles.healthItem}>
              <div style={{...styles.ring, borderColor: '#22c55e'}}>
                <span style={styles.ringValue}>{data?.completionRate}%</span>
              </div>
              <p style={styles.healthLabel}>Completion Rate</p>
            </div>
            <div style={styles.healthItem}>
              <div style={{...styles.ring, borderColor: '#ef4444'}}>
                <span style={styles.ringValue}>{data?.overdueTasks}</span>
              </div>
              <p style={styles.healthLabel}>Overdue Tasks</p>
            </div>
            <div style={styles.healthItem}>
              <div style={{...styles.ring, borderColor: '#f59e0b'}}>
                <span style={styles.ringValue}>{data?.dueTodayTasks}</span>
              </div>
              <p style={styles.healthLabel}>Due Today</p>
            </div>
          </div>
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
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' },
  statCard: { background: '#1e293b', padding: '24px', borderRadius: '12px', textAlign: 'center' },
  statIcon: { fontSize: '28px' },
  statValue: { fontSize: '32px', fontWeight: 'bold', color: '#fff', margin: '8px 0 4px' },
  statLabel: { color: '#94a3b8', fontSize: '13px' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' },
  card: { background: '#1e293b', padding: '24px', borderRadius: '12px', marginBottom: '24px' },
  cardTitle: { color: '#6366f1', marginBottom: '20px', fontSize: '16px' },
  barRow: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' },
  barLabel: { color: '#94a3b8', fontSize: '13px', width: '80px' },
  barBg: { flex: 1, background: '#0f172a', borderRadius: '999px', height: '8px' },
  barFill: { height: '8px', borderRadius: '999px', transition: 'width 0.5s ease' },
  barValue: { color: '#fff', fontSize: '13px', width: '20px', textAlign: 'right' },
  healthGrid: { display: 'flex', gap: '40px', justifyContent: 'center', padding: '20px 0' },
  healthItem: { textAlign: 'center' },
  ring: { width: '80px', height: '80px', borderRadius: '50%', border: '4px solid', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' },
  ringValue: { fontSize: '20px', fontWeight: 'bold', color: '#fff' },
  healthLabel: { color: '#94a3b8', fontSize: '13px' }
}