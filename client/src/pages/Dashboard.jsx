import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts'
import api from '../api'

export default function Dashboard() {
  const [skills, setSkills] = useState([])
  const [logs, setLogs] = useState([])
  const [form, setForm] = useState({ skill: '', hours: '' })
  const [error, setError] = useState('')

  async function load() {                                       // fetch both lists
    const [s, l] = await Promise.all([api.get('/skills'), api.get('/logs')])
    setSkills(s.data); setLogs(l.data)
  }
  useEffect(() => { load() }, [])

  async function addLog(e) {
    e.preventDefault(); setError('')
    try {
      await api.post('/logs', form)
      setForm({ ...form, hours: '' }); load()
    } catch (err) { setError(err.response?.data?.message || 'Could not log') }
  }

  const weekAgo = Date.now() - 7 * 86400000                     // 7 days ago, in ms
  const rows = skills.map(s => {
    const mine = logs.filter(l => l.skill && l.skill._id === s._id)
    const hours = mine.reduce((sum, l) => sum + l.hours, 0)     // all-time hours (for the bars)
    const thisWeek = mine
      .filter(l => new Date(l.date) > weekAgo)                  // only the last 7 days
      .reduce((sum, l) => sum + l.hours, 0)
    const priority = Math.max(0, s.desiredHoursPerWeek - thisWeek) // hours still owed, never negative
    return { ...s, hours, thisWeek, priority }
  })
  const maxHours = Math.max(1, ...rows.map(r => r.hours))
  const byPriority = [...rows].sort((a, b) => b.priority - a.priority) // biggest gap first

  const chartData = rows
    .filter(r => r.type === 'interest')                         // interests only
    .map(r => ({ name: r.name, Desired: r.desiredHoursPerWeek, Actual: r.thisWeek }))

  const totalHours = rows.reduce((sum, r) => sum + r.hours, 0)
  const weekHours = rows.reduce((sum, r) => sum + r.thisWeek, 0)

  const logDays = new Set(logs.map(l => new Date(l.date).toDateString())) // unique days I logged
  let streak = 0
  const day = new Date()
  if (!logDays.has(day.toDateString())) day.setDate(day.getDate() - 1)    // nothing today yet? start from yesterday
  while (logDays.has(day.toDateString())) {
    streak++
    day.setDate(day.getDate() - 1)
  }

  return (
    <div className="container py-4" style={{ maxWidth: 800 }}>
      <Link to="/skills">← Skills</Link>
      <h1 className="mb-3">🌍 Dashboard</h1>

      <div className="row g-3 mb-4">
        <div className="col-4"><div className="stat"><div className="stat-num">🔥 {streak}</div><div className="stat-label">day streak</div></div></div>
        <div className="col-4"><div className="stat"><div className="stat-num">{weekHours}h</div><div className="stat-label">this week</div></div></div>
        <div className="col-4"><div className="stat"><div className="stat-num">{totalHours}h</div><div className="stat-label">all time</div></div></div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={addLog} className="row g-2 mb-4">
        <div className="col-7">
          <select className="form-select" required value={form.skill}
                  onChange={e => setForm({ ...form, skill: e.target.value })}>
            <option value="">Pick skill/interest</option>
            {skills.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
        </div>
        <div className="col-3">
          <input className="form-control" type="number" step="0.25" min="0" max="24" required
                 placeholder="Hours" value={form.hours}
                 onChange={e => setForm({ ...form, hours: e.target.value })} />
        </div>
        <div className="col-2"><button className="btn btn-primary w-100">Log</button></div>
      </form>

      <h4>Focus next</h4>
      <ul className="list-group mb-4 mt-2">
        {byPriority.map((r, i) => (
          <li key={r._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span><span className="rank">{i + 1}</span>{r.name}</span>
            {r.priority > 0
              ? <span className="badge-owed">{r.priority.toFixed(1)}h left this week</span>
              : <span className="badge-done">✓ done for the week</span>}
          </li>
        ))}
      </ul>
      {skills.length === 0 && <p className="text-muted">Add skills first, then log time here.</p>}

      <h4>Desired vs actual (this week)</h4>
      {chartData.length > 0 ? (
        <div style={{ width: '100%', height: 260 }} className="mt-3 mb-4">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#111" strokeOpacity={0.2} />
              <XAxis dataKey="name" stroke="#111" />
              <YAxis stroke="#111" unit="h" />
              <Tooltip />
              <Legend />
              <Bar dataKey="Desired" fill="#ffd23f" stroke="#111" strokeWidth={2} />
              <Bar dataKey="Actual" fill="#d62828" stroke="#111" strokeWidth={2} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p className="text-muted mt-2">Add some interests to see this chart.</p>
      )}

      <h4>Hours logged</h4>
      <div className="mt-2">
        {rows.map(r => (
          <div key={r._id} className="mb-3">
            <div className="d-flex justify-content-between small">
              <span>{r.name}</span><span className="text-muted">{r.hours}h</span>
            </div>
            <div className="progress">
              <div className="progress-bar" style={{ width: `${(r.hours / maxHours) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}