import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API = 'https://team-task-manager-backend-wkzs.onrender.com'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${API}/api/auth/login`, form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#050608}
        .auth-root{
          min-height:100vh;display:flex;font-family:'DM Sans',sans-serif;
          background:#050608;position:relative;overflow:hidden;
        }
        .auth-left{
          flex:1;display:flex;flex-direction:column;justify-content:space-between;
          padding:48px;background:linear-gradient(135deg,#0d0f14 0%,#111827 100%);
          border-right:1px solid #1a1f2e;position:relative;overflow:hidden;
        }
        .auth-left::before{
          content:'';position:absolute;width:600px;height:600px;
          background:radial-gradient(circle,rgba(99,102,241,.12) 0%,transparent 70%);
          top:-200px;left:-200px;pointer-events:none;
        }
        .auth-left::after{
          content:'';position:absolute;width:400px;height:400px;
          background:radial-gradient(circle,rgba(16,185,129,.08) 0%,transparent 70%);
          bottom:-100px;right:-100px;pointer-events:none;
        }
        .brand{display:flex;align-items:center;gap:12px}
        .brand-icon{
          width:40px;height:40px;background:linear-gradient(135deg,#6366f1,#8b5cf6);
          border-radius:10px;display:flex;align-items:center;justify-content:center;
          font-size:18px;
        }
        .brand-name{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:#fff;letter-spacing:-.3px}
        .hero-text{position:relative;z-index:1}
        .hero-tag{
          display:inline-flex;align-items:center;gap:6px;
          background:rgba(99,102,241,.1);border:1px solid rgba(99,102,241,.2);
          color:#a5b4fc;font-size:12px;padding:6px 12px;border-radius:999px;
          margin-bottom:24px;font-weight:500;letter-spacing:.5px;text-transform:uppercase;
        }
        .hero-dot{width:6px;height:6px;background:#6366f1;border-radius:50%;animation:pulse 2s infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .hero-title{
          font-family:'Syne',sans-serif;font-size:48px;font-weight:800;
          color:#fff;line-height:1.1;letter-spacing:-1.5px;margin-bottom:16px;
        }
        .hero-title span{
          background:linear-gradient(135deg,#6366f1,#a78bfa);
          -webkit-background-clip:text;-webkit-text-fill-color:transparent;
        }
        .hero-sub{color:#4b5563;font-size:16px;line-height:1.6;max-width:380px}
        .stat-row{display:flex;gap:32px}
        .stat{display:flex;flex-direction:column;gap:4px}
        .stat-num{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:#fff}
        .stat-label{font-size:12px;color:#4b5563;text-transform:uppercase;letter-spacing:.5px}
        .auth-right{
          width:480px;display:flex;align-items:center;justify-content:center;
          padding:48px;background:#050608;
        }
        .auth-card{width:100%}
        .auth-card-title{
          font-family:'Syne',sans-serif;font-size:28px;font-weight:800;
          color:#fff;letter-spacing:-.5px;margin-bottom:6px;
        }
        .auth-card-sub{color:#4b5563;font-size:14px;margin-bottom:36px}
        .auth-card-sub a{color:#6366f1;text-decoration:none}
        .field{margin-bottom:16px}
        .field-label{font-size:12px;color:#6b7280;font-weight:500;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px;display:block}
        .field-input{
          width:100%;padding:14px 16px;background:#0d0f14;
          border:1px solid #1a1f2e;border-radius:10px;color:#fff;
          font-size:14px;font-family:'DM Sans',sans-serif;outline:none;
          transition:border-color .2s,box-shadow .2s;
        }
        .field-input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
        .field-input::placeholder{color:#374151}
        .field-select{
          width:100%;padding:14px 16px;background:#0d0f14;
          border:1px solid #1a1f2e;border-radius:10px;color:#fff;
          font-size:14px;font-family:'DM Sans',sans-serif;outline:none;cursor:pointer;
          transition:border-color .2s;
        }
        .field-select:focus{border-color:#6366f1}
        .submit-btn{
          width:100%;padding:15px;
          background:linear-gradient(135deg,#6366f1,#8b5cf6);
          color:#fff;border:none;border-radius:10px;font-size:15px;
          font-family:'Syne',sans-serif;font-weight:700;cursor:pointer;
          letter-spacing:.3px;transition:opacity .2s,transform .1s;
          margin-top:8px;position:relative;overflow:hidden;
        }
        .submit-btn:hover{opacity:.9;transform:translateY(-1px)}
        .submit-btn:active{transform:translateY(0)}
        .submit-btn:disabled{opacity:.5;cursor:not-allowed}
        .error-box{
          background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);
          color:#f87171;padding:12px 16px;border-radius:8px;font-size:13px;
          margin-bottom:16px;
        }
        .divider{display:flex;align-items:center;gap:12px;margin:20px 0}
        .divider-line{flex:1;height:1px;background:#1a1f2e}
        .divider-text{font-size:12px;color:#374151}
      `}</style>
      <div className="auth-root">
        <div className="auth-left">
          <div className="brand">
            <div className="brand-icon">⚡</div>
            <span className="brand-name">TaskFlow</span>
          </div>
          <div className="hero-text">
            <div className="hero-tag">
              <span className="hero-dot"></span>
              Team Collaboration
            </div>
            <h1 className="hero-title">Manage work,<br/><span>ship faster.</span></h1>
            <p className="hero-sub">A unified workspace for teams to track projects, assign tasks, and deliver results — with full role-based control.</p>
          </div>
          <div className="stat-row">
            <div className="stat"><span className="stat-num">2</span><span className="stat-label">Roles</span></div>
            <div className="stat"><span className="stat-num">∞</span><span className="stat-label">Projects</span></div>
            <div className="stat"><span className="stat-num">JWT</span><span className="stat-label">Secured</span></div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-card">
            <h2 className="auth-card-title">Welcome back</h2>
            <p className="auth-card-sub">No account? <Link to="/register">Create one free →</Link></p>
            {error && <div className="error-box">{error}</div>}
            <div className="field">
              <label className="field-label">Email</label>
              <input className="field-input" placeholder="you@example.com" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>
            <div className="field">
              <label className="field-label">Password</label>
              <input className="field-input" type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>
            <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}