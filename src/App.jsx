// App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'

function App() {
  const location = useLocation();

  const noSidebarPaths = ['/', '/login', '/register'];
  const isNoSidebar = noSidebarPaths.includes(location.pathname);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App;
