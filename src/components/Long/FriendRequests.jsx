import React, { useState } from 'react';
import { friend_requests_list } from '../../data/data.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FriendRequests = () => {
  const [requests, setRequests] = useState(friend_requests_list);

  const handleAccept = (id, name) => {
    setRequests(prev => prev.filter(user => user.id !== id));
    toast.success(`✅ Đã chấp nhận ${name}`);
  };

  const handleDelete = (id, name) => {
    setRequests(prev => prev.filter(user => user.id !== id));
    toast.info(`🗑️ Đã xóa lời mời từ ${name}`);
  };

  return (
    <div className="bg-[#18191a] text-white p-6 rounded-xl">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      <h3 className="text-xl font-bold mb-2">Lời mời kết bạn</h3>

      {requests.length === 0 ? (
        <p className="text-gray-400">🎉 Không còn lời mời kết bạn nào.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {requests.map(user => (
            <div
              key={user.id}
              className="flex items-start bg-[#242526] p-4 rounded-lg gap-3"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover"
              />

              <div className="flex-1">
                <div className="leading-snug">
                  <span className="font-semibold text-white">{user.name}</span>{' '}
                  đã gửi lời mời kết bạn tới bạn.
                </div>
                <div className="text-xs text-gray-400 mt-1">{user.time}</div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleAccept(user.id, user.name)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                >
                  Xác nhận
                </button>
                <button
                  onClick={() => handleDelete(user.id, user.name)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md text-sm"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FriendRequests;
