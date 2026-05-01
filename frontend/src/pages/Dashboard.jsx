import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate()

  const logout = () => { localStorage.clear(); navigate('/login') }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#050608}
        .app{display:flex;min-height:100vh;font-family:'DM Sans',sans-serif;background:#080a0f;color:#fff}
        
        /* SIDEBAR */
        .sidebar{
          width:260px;background:#0d0f14;border-right:1px solid #1a1f2e;
          display:flex;flex-direction:column;padding:0;position:sticky;top:0;height:100vh;
          flex-shrink:0;
        }
        .sidebar-brand{
          display:flex;align-items:center;gap:10px;padding:28px 24px 20px;
          border-bottom:1px solid #1a1f2e;
        }
        .brand-icon{
          width:34px;height:34px;background:linear-gradient(135deg,#6366f1,#8b5cf6);
          border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px;
        }
        .brand-name{font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:#fff;letter-spacing:-.2px}
        .sidebar-section{padding:20px 16px 8px;font-size:10px;font-weight:600;letter-spacing:1px;color:#374151;text-transform:uppercase}
        .nav-item{
          display:flex;align-items:center;gap:10px;padding:10px 16px;
          margin:2px 8px;border-radius:8px;cursor:pointer;
          color:#6b7280;font-size:14px;font-weight:500;transition:all .15s;
        }
        .nav-item:hover{background:#1a1f2e;color:#d1d5db}
        .nav-item.active{background:rgba(99,102,241,.12);color:#a5b4fc}
        .nav-icon{font-size:16px;width:20px;text-align:center}
        .sidebar-bottom{margin-top:auto;padding:16px;border-top:1px solid #1a1f2e}
        .user-card{
          display:flex;align-items:center;gap:10px;padding:10px 12px;
          background:#111318;border-radius:10px;margin-bottom:10px;
        }
        .user-avatar{
          width:32px;height:32px;border-radius:8px;
          background:linear-gradient(135deg,#6366f1,#8b5cf6);
          display:flex;align-items:center;justify-content:center;
          font-family:'Syne',sans-serif;font-size:13px;font-weight:700;color:#fff;flex-shrink:0;
        }
        .user-info{flex:1;min-width:0}
        .user-name{font-size:13px;font-weight:600;color:#e2e8f0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .user-role{font-size:11px;color:#4b5563}
        .role-badge{
          display:inline-flex;align-items:center;gap:4px;
          font-size:10px;font-weight:600;padding:2px 7px;border-radius:999px;letter-spacing:.3px;
        }
        .role-badge.admin{background:rgba(99,102,241,.15);color:#a5b4fc;border:1px solid rgba(99,102,241,.2)}
        .role-badge.member{background:rgba(16,185,129,.1);color:#6ee7b7;border:1px solid rgba(16,185,129,.2)}
        .logout-btn{
          width:100%;padding:10px;background:transparent;color:#4b5563;
          border:1px solid #1a1f2e;border-radius:8px;font-size:13px;
          font-family:'DM Sans',sans-serif;cursor:pointer;transition:all .15s;
        }
        .logout-btn:hover{background:#1a1f2e;color:#d1d5db}

        /* MAIN */
        .main{flex:1;overflow-y:auto}
        .topbar{
          display:flex;align-items:center;justify-content:space-between;
          padding:24px 36px;border-bottom:1px solid #1a1f2e;background:#080a0f;
          position:sticky;top:0;z-index:10;backdrop-filter:blur(8px);
        }
        .topbar-left h1{font-family:'Syne',sans-serif;font-size:20px;font-weight:700;color:#fff;letter-spacing:-.3px}
        .topbar-left p{font-size:13px;color:#4b5563;margin-top:2px}
        .topbar-right{display:flex;align-items:center;gap:10px}
        .status-pill{
          display:flex;align-items:center;gap:6px;
          background:#0d0f14;border:1px solid #1a1f2e;
          padding:7px 14px;border-radius:8px;font-size:13px;color:#6b7280;
        }
        .status-dot{width:7px;height:7px;border-radius:50%;background:#10b981;flex-shrink:0;box-shadow:0 0 8px rgba(16,185,129,.5)}
        .content{padding:36px}

        /* WELCOME BANNER */
        .welcome-banner{
          background:linear-gradient(135deg,rgba(99,102,241,.08) 0%,rgba(139,92,246,.04) 100%);
          border:1px solid rgba(99,102,241,.15);border-radius:16px;
          padding:32px 36px;margin-bottom:32px;position:relative;overflow:hidden;
        }
        .welcome-banner::before{
          content:'';position:absolute;right:-60px;top:-60px;
          width:200px;height:200px;
          background:radial-gradient(circle,rgba(99,102,241,.15),transparent 70%);
        }
        .welcome-greeting{font-size:12px;color:#6366f1;font-weight:600;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px}
        .welcome-name{font-family:'Syne',sans-serif;font-size:32px;font-weight:800;color:#fff;letter-spacing:-.5px;margin-bottom:6px}
        .welcome-sub{font-size:14px;color:#4b5563}

        /* STAT CARDS */
        .stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:32px}
        .stat-card{
          background:#0d0f14;border:1px solid #1a1f2e;border-radius:12px;
          padding:24px;position:relative;overflow:hidden;transition:border-color .2s;
        }
        .stat-card:hover{border-color:#2d3748}
        .stat-card-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
        .stat-card-label{font-size:12px;color:#4b5563;font-weight:500;letter-spacing:.3px;text-transform:uppercase}
        .stat-card-icon{
          width:36px;height:36px;border-radius:9px;
          display:flex;align-items:center;justify-content:center;font-size:16px;
        }
        .stat-card-value{font-family:'Syne',sans-serif;font-size:36px;font-weight:800;color:#fff;letter-spacing:-1px;margin-bottom:4px}
        .stat-card-desc{font-size:12px;color:#374151}
        .icon-purple{background:rgba(99,102,241,.12)}
        .icon-green{background:rgba(16,185,129,.1)}
        .icon-amber{background:rgba(245,158,11,.1)}

        /* GUIDE */
        .guide-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        .guide-card{background:#0d0f14;border:1px solid #1a1f2e;border-radius:12px;padding:24px}
        .guide-card-title{font-family:'Syne',sans-serif;font-size:15px;font-weight:700;color:#fff;margin-bottom:16px;display:flex;align-items:center;gap:8px}
        .guide-items{display:flex;flex-direction:column;gap:10px}
        .guide-item{display:flex;align-items:flex-start;gap:10px}
        .guide-item-dot{width:6px;height:6px;border-radius:50%;background:#6366f1;margin-top:6px;flex-shrink:0}
        .guide-item-text{font-size:13px;color:#6b7280;line-height:1.5}

        .quick-actions{display:flex;flex-direction:column;gap:8px}
        .action-btn{
          display:flex;align-items:center;gap:10px;padding:12px 16px;
          background:#111318;border:1px solid #1a1f2e;border-radius:9px;
          cursor:pointer;transition:all .15s;text-align:left;
        }
        .action-btn:hover{background:#1a1f2e;border-color:#2d3748}
        .action-icon{font-size:16px}
        .action-text{font-size:13px;color:#d1d5db;font-weight:500}
        .action-arrow{margin-left:auto;color:#374151;font-size:12px}
      `}</style>
      <div className="app">
        <div className="sidebar">
          <div className="sidebar-brand">
            <div className="brand-icon">⚡</div>
            <span className="brand-name">TaskFlow</span>
          </div>
          <div className="sidebar-section">Navigation</div>
          <div className="nav-item active" onClick={() => navigate('/')}><span className="nav-icon">⊞</span>Dashboard</div>
          <div className="nav-item" onClick={() => navigate('/projects')}><span className="nav-icon">◫</span>Projects</div>
          <div className="sidebar-bottom">
            <div className="user-card">
              <div className="user-avatar">{user?.name?.[0]?.toUpperCase()}</div>
              <div className="user-info">
                <div className="user-name">{user?.name}</div>
                <div className="user-role">
                  <span className={`role-badge ${user?.role?.toLowerCase()}`}>{user?.role}</span>
                </div>
              </div>
            </div>
            <button className="logout-btn" onClick={logout}>Sign out</button>
          </div>
        </div>

        <div className="main">
          <div className="topbar">
            <div className="topbar-left">
              <h1>Dashboard</h1>
              <p>Overview of your workspace</p>
            </div>
            <div className="topbar-right">
              <div className="status-pill"><div className="status-dot"></div>All systems operational</div>
            </div>
          </div>
          <div className="content">
            <div className="welcome-banner">
              <div className="welcome-greeting">Good to have you back</div>
              <div className="welcome-name">Hello, {user?.name} 👋</div>
              <div className="welcome-sub">Here's what's happening in your workspace today.</div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-card-top">
                  <span className="stat-card-label">Your Role</span>
                  <div className={`stat-card-icon ${user?.role==='Admin'?'icon-purple':'icon-green'}`}>
                    {user?.role==='Admin'?'⚙':'👤'}
                  </div>
                </div>
                <div className="stat-card-value">{user?.role}</div>
                <div className="stat-card-desc">{user?.role==='Admin'?'Full workspace access':'Task & status access'}</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-top">
                  <span className="stat-card-label">Status</span>
                  <div className="stat-card-icon icon-green">✓</div>
                </div>
                <div className="stat-card-value">Active</div>
                <div className="stat-card-desc">Account in good standing</div>
              </div>
              <div className="stat-card">
                <div className="stat-card-top">
                  <span className="stat-card-label">Access Level</span>
                  <div className="stat-card-icon icon-amber">🔐</div>
                </div>
                <div className="stat-card-value">{user?.role==='Admin'?'Full':'Standard'}</div>
                <div className="stat-card-desc">JWT authenticated session</div>
              </div>
            </div>

            <div className="guide-grid">
              <div className="guide-card">
                <div className="guide-card-title">📋 Your Permissions</div>
                <div className="guide-items">
                  {user?.role==='Admin' ? <>
                    <div className="guide-item"><div className="guide-item-dot"></div><span className="guide-item-text">Create, edit and delete projects</span></div>
                    <div className="guide-item"><div className="guide-item-dot"></div><span className="guide-item-text">Create tasks and assign to members</span></div>
                    <div className="guide-item"><div className="guide-item-dot"></div><span className="guide-item-text">Set task priority and due dates</span></div>
                    <div className="guide-item"><div className="guide-item-dot"></div><span className="guide-item-text">Delete tasks and manage team</span></div>
                  </> : <>
                    <div className="guide-item"><div className="guide-item-dot"></div><span className="guide-item-text">View all projects</span></div>
                    <div className="guide-item"><div className="guide-item-dot"></div><span className="guide-item-text">View tasks assigned to you</span></div>
                    <div className="guide-item"><div className="guide-item-dot"></div><span className="guide-item-text">Update task status (Todo → Done)</span></div>
                  </>}
                </div>
              </div>
              <div className="guide-card">
                <div className="guide-card-title">⚡ Quick Actions</div>
                <div className="quick-actions">
                  <div className="action-btn" onClick={() => navigate('/projects')}>
                    <span className="action-icon">◫</span>
                    <span className="action-text">View all projects</span>
                    <span className="action-arrow">→</span>
                  </div>
                  {user?.role==='Admin' && <div className="action-btn" onClick={() => navigate('/projects')}>
                    <span className="action-icon">＋</span>
                    <span className="action-text">Create new project</span>
                    <span className="action-arrow">→</span>
                  </div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}