import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';

// Import ảnh như module
import bronzeImg from '../assets/bronze.jpg';
import silverImg from '../assets/silver.jpg';
import goldImg from '../assets/gold.jpg';
import platinumImg from '../assets/platinum.jpg';
import emeraldImg from '../assets/emerald.jpg';
import masterImg from '../assets/master.jpg';

const LeaderBoards = () => {
  const [showUserDetails, setShowUserDetails] = useState(null);
  const [selectedRankTier, setSelectedRankTier] = useState('Gold'); // Mức rank được chọn mặc định

  // Dữ liệu fix cứng cho các mức rank và người dùng
  const rankTiers = [
    { name: 'Bronze', image: bronzeImg },    // Đồng
    { name: 'Silver', image: silverImg },    // Bạc
    { name: 'Gold', image: goldImg },        // Vàng
    { name: 'Platinum', image: platinumImg },// Bạch Kim
    { name: 'Emerald', image: emeraldImg },  // Lục Bảo
    { name: 'Master', image: masterImg },    // Cao Thủ
  ];

  const leaderboardData = {
    Bronze: [
      { rank: 11, username: 'User D', points: 900 },
      { rank: 12, username: 'User E', points: 850 },
    ],
    Silver: [
      { rank: 9, username: 'User K', points: 1000 },
      { rank: 10, username: 'User L', points: 950 },
    ],
    Gold: [
      { rank: 7, username: 'User F', points: 1100 },
      { rank: 8, username: 'User G', points: 1050 },
    ],
    Platinum: [
      { rank: 5, username: 'User I', points: 1150 },
      { rank: 6, username: 'User J', points: 1100 },
    ],
    Emerald: [
      { rank: 3, username: 'User C', points: 1300 },
      { rank: 4, username: 'User H', points: 1200 },
    ],
    Master: [
      { rank: 1, username: 'User A', points: 1500 },
      { rank: 2, username: 'User B', points: 1400 },
    ],
  };

  // Dữ liệu fix cứng cho "Rank của tôi"
  const myRank = 10;
  const myUsername = 'phuc';

  // Hàm xử lý khi nhấp vào một người dùng
  const handleUserClick = (user) => {
    setShowUserDetails(user);
  };

  return (
    <div className="flex min-h-screen bg-white from-blue-900 via-blue-700 to-blue-500">
      <Sidebar />
      <div className="flex-1 p-4">
        {/* Tiêu đề và hàng tab */}
        <div className="bg-white p-4 rounded-lg  mb-4 max-w-3xl mx-auto">
          {/* Hàng tab chỉ hiển thị ảnh to, căn giữa */}
          <div className="flex justify-center gap-4">
            {rankTiers.map((tier) => (
              <button
                key={tier.name}
                onClick={() => setSelectedRankTier(tier.name)}
                className={`p-4 rounded-lg ${selectedRankTier === tier.name ? 'bg-withe' : 'bg-transparent'
                  }`}
              >
                <img
                  src={tier.image}
                  alt={`${tier.name} rank icon`}
                  className="object-contain"
                  style={{ height: '160px', width: '160px' }} // 160px = h-40
                />

              </button>
            ))}
          </div>
        </div>

        {/* Danh sách người dùng theo mức rank được chọn */}
        <div
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 max-w-3xl mx-auto"
        >

          <ul className="space-y-2">
            {leaderboardData[selectedRankTier].length > 0 ? (
              leaderboardData[selectedRankTier].map((user) => (
                <li
                  key={user.rank}
                  className="flex items-center justify-between p-2 hover:bg-grey rounded cursor-pointer"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={rankTiers.find((t) => t.name === selectedRankTier).image}
                      alt={`${selectedRankTier} rank icon`}
                      className="h-12 w-12 object-contain"
                    />

                    <span className="text-sm font-semibold text-gray-800">
                      {user.rank}. {user.username}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">{user.points} points</span>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-600">Không có người dùng nào ở mức rank này.</li>
            )}
          </ul>
        </div>

        {/* Modal hiển thị thông tin chi tiết khi nhấp vào người dùng */}
        {showUserDetails && (
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 bg-white border border-gray-200 rounded-lg shadow-md p-4 z-20">
            <h3 className="text-md font-semibold text-gray-800 mb-2">
              Thông tin người dùng
            </h3>
            <p className="text-sm text-gray-600">Rank: #{showUserDetails.rank}</p>
            <p className="text-sm text-gray-600">
              Username: {showUserDetails.username}
            </p>
            <p className="text-sm text-gray-600">Points: {showUserDetails.points}</p>
            <button
              className="mt-2 text-sm text-blue-500 hover:text-blue-700"
              onClick={() => setShowUserDetails(null)}
            >
              Đóng
            </button>
          </div>
        )}

        {/* Phần "Rank của tôi" (fix cứng) */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mt-4 max-w-3xl mx-auto">
          <img
            src={goldImg} 
            alt="My rank icon"
            className="h-6 w-6 object-contain"
          />
          <div>
            <h2 className="text-sm font-semibold text-gray-800">Rank của tôi</h2>
            <p className="text-sm text-gray-600">#{myRank} - {myUsername}</p>
          </div>
        </div>
      </div>
      <RightSidebar />
    </div>
  );
};

export default LeaderBoards;