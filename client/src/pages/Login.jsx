import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);   // login or register mode
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const change = e => setForm({ ...form, [e.target.name]: e.target.value }); // update one field

  const submit = async e => {
    e.preventDefault();                                   // stop the page reloading
    setError('');
    try {
      if (isRegister) await api.post('/auth/register', form);
      const res = await api.post('/auth/login', { email: form.email, password: form.password });
      localStorage.setItem('token', res.data.token);      // keep the token
      navigate('/skills');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 440 }}>
      <div className="eyebrow">Level up your actual life</div>
      <h1 className="mb-1">Level 616</h1>
      <p className="tagline">Your skills. Your effort. One real timeline.</p>

      <form onSubmit={submit}>
        {isRegister && (
          <input className="form-control form-control-lg mb-3" name="name" placeholder="Name"
                 value={form.name} onChange={change} />
        )}
        <input className="form-control form-control-lg mb-3" name="email" type="email" placeholder="Email"
               value={form.email} onChange={change} />
        <input className="form-control form-control-lg mb-3" name="password" type="password" placeholder="Password"
               value={form.password} onChange={change} />
        {error && <div className="alert alert-danger py-2">{error}</div>}
        <button className="btn btn-primary btn-lg w-100">{isRegister ? 'Create account' : 'Log in'}</button>
      </form>

      <button type="button" className="btn btn-link px-0 mt-3" onClick={() => setIsRegister(!isRegister)}>
        {isRegister ? 'Have an account? Log in' : 'New here? Create an account'}
      </button>

      <div className="chips">
        <span>Skill levels</span>
        <span>Daily log</span>
        <span>Priority list</span>
        <span>Streaks</span>
      </div>
    </div>
  );
}