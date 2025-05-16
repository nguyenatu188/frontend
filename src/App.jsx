// App.jsx
import { Navigate, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import Learn from './pages/Learn'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import { useAuthContext } from './context/AuthContext'
import Missions from './pages/Missions'
import Comment from './components/Comments'

function App() {
  const { authUser, isLoading } = useAuthContext();
  if (isLoading) return null;

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={authUser ? <Navigate to="/learn" /> : <Register />} />
        <Route path="/forgot-password" element={ !authUser ? <ForgotPassword/> : <Navigate to="/learn"/> } />
        <Route path="/reset-password" element={ !authUser ? <ResetPassword/> : <Navigate to="/learn"/> } />
        <Route path="/login" element={authUser ? <Navigate to="/learn" /> : <Login />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/learn" element={authUser ? <Learn /> : <Navigate to="/login" />} />
        <Route path="/comment" element={authUser ? <Comment /> : <Navigate to="/login" />} />
        <Route path="/mission" element={authUser ? <Missions /> : <Navigate to="/login" />} />
      </Routes>

    </>
  )
}

export default App;
