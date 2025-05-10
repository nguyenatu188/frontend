import React, { useState } from 'react';
import { UsersList, FriList } from '../../data/data.js';
import { FaSearch } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Normalize chuỗi để tìm kiếm
const normalizeText = (str) =>
  str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

const AddFriends = () => {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);

  // Tạo Set chứa các id bạn bè
  const friendIdSet = new Set(FriList.map((f) => f.id));

  const handleSearch = () => {
    const query = normalizeText(keyword);
    const filtered = UsersList.filter((user) =>
      normalizeText(user.name).includes(query)
    );
    setResults(filtered);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleSend = (id, name) => {
    setResults((prev) => prev.filter((user) => user.id !== id));
    toast.success(`✅ Đã gửi yêu cầu kết bạn tới ${name} thành công!`);
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: '0 auto' }}>
      <h2>Thêm bạn bè</h2>
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      {/* Thanh tìm kiếm */}
      <div style={{ display: 'flex', marginBottom: 20 }}>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tìm kiếm bạn bè..."
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 4,
            border: '1px solid #ccc'
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            marginLeft: 8,
            padding: 10,
            borderRadius: 4,
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <FaSearch />
        </button>
      </div>

      {/* Không tìm thấy */}
      {results.length === 0 && keyword !== '' && (
        <p style={{ textAlign: 'center', color: '#999' }}>
          😕 Không tìm thấy người dùng nào
        </p>
      )}

      {/* Danh sách kết quả */}
      {results.map((user) => {
        const isFriend = friendIdSet.has(user.id);
        return (
          <div
            key={user.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px 0',
              borderBottom: '1px solid #eee'
            }}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !isFriend) handleSend(user.id, user.name);
            }}
          >
            <img
              src={user.avatar}
              alt={user.name}
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                marginRight: 10
              }}
            />
            <div style={{ flex: 1 }}>{user.name}</div>
            {isFriend ? (
              <span style={{ color: '#28a745', fontWeight: 'bold' }}>Bạn bè</span>
            ) : (
              <button
                onClick={() => handleSend(user.id, user.name)}
                style={{
                  backgroundColor: '#1877f2',
                  color: '#fff',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: 4,
                  cursor: 'pointer'
                }}
              >
                Thêm bạn bè
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AddFriends;
