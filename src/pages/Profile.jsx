import React from 'react';
import useLogout from '../hooks/useLogout';
import Sidebar from '../components/Sidebar';

const Profile = () => {
  const { logout, loading } = useLogout();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="fixed top-0 left-0 w-64 h-full bg-white shadow-md z-30">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64 p-4">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </button>
      </div>
    </div>
  );
};

export default Profile;