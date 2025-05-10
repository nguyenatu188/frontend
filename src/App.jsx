import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import DashboardLayout from './components/DashboardLayout';

function App() {
  const location = useLocation();

  const noSidebarPaths = ['/', '/login', '/register'];
  const isNoSidebar = noSidebarPaths.includes(location.pathname);

  return (
    <>
      {isNoSidebar ? (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      ) : (
        <DashboardLayout />
      )}
    </>
  );
}

export default App;
