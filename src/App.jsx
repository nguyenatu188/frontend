// App.jsx
import React from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import { useAuthContext } from './context/AuthContext'
import Profile from './pages/Profile'
import Learn from './pages/Learn'
import StartExam from './pages/StartExam'

function App() {
  const { authUser, isLoading } = useAuthContext();
  if (isLoading) return null;

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={authUser ? <Navigate to="/learn" /> : <Register />} />
        <Route path="/login" element={authUser ? <Navigate to="/learn" /> : <Login />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/learn" element={authUser ? <Learn /> : <Navigate to="/login" />} />
        <Route path="/lesson/:lessonId/questions" element={ authUser ? <StartExam /> : <Navigate to="/login" />} />

      </Routes>

    </>
  )
}

export default App;
