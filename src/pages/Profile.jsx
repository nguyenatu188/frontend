import useLogout from '../hooks/useLogout'
import Sidebar from '../components/Sidebar'

const Profile = () => {
  const { logout, loading } = useLogout()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="flex h-screen">
      <Sidebar className="fixed"/>
      <div className="flex-1 p-4">
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
