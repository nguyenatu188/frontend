// App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import Lessons from './pages/Lessons'
import Learn from './pages/Learn'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/lessons" element={<Lessons />} />
      <Route path='learn' element={<Learn />} />
    </Routes>
  )
}

export default App
