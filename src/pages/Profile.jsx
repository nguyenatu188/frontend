// D:\HKII_24-25\PMNMPRO\DOAN\frontend\src\pages\Profile.jsx
import React, { useState } from 'react';
import useLogout from '../hooks/useLogout';
import useFriends from '../hooks/useFriends';
import Sidebar from '../components/Sidebar';

const Profile = () => {
  const { logout, loading: logoutLoading } = useLogout();
  const {
    friendRequestsSent,
    friends,
    loading: friendsLoading,
    deleteFriend,
    revokeSentRequest,
  } = useFriends();
  const [activeTab, setActiveTab] = useState('sent');

  const handleLogout = () => logout();

  return (
    <div className="flex">
      <Sidebar />
      {/* 2/3 trái */}
      <div className="h-screen w-full flex justify-center items-center bg-white border-r">
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {logoutLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </button>
      </div>

      {/* 1/3 phải */}
      <div className="w-1/3 px-6 pt-20 bg-gray-50 overflow-auto space-y-4">
        {/* Tabs */}
        <div className="h-70 bg-white rounded-lg shadow-sm">
          <div className="flex border-b">
            <button
              className={`flex-1 px-4 py-2 text-sm font-semibold text-center ${activeTab === 'sent' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-400'
                }`}
              onClick={() => setActiveTab('sent')}
            >
              Lời mời đã gửi
            </button>
            <button
              className={`flex-1 px-4 py-2 text-sm font-semibold text-center ${activeTab === 'friends' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-400'
                }`}
              onClick={() => setActiveTab('friends')}
            >
              Bạn bè
            </button>
          </div>

          <div className="p-4">
            {friendsLoading ? (
              <p className="text-sm text-gray-500 text-center">Đang tải...</p>
            ) : activeTab === 'sent' ? (
              friendRequestsSent.length === 0 ? (
                <p className="text-sm text-gray-500 text-center">Chưa có lời mời nào</p>
              ) : (
                <ul className="text-sm text-gray-800 space-y-2">
                  {friendRequestsSent.map((req) => (
                    <li key={req.request_id} className="flex justify-between items-center border-b pb-1">
                      <span>{req.receiver?.full_name || req.receiver?.username}</span>
                      <button
                        onClick={() => revokeSentRequest(req.request_id)}
                        className="text-xs text-blue-500 hover:underline"
                      >
                        Thu hồi
                      </button>
                    </li>
                  ))}
                </ul>
              )
            ) : friends.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">Chưa có bạn bè nào</p>
            ) : (
              <ul className="text-sm text-gray-800 space-y-2">
                {friends.map((user) => (
                  <li key={user.user_id} className="flex justify-between items-center border-b pb-1">
                    <span>{user.full_name || user.username}</span>
                    <button
                      onClick={() => deleteFriend(user.user_id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Xóa
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Box: Add friends */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Thêm bạn bè</h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
              <div className="flex items-center gap-2">
                <span role="img" aria-label="search">🔍</span>
                <span className="text-sm text-gray-700 font-medium">Tìm bạn bè</span>
              </div>
              <span className="text-gray-400">›</span>
            </li>
            <li className="flex justify-between items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded">
              <div className="flex items-center gap-2">
                <span role="img" aria-label="invite">📩</span>
                <span className="text-sm text-gray-700 font-medium">Mời bạn bè</span>
              </div>
              <span className="text-gray-400">›</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
