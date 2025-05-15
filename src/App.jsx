// App.jsx
import { Navigate, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'
import Register from './pages/Register'
import Learn from './pages/Learn'
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Shop from './pages/Shop'
import { useAuthContext } from './context/AuthContext'
import Missions from './pages/Missions'
import LeaderBoards  from './pages/LeaderBoards'

function App() {
  const { authUser, isLoading, isRefreshing } = useAuthContext();
  if (isLoading || isRefreshing) return
  (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
  )

  return (
    <>
      <Routes>
        <Route path="/" element={authUser ? <Navigate to="/learn" /> : <LandingPage />} />
        <Route path="/register" element={authUser ? <Navigate to="/learn" /> : <Register />} />
        <Route path="/forgot-password" element={ !authUser ? <ForgotPassword/> : <Navigate to="/learn"/> } />
        <Route path="/reset-password" element={ !authUser ? <ResetPassword/> : <Navigate to="/learn"/> } />
        <Route path="/login" element={authUser ? <Navigate to="/learn" /> : <Login />} />
        <Route path="/profile" element={authUser ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/learn" element={authUser ? <Learn /> : <Navigate to="/login" />} />
        <Route path="/mission" element={authUser ? <Missions /> : <Navigate to="/login" />} />
        <Route path="/shop" element={authUser ? <Shop /> : <Navigate to="/login" />} />
        <Route path="/leaderboard" element={authUser ? <LeaderBoards /> : <Navigate to="/login" />} />
        


      </Routes>
    </>
  )
}

export default App;
