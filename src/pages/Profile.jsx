import React from 'react'
import useLogout from '../hooks/useLogout'

const Profile = () => {
  const { logout, loading } = useLogout()

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={handleLogout}
        disabled={loading}
        className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
      >
        {loading ? "Đang đăng xuất..." : "Đăng xuất"}
      </button>
    </div>
  )
}

export default Profile
