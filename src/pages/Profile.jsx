import useLogout from '../hooks/useLogout'
import Sidebar from '../components/Sidebar'

const Profile = () => {
  const { logout, loading } = useLogout()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="flex">
      <Sidebar className="fixed"/>
      <div className="h-screen w-full flex items-center justify-center bg-gray-50 text-gray-800">
        
        <button
          onClick={handleLogout}
          disabled={loading}
          className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </button>
      </div>
    </div>
  )
}

export default Profile
