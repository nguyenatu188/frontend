import { NavLink } from "react-router-dom";
import { Home, Activity, Shield, Store, User, MoreHorizontal, Target } from "lucide-react";

const navItems = [
  { label: "Học", icon: <Home size={20} color="#4DA8FF" />, to: "/hoc" },
  { label: "Thực hành", icon: <Activity size={20} color="#FF6B6B" />, to: "/thuc-hanh" },
  { label: "Bảng xếp hạng", icon: <Shield size={20} color="#4ECDC4" />, to: "/leaderboard" },
  { label: "Cửa hàng", icon: <Store size={20} color="#45B7D1" />, to: "/cua-hang" },
  { label: "Hồ sơ", icon: <User size={20} color="#9B59B6" />, to: "/ho-so" },
  { label: "Nhiệm vụ", icon: <Target size={20} color="#F7B731" />, to: "/mission" },
  { label: "Xem thêm", icon: <MoreHorizontal size={20} color="#2ECC71" />, to: "/xem-them" },
];

const Sidebar = () => {
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
              ${isActive ? "bg-blue-50 text-blue-500 font-semibold border border-blue-200" : "text-gray-600 hover:bg-gray-100"}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;