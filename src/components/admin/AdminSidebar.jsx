import { NavLink } from "react-router-dom"
import { UserCog, BookOpenCheck } from 'lucide-react'
import useLogout from '../../hooks/useLogout'

const navItems = [
  { label: "Quản lý bài học", icon: <BookOpenCheck size={20} color="#45B7D1" />, to: "/lessons-management" },
  { label: "Quản lý người dùng", icon: <UserCog size={20} color="#4ECDC4" />, to: "/users-management" },
]

const AdminSidebar = () => {
  const { logout, loading: logoutLoading } = useLogout()
  const handleLogout = () => logout()
  return (
    <div className="flex flex-col justify-between h-screen w-64 bg-white shadow-lg border-r border-blue-100 p-4 fixed">
      <div className="flex flex-col">
        <h2 className="text-2xl font-bold text-blue-500 mb-8 text-center">HELL ADMIN</h2>
        <nav className="flex flex-col gap-2"> 
          {navItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2 rounded-xl transition-all 
                ${isActive ? "bg-blue-50 text-blue-500 font-semibold border border-blue-200" : "text-gray-600 hover:bg-gray-100"}`}>
              {item.icon}
              <span>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        disabled={logoutLoading}
        className="py-3 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 mb-5"
      >
        {logoutLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}
      </button>
    </div>
  )
}

export default AdminSidebar
