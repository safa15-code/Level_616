import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Skills from './pages/Skills.jsx'
import Dashboard from './pages/Dashboard.jsx'

function Protected({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/skills" element={<Protected><Skills /></Protected>} />
      <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}