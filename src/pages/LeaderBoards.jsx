import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import useLeaderboard from '../hooks/useLeaderboard'; 

// Import ảnh như module
import bronzeImg from '../assets/bronze.jpg';
import silverImg from '../assets/silver.jpg';
import goldImg from '../assets/gold.jpg';
import platinumImg from '../assets/platinum.jpg';
import diamondImg from '../assets/diamond.jpg'; 

const LeaderBoards = () => {
  const [showUserDetails, setShowUserDetails] = useState(null);
  const [selectedRankTier, setSelectedRankTier] = useState('Gold'); 
  const [activeTab, setActiveTab] = useState('all'); 

  const { 
    leaderboard, 
    userRank, 
    friendsLeaderboard, 
    loading, 
    error, 
    fetchLeaderboard, 
    fetchUserRank, 
    fetchFriendsLeaderboard 
  } = useLeaderboard();

  const rankTiers = [
    { name: 'Bronze', image: bronzeImg },
    { name: 'Silver', image: silverImg },
    { name: 'Gold', image: goldImg },
    { name: 'Platinum', image: platinumImg },
    { name: 'Diamond', image: diamondImg }, 
  ];

  const handleUserClick = (user) => {
    setShowUserDetails(user);
  };

  const getRankImage = (rankName) => {
    const tier = rankTiers.find((t) => t.name === rankName);
    return tier ? tier.image : goldImg; 
  };

  useEffect(() => {
    if (activeTab === 'friends' && friendsLeaderboard.length === 0) { 
        fetchFriendsLeaderboard();
    }
  }, [activeTab, fetchFriendsLeaderboard, friendsLeaderboard.length]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-700">Đang tải bảng xếp hạng...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-red-100">
        <p className="text-lg text-red-700">Lỗi: {error.message}. Vui lòng thử lại.</p>
        <button
          onClick={() => {
            fetchLeaderboard();
            fetchUserRank();
            if (activeTab === 'friends') {
                fetchFriendsLeaderboard(); 
            }
          }}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Tải lại
        </button>
      </div>
    );
  }

  let rawLeaderboardData = [];
  if (activeTab === 'all') {
    rawLeaderboardData = leaderboard[selectedRankTier] || [];
  } else { 
    rawLeaderboardData = friendsLeaderboard;
  }

  const currentLeaderboardData = activeTab === 'all' 
    ? rawLeaderboardData 
    : rawLeaderboardData.filter(user => user.rank === selectedRankTier); 

  return (
    <div className="flex min-h-screen bg-white from-blue-900 via-blue-700 to-blue-500">
      <Sidebar />
      <div className="flex-1 p-4">
        {/* Thanh chuyển đổi tab (All Users / Friends) */}
        <div className="bg-white p-4 rounded-lg mb-4 max-w-3xl mx-auto flex justify-center gap-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-lg text-lg font-semibold 
                        ${activeTab === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Tất cả người dùng
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-6 py-3 rounded-lg text-lg font-semibold 
                        ${activeTab === 'friends' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          >
            Bạn bè
          </button>
        </div>

        {/* Phần hiển thị lựa chọn Rank Tier (luôn hiển thị) */}
        <div className="bg-white p-4 rounded-lg mb-4 max-w-3xl mx-auto">
            <div className="flex justify-center gap-4">
                {rankTiers.map((tier) => (
                <button
                    key={tier.name}
                    onClick={() => setSelectedRankTier(tier.name)}
                    className={`p-4 rounded-lg ${selectedRankTier === tier.name ? 'bg-white' : 'bg-transparent'
                    }`}
                >
                    <img
                    src={tier.image}
                    alt={`${tier.name} rank icon`}
                    className="object-contain"
                    style={{ height: '160px', width: '160px' }}
                    />
                </button>
                ))}
            </div>
        </div>

        {/* Danh sách người dùng theo tab và rank được chọn */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 max-w-3xl mx-auto">
          <ul className="space-y-2">
            {currentLeaderboardData.length > 0 ? (
              currentLeaderboardData.map((user) => (
                <li
                  key={user.user_id} 
                  className="flex items-center justify-between p-2 hover:bg-gray-100 rounded cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="flex items-center gap-2">
                    {/* Ảnh đại diện người dùng */}
                    <img
                      src={user.avatar} 
                      alt={`${user.username} avatar`}
                      className="h-12 w-12 rounded-full object-cover"
                    />

                    <span className="text-sm font-semibold text-gray-800">
                      {user.position}. {user.username}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{user.total_score} points</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-600">
                {activeTab === 'all' 
                    ? `Không có người dùng nào ở mức rank ${selectedRankTier}.` 
                    : `Không có bạn bè nào ở mức rank ${selectedRankTier}.`}
              </li>
            )}
          </ul>
        </div>

        {/* Modal hiển thị thông tin chi tiết khi nhấp vào người dùng */}
        {showUserDetails && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 bg-white border border-gray-200 rounded-lg shadow-md p-4 z-20">
            <h3 className="text-md font-semibold text-gray-800 mb-2">
              Thông tin người dùng
            </h3>
            <p className="text-sm text-gray-600">Rank: {showUserDetails.rank}</p>
            <p className="text-sm text-gray-600">Position: #{showUserDetails.position}</p>
            <p className="text-sm text-gray-600">
              Username: {showUserDetails.username}
            </p>
            <p className="text-sm text-gray-600">Points: {showUserDetails.total_score}</p>
            <button
              className="mt-2 text-sm text-blue-500 hover:text-blue-700"
              onClick={() => setShowUserDetails(null)}
            >
              Đóng
            </button>
          </div>
        )}

        {/* Phần "Rank của tôi" (dữ liệu từ API) */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mt-4 max-w-3xl mx-auto flex items-center gap-2">
          {userRank ? (
            <>
              <img
                src={userRank.avatar || getRankImage(userRank.rank)} // Ưu tiên avatar của userRank, nếu không có thì dùng ảnh rank
                alt="My rank icon"
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h2 className="text-sm font-semibold text-gray-800">Rank của tôi</h2>
                <p className="text-sm text-gray-600">#{userRank.position} - {userRank.username} ({userRank.total_score} points)</p>
                <p className="text-sm text-gray-600">Rank: {userRank.rank}</p>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-600">Không tìm thấy thông tin rank của bạn.</p>
          )}
        </div>
      </div>
      <RightSidebar />
    </div>
  );
};

export default LeaderBoards;