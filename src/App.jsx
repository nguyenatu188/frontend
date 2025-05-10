// App.jsx
import React from 'react'
import { Navigate, Routes, Route, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import DashboardLayout from './components/DashboardLayout';
import { useAuthContext } from './context/AuthContext'

function App() {
  const location = useLocation();
  const { authUser, isLoading } = useAuthContext();
  if (isLoading) return null;
  const noSidebarPaths = ['/', '/login', '/register'];
  const isNoSidebar = noSidebarPaths.includes(location.pathname);
  return (
    <>
      {isNoSidebar && !authUser ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

        </Routes>
      ) : (
        <DashboardLayout />

      )}
    </>
  )
}

export default App;
