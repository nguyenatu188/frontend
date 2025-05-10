import { NavLink } from "react-router-dom";
import { Home, Activity, Shield, Store, User, MoreHorizontal, Target } from "lucide-react";
import { useAuthContext } from '../context/AuthContext';

const navItems = [
  { label: "Học", icon: <Home size={20} />, to: "/learn" },
  { label: "Thực hành", icon: <Activity size={20} />, to: "/practice" },
  { label: "Bảng xếp hạng", icon: <Shield size={20} />, to: "/ranking" },
  { label: "Cửa hàng", icon: <Store size={20} />, to: "/shop" },  // Add if you have a Shop page
  { label: "Hồ sơ", icon: <User size={20} />, to: "/profile" },
  { label: "Nhiệm vụ", icon: <Target size={20} />, to: "/mission" },
  { label: "Xem thêm", icon: <MoreHorizontal size={20} />, to: "/more" }, // Add if you have More page
];

const Sidebar = () => {
  const { authUser } = useAuthContext();

  return (
    <div className="h-screen w-64 bg-white shadow-lg border-r border-blue-100 p-4">
      <h2 className="text-2xl font-bold text-blue-500 mb-8 text-center">THANH HÓA</h2>
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
              {authUser && item.label === "Hồ sơ" ? " (Chào, " + authUser.name + ")" : ""}
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
