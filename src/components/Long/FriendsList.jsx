import React, { useState } from 'react';
import { FriList as InitialFriList } from '../../data/data.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FriendsList = () => {
  const [friends, setFriends] = useState(InitialFriList);

  const handleUnfriend = (id, name) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
    toast.info(`👋 Bạn đã huỷ kết bạn với ${name}`);
  };

  return (
    <div style={{ padding: '10px' }}>
      <h3>👥 Danh sách bạn bè</h3>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
      
      {friends.length === 0 ? (
        <p style={{ color: '#888', textAlign: 'center' }}>😕 Không có bạn bè nào</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {friends.map((friend) => (
            <li
              key={friend.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
                gap: '10px',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  style={{ width: 40, height: 40, borderRadius: '50%' }}
                />
                <span style={{ fontWeight: 'bold', color: '#333' }}>{friend.name}</span>
              </div>
              <button
                onClick={() => handleUnfriend(friend.id, friend.name)}
                style={{
                  backgroundColor: '#f44336',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 4,
                  padding: '6px 10px',
                  cursor: 'pointer'
                }}
              >
                Huỷ kết bạn
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsList;
