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
import CheckIn from './pages/CheckIn'
import StartExam from './pages/StartExam'
import Review from './pages/Review'
import Statistics from './pages/Admin/Statistics'
import UserManagement from './pages/Admin/UsersManagement'
import LessonsManagement from './pages/Admin/LessonsManagement'
import LessonDetails from './pages/Admin/LessonDetails'

function App() {
  const { authUser, isLoading, isRefreshing } = useAuthContext()

  if (isLoading || isRefreshing) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  )

  const getRedirectPath = () => {
    if (!authUser) return "/login"
    return authUser.role_id === 1 ? "/statistics" : "/learn"
  }

  const RoleBasedNavigate = () => <Navigate to={getRedirectPath()} />

  return (
    <>
      <Routes>
        {/* route ai vào cũng được */}
        <Route path="/" element={authUser ? <RoleBasedNavigate /> : <LandingPage />} />
        <Route path="/login" element={authUser ? <RoleBasedNavigate /> : <Login />} />
        <Route path="/register" element={authUser ? <RoleBasedNavigate /> : <Register />} />
        <Route path="/forgot-password" element={authUser ? <RoleBasedNavigate /> : <ForgotPassword />} />
        <Route path="/reset-password" element={authUser ? <RoleBasedNavigate /> : <ResetPassword />} />

        {/* route chỉ dành cho người học */}
        <Route path="/learn" element={authUser?.role_id === 2 ? <Learn /> : <RoleBasedNavigate />} />
        <Route path="/profile" element={authUser?.role_id === 2 ? <Profile /> : <RoleBasedNavigate />} />
        <Route path="/mission" element={authUser?.role_id === 2 ? <Missions /> : <RoleBasedNavigate />} />
        <Route path="/checkin" element={authUser?.role_id === 2 ? <CheckIn /> : <RoleBasedNavigate />} />
        <Route path="/shop" element={authUser?.role_id === 2 ? <Shop /> : <RoleBasedNavigate />} />
        <Route path="/leaderboard" element={authUser?.role_id === 2 ? <LeaderBoards /> : <RoleBasedNavigate />} />
        <Route 
          path="/lesson/:lessonId/questions" 
          element={authUser?.role_id === 2 ? <StartExam /> : <RoleBasedNavigate />} 
        />
        <Route 
          path="/review/:lessonId" 
          element={authUser?.role_id === 2 ? <Review /> : <RoleBasedNavigate />} 
        />

        {/* route chỉ dành cho admin */}
        <Route 
          path="/statistics" 
          element={authUser?.role_id === 1 ? <Statistics /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/users-management" 
          element={authUser?.role_id === 1 ? <UserManagement /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/lessons-management" 
          element={authUser?.role_id === 1 ? <LessonsManagement /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/lesson-details/:lessonId" 
          element={authUser?.role_id === 1 ? <LessonDetails /> : <RoleBasedNavigate />} 
        />

        {/* route fallback */}
        <Route path="*" element={<Navigate to={authUser ? getRedirectPath() : "/"} />} />
      </Routes>
    </>
  )
}

export default App
