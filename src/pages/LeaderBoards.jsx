import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar'; 
import RightSidebar from '../components/RightSidebar'; 
import useLeaderboard from '../hooks/useLeaderboard'; 

// Import ảnh rank. Giả định ảnh có nền trong suốt hoặc phù hợp.
import bronzeImg from '../assets/bronze.jpg';
import silverImg from '../assets/silver.jpg';
import goldImg from '../assets/gold.jpg';
import platinumImg from '../assets/platinum.jpg';
import diamondImg from '../assets/diamond.jpg';
import useBoughtMascots from '../hooks/useBoughtMascots';

// Định nghĩa các biến màu sắc cho tone trắng-xám
const PRIMARY_TEXT_COLOR = 'gray-900'; // Màu chữ chính
const SECONDARY_TEXT_COLOR = 'gray-600'; // Màu chữ phụ, mô tả
const ACCENT_COLOR = 'gray-700'; // Màu nhấn nhẹ, có thể dùng cho button active
const BG_LIGHT = 'white'; // Nền chính của các card
const BG_MEDIUM = 'gray-100'; // Nền phụ nhẹ hơn
const BORDER_COLOR = 'gray-200'; // Màu viền
const SHADOW_COLOR = 'shadow-md'; // Độ đậm của bóng đổ

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

  const {
    loading: mascotsLoading,
    activeMascotImage
  } = useBoughtMascots()

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

  // Logic hiển thị Loading và Error đã được thiết kế lại
  if (loading) {
    return (
      <div className={`flex min-h-screen items-center justify-center bg-${BG_MEDIUM}`}>
        <div className={`flex flex-col items-center p-8 bg-${BG_LIGHT} rounded-xl ${SHADOW_COLOR}`}>
          <svg className={`animate-spin h-10 w-10 text-${ACCENT_COLOR}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className={`mt-4 text-xl font-semibold text-${PRIMARY_TEXT_COLOR}`}>Đang tải bảng xếp hạng...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex min-h-screen items-center justify-center bg-red-50`}>
        <div className={`flex flex-col items-center p-8 bg-${BG_LIGHT} rounded-xl ${SHADOW_COLOR} border border-red-300`}>
          <p className={`text-xl font-semibold text-red-700`}>Lỗi: {error.message}</p>
          <p className={`text-md text-red-500 mt-2`}>Có vẻ như có vấn đề khi tải dữ liệu.</p>
          <button
            onClick={() => {
              fetchLeaderboard();
              fetchUserRank();
              if (activeTab === 'friends') {
                  fetchFriendsLeaderboard(); 
              }
            }}
            className={`mt-6 px-6 py-3 bg-${ACCENT_COLOR} text-white font-semibold rounded-lg ${SHADOW_COLOR} 
                        hover:bg-gray-800 transition duration-300 ease-in-out transform hover:scale-105`}
          >
            Thử tải lại
          </button>
        </div>
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
    <div className={`flex min-h-screen bg-${BG_MEDIUM} text-${PRIMARY_TEXT_COLOR}`}>
      <Sidebar /> {/* Đảm bảo Sidebar có tone màu xám/trắng */}
      <div className="flex-1 p-6 md:p-8"> 
        
        {/* Tiêu đề trang */}
        <h1 className={`text-3xl md:text-4xl font-extrabold text-${PRIMARY_TEXT_COLOR} mb-6 text-center drop-shadow-sm`}>
            Bảng Xếp Hạng
        </h1>

        {/* Thanh chuyển đổi tab (All Users / Friends) */}
        <div className={`bg-${BG_LIGHT} p-2 rounded-xl ${SHADOW_COLOR} mb-6 max-w-4xl mx-auto flex justify-center gap-2`}>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 px-4 py-2 md:px-6 md:py-3 rounded-lg text-lg font-semibold transition duration-300 ease-in-out
                        ${activeTab === 'all' ? `bg-${ACCENT_COLOR} text-black ${SHADOW_COLOR}` : `bg-${BG_MEDIUM} text-${SECONDARY_TEXT_COLOR} hover:bg-gray-200`}`}
          >
            Tất cả người dùng
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 px-4 py-2 md:px-6 md:py-3 rounded-lg text-lg font-semibold transition duration-300 ease-in-out
                        ${activeTab === 'friends' ? `bg-${ACCENT_COLOR} text-black ${SHADOW_COLOR}` : `bg-${BG_MEDIUM} text-${SECONDARY_TEXT_COLOR} hover:bg-gray-200`}`}
          >
            Bạn bè
          </button>
        </div>

        {/* Phần lựa chọn Rank Tier */}
        <div className={`bg-${BG_LIGHT} p-4 rounded-xl ${SHADOW_COLOR} mb-6 max-w-4xl mx-auto`}>
            <div className="flex justify-center flex-wrap gap-4"> 
                {rankTiers.map((tier) => (
                <button
                    key={tier.name}
                    onClick={() => setSelectedRankTier(tier.name)}
                    className={`p-2 rounded-xl transition duration-300 ease-in-out transform hover:scale-105 
                                ${selectedRankTier === tier.name ? `bg-${BG_MEDIUM} border-2 border-${ACCENT_COLOR}` : 'bg-transparent'
                                }`}
                >
                    <img
                    src={tier.image}
                    alt={`${tier.name} rank icon`}
                    className="object-contain w-24 h-24 md:w-32 md:h-32" 
                    />
                </button>
                ))}
            </div>
        </div>

        {/* Danh sách người dùng theo tab và rank được chọn */}
        <div className={`bg-${BG_LIGHT} border border-${BORDER_COLOR} rounded-xl ${SHADOW_COLOR} p-6 max-w-4xl mx-auto`}>
          <h2 className={`text-2xl font-bold text-${PRIMARY_TEXT_COLOR} mb-4`}>
              Bảng Xếp Hạng {activeTab === 'all' ? selectedRankTier : `Bạn Bè - ${selectedRankTier}`}
          </h2>
          <ul className="space-y-3"> 
            {currentLeaderboardData.length > 0 ? (
              currentLeaderboardData.map((user) => (
                <li
                  key={user.user_id} 
                  className={`flex items-center justify-between p-4 bg-${BG_MEDIUM} rounded-lg ${SHADOW_COLOR} 
                              hover:bg-gray-200 transition duration-200 ease-in-out cursor-pointer`}
                  onClick={() => handleUserClick(user)}
                >
                  <div className="flex items-center gap-3"> 
                    {/* Ảnh đại diện người dùng */}
                    <img
                      src={`http://127.0.0.1:8000/storage/avatars/${user.avatar}`} 
                      alt={`${user.username} avatar`}
                      className={`h-12 w-12 rounded-full object-cover border-2 border-${BORDER_COLOR} ${SHADOW_COLOR}`}
                    />
                    {/* Ảnh rank nhỏ */}
                    <img
                      src={getRankImage(user.rank)} 
                      alt={`${user.rank} rank`}
                      className="h-7 w-7 object-contain flex-shrink-0" 
                    />
                    <span className={`text-md font-semibold text-${PRIMARY_TEXT_COLOR}`}>
                      <span className={`text-lg font-bold text-${ACCENT_COLOR} mr-2`}>#{user.position}</span>
                      {user.username}
                    </span>
                  </div>
                  <span className={`text-md font-bold text-${ACCENT_COLOR}`}>
                    {user.total_score} <span className={`text-sm font-medium text-${SECONDARY_TEXT_COLOR}`}>điểm</span>
                  </span>
                </li>
              ))
            ) : (
              <li className={`p-4 text-center text-lg text-${SECONDARY_TEXT_COLOR} bg-${BG_MEDIUM} rounded-lg`}>
                {activeTab === 'all' 
                    ? `Không có người dùng nào ở mức rank ${selectedRankTier}.` 
                    : `Không có bạn bè nào ở mức rank ${selectedRankTier}.`}
              </li>
            )}
          </ul>
        </div>

        {/* Phần "Rank của tôi" */}
        <div className={`bg-${BG_LIGHT} border border-${BORDER_COLOR} rounded-xl ${SHADOW_COLOR} p-6 mt-6 max-w-4xl mx-auto flex items-center gap-4`}>
          {userRank ? (
            <>
              <img
                src={userRank.avatar ? `http://127.0.0.1:8000/storage/avatars/${userRank.avatar}` : 'https://via.placeholder.com/64/cccccc/ffffff?text=Me'} // Placeholder xám/trắng
                alt="My avatar"
                className={`h-16 w-16 rounded-full object-cover border-2 border-${ACCENT_COLOR} ${SHADOW_COLOR} flex-shrink-0`}
              />
              <div className="flex-grow">
                <h2 className={`text-xl font-bold text-${PRIMARY_TEXT_COLOR} mb-1`}>Rank của tôi</h2>
                <p className={`text-md text-${SECONDARY_TEXT_COLOR}`}>
                  <span className={`text-lg font-bold text-${ACCENT_COLOR}`}>#{userRank.position}</span> - {userRank.username} 
                  (<span className="font-bold">{userRank.total_score}</span> điểm)
                </p>
                <p className={`text-md text-${PRIMARY_TEXT_COLOR} mt-1`}>
                    Rank: <span className={`font-bold text-${ACCENT_COLOR}`}>{userRank.rank}</span>
                    <img
                        src={getRankImage(userRank.rank)}
                        alt={`${userRank.rank} rank icon`}
                        className="inline-block h-6 w-6 ml-2 object-contain"
                    />
                </p>
              </div>
            </>
          ) : (
            <p className={`text-lg text-${SECONDARY_TEXT_COLOR} text-center w-full`}>Không tìm thấy thông tin rank của bạn.</p>
          )}
        </div>
      </div>
      {activeMascotImage && (
          <div className="absolute bottom-5 right-25 flex items-center justify-center w-42 h-42 fixed">
          {mascotsLoading ? 
              <span className="loading loading-spinner loading-lg text-info"></span> :
              <img
              src={activeMascotImage} 
              alt="Active mascot" 
              className="w-full h-full object-contain"
              />
          }
          </div>
      )}
      <RightSidebar /> {/* Đảm bảo RightSidebar có tone màu xám/trắng */}
       {/* Modal hiển thị thông tin chi tiết khi nhấp vào người dùng */}
       {showUserDetails && (
          <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50 backdrop-blur-sm">
            <div className={`bg-${BG_LIGHT} rounded-xl ${SHADOW_COLOR} p-6 w-full max-w-sm text-${PRIMARY_TEXT_COLOR} relative`}>
              <button 
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl"
                onClick={() => setShowUserDetails(null)}
              >
                &times;
              </button>
              <h3 className={`text-xl font-bold text-${ACCENT_COLOR} mb-4 border-b border-${BORDER_COLOR} pb-2`}>
                Thông tin người dùng
              </h3>
              <div className="flex flex-col items-center mb-4">
                <img
                  src={showUserDetails.avatar
                    ? `http://127.0.0.1:8000/storage/avatars/${showUserDetails.avatar}`
                    : 'https://via.placeholder.com/96/cccccc/ffffff?text=U'}
                  alt={`${showUserDetails.username} avatar`}
                  className={`h-24 w-24 rounded-full object-cover border-4 border-${BORDER_COLOR} ${SHADOW_COLOR} mb-3`}
                />
                <p className={`text-lg font-bold text-${PRIMARY_TEXT_COLOR}`}>{showUserDetails.username}</p>
              </div>
              <p className={`text-md mb-2`}><span className="font-semibold">Hạng:</span> <span className={`font-bold text-${ACCENT_COLOR}`}>#{showUserDetails.position}</span></p>
              <p className={`text-md mb-2`}><span className="font-semibold">Rank:</span> {showUserDetails.rank} 
                <img src={getRankImage(showUserDetails.rank)} alt={`${showUserDetails.rank} icon`} className="inline-block h-5 w-5 ml-2" />
              </p>
              <p className={`text-md mb-2`}><span className="font-semibold">Điểm:</span> <span className={`font-bold text-${ACCENT_COLOR}`}>{showUserDetails.total_score}</span> điểm</p>
            </div>
          </div>
        )}
    </div>
  );
};

export default LeaderBoards;