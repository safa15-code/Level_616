import { useState, useEffect } from 'react'          // useState = remembered data, useEffect = run code on page load
import { useNavigate, Link } from 'react-router-dom'       // lets us redirect from code
import api from '../api'                             // your axios instance (adds the token for you)

export default function Skills() {
  const [skills, setSkills] = useState([])           // the list shown on screen, starts empty
  const [form, setForm] = useState({                 // what's typed in the add form
    name: '', type: 'skill', category: 'technical', level: 'Basic', desiredHoursPerWeek: 0
  })
  const [error, setError] = useState('')             // error message to show, empty = none
  const navigate = useNavigate()                     // function to jump to another page

  async function load() {                            // fetch my skills from the server
    try {
      const res = await api.get('/skills')           // GET /api/skills, token attached automatically
      setSkills(res.data)                            // put the result in state, screen updates
    } catch (err) {
      setError('Could not load skills')
    }
  }

  useEffect(() => { load() }, [])                    // run load() once when the page first appears ([] = only once)

  function handleChange(e) {                         // runs on every keystroke / dropdown change
    setForm({ ...form, [e.target.name]: e.target.value }) // copy old form, overwrite just the field that changed
  }

  async function handleAdd(e) {                      // runs when Add is clicked
    e.preventDefault()                               // stop the browser's default page reload on submit
    setError('')                                     // clear old error
    try {
      await api.post('/skills', form)                // POST /api/skills with the form data
      setForm({ ...form, name: '' })                 // clear only the name box, keep dropdowns
      load()                                         // re-fetch so the new skill appears
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add') // show server's message if it sent one
    }
  }

  async function handleDelete(id) {                  // runs when Delete is clicked on a row
    await api.delete(`/skills/${id}`)                // DELETE /api/skills/<that skill's id>
    load()                                           // refresh the list
  }

  function logout() {
    localStorage.removeItem('token')                 // throw away the token
    navigate('/login')                               // go back to login
  }

  return (
    <div className="container py-4" style={{ maxWidth: 800 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1>Skills</h1>
        <div>
          <Link to="/dashboard" className="btn btn-primary btn-sm me-2">Dashboard</Link>
          <button className="btn btn-outline-secondary btn-sm" onClick={logout}>Logout</button>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleAdd} className="row g-2 mb-4">
        <div className="col-12 col-md-4">
          <input className="form-control" name="name" placeholder="Skill or interest"
                 value={form.name} onChange={handleChange} required />
        </div>
        <div className="col-6 col-md-2">
          <select className="form-select" name="type" value={form.type} onChange={handleChange}>
            <option value="skill">Skill</option>
            <option value="interest">Interest</option>
          </select>
        </div>
        <div className="col-6 col-md-2">
          <select className="form-select" name="category" value={form.category} onChange={handleChange}>
            <option value="technical">Technical</option>
            <option value="soft">Soft</option>
            <option value="domain">Domain</option>
          </select>
        </div>
        <div className="col-6 col-md-2">
          <select className="form-select" name="level" value={form.level} onChange={handleChange}>
            <option>Basic</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <div className="col-6 col-md-2">
          <input className="form-control" type="number" min="0" name="desiredHoursPerWeek"
                 placeholder="Hrs/wk" value={form.desiredHoursPerWeek} onChange={handleChange} />
        </div>
        <div className="col-12">
          <button className="btn btn-primary w-100">Add</button>
        </div>
      </form>

      <ul className="list-group">
        {skills.map(s => (                           // loop: one row per skill
          <li key={s._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{s.name}</strong>
              <div className="text-muted small">{s.type} · {s.category} · {s.level} · {s.desiredHoursPerWeek} h/wk</div>
            </div>
            <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(s._id)}>Delete</button>
          </li>
        ))}
      </ul>
      {skills.length === 0 && <p className="text-muted">Nothing yet. Add your first one.</p>}
    </div>
  )
}