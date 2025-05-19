import { useState } from 'react'
import useLogout from '../hooks/useLogout'
import useFriends from '../hooks/useFriends'
import Sidebar from '../components/Sidebar'
import { useAuthContext } from '../context/AuthContext'
import { IoMale, IoFemale, IoMaleFemale } from "react-icons/io5"
import useAvatarUpload from '../hooks/useAvatarUpload'
import { FiUploadCloud } from "react-icons/fi"

const Profile = () => {
  const friendsApi = useFriends()
  const [showSearchPopup, setShowSearchPopup] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  const [searchInput, setSearchInput] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [activeTab, setActiveTab] = useState('sent')
  const { logout, loading: logoutLoading } = useLogout()
  const { authUser } = useAuthContext()
  const { uploadAvatar, isUploading: avatarUploading, error: avatarError } = useAvatarUpload()

  const handleLogout = () => logout()

  const openSearchPopup = async () => {
    try {
      const users = await friendsApi.getAllUsers()
      setAllUsers(users)
      setShowSearchPopup(true)
    } catch (err) {
      console.error("Lỗi khi tải danh sách người dùng:", err)
    }
  }

  const renderUserStatus = (user) => {
    const isFriend = friendsApi.friends.some(f => f.user_id === user.user_id)
    if (isFriend) return <span className="text-sm text-gray-400">Bạn bè</span>

    const hasSent = friendsApi.friendRequestsSent.some(r => r.receiver?.user_id === user.user_id)
    if (hasSent) return <span className="text-sm text-blue-500">Đã gửi lời mời</span>

    const hasReceived = friendsApi.friendRequests.some(r => r.sender?.user_id === user.user_id)
    if (hasReceived) {
      const requestId = friendsApi.friendRequests.find(r => r.sender?.user_id === user.user_id)?.request_id
      return (
        <button
          className="text-sm text-green-600 hover:underline"
          onClick={() => friendsApi.acceptFriendRequest(requestId)}
        >
          Chấp nhận
        </button>
      )
    }

    return (
      <button
        className="text-sm text-green-600 hover:underline"
        onClick={() => friendsApi.sendFriendRequest(user.user_id)}
      >
        Kết bạn
      </button>
    )
  }

  return (
    <div className="flex">
      <Sidebar/>
      <div className="h-screen w-full flex flex-col justify-between items-center bg-white border-r pl-64">
        {/* Avatar Section */}
        {authUser && (
          <div className="flex flex-col items-center gap-5 mt-5">
            <div className="relative group">
              {authUser.avatar === 'default-avatar.png' ? (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-semibold text-white cursor-pointer hover:opacity-80 transition-opacity">
                  {authUser.full_name 
                    ? authUser.full_name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
                    : authUser.username[0].toUpperCase()}
                </div>
              ) : (
                <img
                  src={`http://127.0.0.1:8000/storage/avatars/${authUser.avatar}`}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                />
              )}
              
              {/* Upload overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <FiUploadCloud className="text-white text-xl mb-1" />
                <span className="text-white text-xs text-center">Đổi avatar</span>
              </div>

              <input
                type="file"
                accept="image/jpeg, image/png, image/jpg, image/gif"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  
                  try {
                    await uploadAvatar(file);
                  } catch (err) {
                    console.error('Upload error:', err);
                    // Hiển thị thông báo lỗi cho người dùng
                    alert(`Upload thất bại: ${err.message}`);
                  }
                }}
                disabled={avatarUploading}
              />
            </div>

            {avatarUploading && (
              <p className="text-sm text-blue-500 mt-2">Đang tải lên...</p>
            )}

            {avatarError && (
              <p className="text-sm text-red-500 mt-2">{avatarError}</p>
            )}

            {/* Thống tin người dùng */}
            <div className="text-center">
              <p className="text-3xl font-semibold text-blue-400">{authUser.full_name || authUser.username}</p>
              <div className="flex items-center justify-center gap-2">
                <p className="text-xl text-gray-500">@{authUser.username}</p>
                {/* Hiển thị icon giới tính */}
                {authUser.gender === 'male' ? (
                  <IoMale className="text-blue-500 text-lg" />
                ) : authUser.gender === 'female' ? (
                  <IoFemale className="text-pink-500 text-lg" />
                ) : (
                  <IoMaleFemale className="text-purple-500 text-lg" />
                )}
              </div>
              
              <p className="text-lg text-gray-500">{authUser.email}</p>
              
              <p className="text-lg text-gray-500">
                Bắt đầu học từ: {new Date(authUser.created_at).toLocaleDateString('vi-VN', {
                  month: '2-digit',
                  year: 'numeric'
                })}
              </p>
            </div>

            <div className="divider divider-info"></div>

            {/* Thêm phần stats grid ở đây */}
            <div className="w-full px-8 grid grid-cols-2 gap-4">
              {/* Current Streak */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm text-gray-500 mb-1">Current Streak</h3>
                <p className="text-2xl font-bold text-blue-600">{authUser.current_streak} 🔥</p>
              </div>

              {/* Longest Streak */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm text-gray-500 mb-1">Longest Streak</h3>
                <p className="text-2xl font-bold text-purple-600">{authUser.longest_streak} 🏆</p>
              </div>

              {/* Coming Soon 1 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Coming soon...</span>
              </div>

              {/* Coming Soon 2 */}
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Coming soon...</span>
              </div>
            </div>

            <div className="divider divider-info"></div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Linh vật</span>
            </div>
            
          </div>
        )}
        
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className="px-6 py-3 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 mb-5"
        >
          {logoutLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}
        </button>
      </div>

      {/* 1/3 phải */}
      <div className="w-1/3 px-6 pt-20 bg-gray-50 overflow-auto space-y-4">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex border-b">
            <button
              className={`flex-1 px-4 py-2 text-sm font-semibold text-center ${activeTab === 'sent' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('sent')}
            >
              Lời mời đã gửi
            </button>
            <button
              className={`flex-1 px-4 py-2 text-sm font-semibold text-center ${activeTab === 'friends' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-400'}`}
              onClick={() => setActiveTab('friends')}
            >
              Bạn bè
            </button>
          </div>

          <div className="p-4">
            {friendsApi.loading ? (
              <p className="text-sm text-gray-500 text-center">Đang tải...</p>
            ) : activeTab === 'sent' ? (
              friendsApi.friendRequestsSent.length === 0 ? (
                <p className="text-sm text-gray-500 text-center">Chưa có lời mời nào</p>
              ) : (
                <ul className="text-sm text-gray-800 space-y-2">
                  {friendsApi.friendRequestsSent.map((req) => (
                    <li key={req.request_id} className="flex justify-between items-center border-b pb-1">
                      <span>{req.receiver?.full_name || req.receiver?.username}</span>
                      <button
                        onClick={() => friendsApi.revokeSentRequest(req.request_id)}
                        className="text-xs text-blue-500 hover:underline"
                      >
                        Thu hồi
                      </button>
                    </li>
                  ))}
                </ul>
              )
            ) : friendsApi.friends.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">Chưa có bạn bè nào</p>
            ) : (
              <ul className="text-sm text-gray-800 space-y-2">
                {friendsApi.friends.map((user) => (
                  <li key={user.user_id} className="flex justify-between items-center border-b pb-1">
                    <span>{user.full_name || user.username}</span>
                    <button
                      onClick={() => friendsApi.deleteFriend(user.user_id)}
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

        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Thêm bạn bè</h3>
          <ul className="space-y-3">
            <li
              onClick={openSearchPopup}
              className="flex justify-between items-center cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
            >
              <div className="flex items-center gap-2">
                <span role="img" aria-label="search">🔍</span>
                <span className="text-sm text-gray-700 font-medium">Tìm bạn bè</span>
              </div>
              <span className="text-gray-400">›</span>
            </li>
          </ul>
        </div>
      </div>

      {showSearchPopup && (
        <div className="absolute top-24 right-6 z-50 bg-white w-96 p-6 rounded shadow-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Tìm bạn bè</h2>
            <button className="text-red-500" onClick={() => setShowSearchPopup(false)}>✕</button>
          </div>

          <div className="flex mb-4 gap-2">
            <input
              className="flex-1 border px-3 py-2 rounded"
              type="text"
              placeholder="Nhập username..."
              value={searchInput}
              onChange={(e) => {
                const val = e.target.value
                setSearchInput(val)
                setSearchResults(
                  val.trim() === ""
                    ? []
                    : allUsers.filter(u =>
                        u.username.toLowerCase().includes(val.toLowerCase())
                      )
                )
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setSearchResults(
                    allUsers.filter(u =>
                      u.username.toLowerCase().includes(searchInput.toLowerCase())
                    )
                  )
                }
              }}
            />
            <button
              className="bg-blue-500 text-white px-3 rounded"
              onClick={() => {
                setSearchResults(
                  allUsers.filter(u =>
                    u.username.toLowerCase().includes(searchInput.toLowerCase())
                  )
                )
              }}
            >
              Tìm
            </button>
          </div>

          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {searchResults.length === 0 ? (
              <li className="text-sm text-gray-500 text-center">Không có kết quả</li>
            ) : (
              searchResults.map((user) => (
                <li key={user.user_id} className="flex justify-between items-center border-b pb-1">
                  <span>{user.username}</span>
                  {renderUserStatus(user)}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Profile
