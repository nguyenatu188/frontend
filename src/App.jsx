// App.jsx
import React from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import Learn from './pages/Learn'
import Profile from './pages/Profile'
import { useAuthContext } from './context/AuthContext'

function App() {
  const { authUser, isLoading } = useAuthContext()
  if (isLoading) return null
  return (
    <Routes>
      <Route path="/" element={ !authUser ? <LandingPage/> : <Navigate to="/learn"/> } />
      <Route path="/learn" element={ authUser ? <Learn/> : <Navigate to="/login"/> } />
      <Route path="/profile" element={ authUser ? <Profile/> : <Navigate to="/login"/> } />
      <Route path="/register" element={ !authUser ? <Register/> : <Navigate to="/learn"/> } />
      <Route path="/login" element={ !authUser ? <Login/> : <Navigate to="/learn"/> } />
    </Routes>
  )
}

export default App
