import React from 'react';
import { FriList } from '../../data/data.js';

const FriendsList = () => {
  return (
    <div style={{ padding: '10px' }}>
      <h3>👥 Danh sách bạn bè</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {FriList.map(friend => (
          <li
            key={friend.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
              gap: '10px'
            }}
          >
            <img
              src={friend.avatar}
              alt={friend.name}
              style={{ width: 40, height: 40, borderRadius: '50%' }}
            />
            <span style={{ fontWeight: 'bold', color: '#333' }}>{friend.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FriendsList;
