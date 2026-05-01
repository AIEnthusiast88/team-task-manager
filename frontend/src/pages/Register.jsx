import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const API = 'https://team-task-manager-backend-wkzs.onrender.com'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Member' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await axios.post(`${API}/api/auth/register`, form)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed')
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
        .auth-root{min-height:100vh;display:flex;font-family:'DM Sans',sans-serif;background:#050608;overflow:hidden;}
        .auth-left{
          flex:1;display:flex;flex-direction:column;justify-content:space-between;
          padding:48px;background:linear-gradient(135deg,#0d0f14 0%,#111827 100%);
          border-right:1px solid #1a1f2e;position:relative;overflow:hidden;
        }
        .auth-left::before{content:'';position:absolute;width:600px;height:600px;background:radial-gradient(circle,rgba(16,185,129,.1) 0%,transparent 70%);top:-200px;left:-200px;}
        .auth-left::after{content:'';position:absolute;width:400px;height:400px;background:radial-gradient(circle,rgba(99,102,241,.08) 0%,transparent 70%);bottom:-100px;right:-100px;}
        .brand{display:flex;align-items:center;gap:12px}
        .brand-icon{width:40px;height:40px;background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;}
        .brand-name{font-family:'Syne',sans-serif;font-size:18px;font-weight:700;color:#fff;letter-spacing:-.3px}
        .hero-text{position:relative;z-index:1}
        .hero-tag{display:inline-flex;align-items:center;gap:6px;background:rgba(16,185,129,.1);border:1px solid rgba(16,185,129,.2);color:#6ee7b7;font-size:12px;padding:6px 12px;border-radius:999px;margin-bottom:24px;font-weight:500;letter-spacing:.5px;text-transform:uppercase;}
        .hero-dot{width:6px;height:6px;background:#10b981;border-radius:50%;animation:pulse 2s infinite}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
        .hero-title{font-family:'Syne',sans-serif;font-size:48px;font-weight:800;color:#fff;line-height:1.1;letter-spacing:-1.5px;margin-bottom:16px;}
        .hero-title span{background:linear-gradient(135deg,#10b981,#6ee7b7);-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
        .hero-sub{color:#4b5563;font-size:16px;line-height:1.6;max-width:380px}
        .steps{display:flex;flex-direction:column;gap:16px}
        .step{display:flex;align-items:center;gap:14px}
        .step-num{width:28px;height:28px;border-radius:50%;background:rgba(99,102,241,.15);border:1px solid rgba(99,102,241,.3);color:#a5b4fc;font-size:12px;font-weight:700;display:flex;align-items:center;justify-content:center;flex-shrink:0}
        .step-text{color:#6b7280;font-size:14px}
        .auth-right{width:480px;display:flex;align-items:center;justify-content:center;padding:48px;background:#050608;}
        .auth-card{width:100%}
        .auth-card-title{font-family:'Syne',sans-serif;font-size:28px;font-weight:800;color:#fff;letter-spacing:-.5px;margin-bottom:6px;}
        .auth-card-sub{color:#4b5563;font-size:14px;margin-bottom:36px}
        .auth-card-sub a{color:#6366f1;text-decoration:none}
        .field{margin-bottom:16px}
        .field-label{font-size:12px;color:#6b7280;font-weight:500;letter-spacing:.5px;text-transform:uppercase;margin-bottom:8px;display:block}
        .field-input{width:100%;padding:14px 16px;background:#0d0f14;border:1px solid #1a1f2e;border-radius:10px;color:#fff;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .2s,box-shadow .2s;}
        .field-input:focus{border-color:#6366f1;box-shadow:0 0 0 3px rgba(99,102,241,.1)}
        .field-input::placeholder{color:#374151}
        .field-select{width:100%;padding:14px 16px;background:#0d0f14;border:1px solid #1a1f2e;border-radius:10px;color:#fff;font-size:14px;font-family:'DM Sans',sans-serif;outline:none;cursor:pointer;transition:border-color .2s;}
        .field-select:focus{border-color:#6366f1}
        .role-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
        .role-opt{
          padding:14px;border-radius:10px;border:1px solid #1a1f2e;cursor:pointer;
          text-align:center;transition:all .2s;background:#0d0f14;
        }
        .role-opt.active{border-color:#6366f1;background:rgba(99,102,241,.08)}
        .role-opt-title{font-size:14px;font-weight:600;color:#fff;margin-bottom:3px;font-family:'Syne',sans-serif}
        .role-opt-sub{font-size:11px;color:#4b5563}
        .role-opt.active .role-opt-title{color:#a5b4fc}
        .submit-btn{width:100%;padding:15px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;border-radius:10px;font-size:15px;font-family:'Syne',sans-serif;font-weight:700;cursor:pointer;letter-spacing:.3px;transition:opacity .2s,transform .1s;margin-top:8px;}
        .submit-btn:hover{opacity:.9;transform:translateY(-1px)}
        .submit-btn:disabled{opacity:.5;cursor:not-allowed}
        .error-box{background:rgba(239,68,68,.08);border:1px solid rgba(239,68,68,.2);color:#f87171;padding:12px 16px;border-radius:8px;font-size:13px;margin-bottom:16px;}
      `}</style>
      <div className="auth-root">
        <div className="auth-left">
          <div className="brand">
            <div className="brand-icon">⚡</div>
            <span className="brand-name">TaskFlow</span>
          </div>
          <div className="hero-text">
            <div className="hero-tag"><span className="hero-dot"></span>Get started free</div>
            <h1 className="hero-title">Your team,<br/><span>organized.</span></h1>
            <p className="hero-sub">Join in seconds. Start managing projects and tasks with your team immediately.</p>
          </div>
          <div className="steps">
            <div className="step"><div className="step-num">1</div><span className="step-text">Create your account — choose Admin or Member role</span></div>
            <div className="step"><div className="step-num">2</div><span className="step-text">Create projects and invite your team</span></div>
            <div className="step"><div className="step-num">3</div><span className="step-text">Assign tasks, set priorities, track progress</span></div>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-card">
            <h2 className="auth-card-title">Create account</h2>
            <p className="auth-card-sub">Have an account? <Link to="/login">Sign in →</Link></p>
            {error && <div className="error-box">{error}</div>}
            <div className="field">
              <label className="field-label">Full Name</label>
              <input className="field-input" placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="field">
              <label className="field-label">Email</label>
              <input className="field-input" placeholder="you@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div className="field">
              <label className="field-label">Password</label>
              <input className="field-input" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            <div className="field">
              <label className="field-label">Role</label>
              <div className="role-grid">
                <div className={`role-opt ${form.role==='Admin'?'active':''}`} onClick={() => setForm({...form, role:'Admin'})}>
                  <div className="role-opt-title">Admin</div>
                  <div className="role-opt-sub">Full control</div>
                </div>
                <div className={`role-opt ${form.role==='Member'?'active':''}`} onClick={() => setForm({...form, role:'Member'})}>
                  <div className="role-opt-title">Member</div>
                  <div className="role-opt-sub">Task access</div>
                </div>
              </div>
            </div>
            <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Creating account...' : 'Create account →'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}