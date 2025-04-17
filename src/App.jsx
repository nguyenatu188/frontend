// App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import Comments from './components/Long/Comments'
import FriendsList from './components/Long/FriendsList'
import FriendRequests from './components/Long/FriendRequests'

function App() {
  return (
    <Routes>
      <Route path="/" element={<FriendRequests />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  )
}

export default App
