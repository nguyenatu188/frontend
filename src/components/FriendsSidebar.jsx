import { useState } from 'react'
import useFriends from '../hooks/useFriends'

const FriendsSidebar = () => {
  const friendsApi = useFriends()
  const [showSearchPopup, setShowSearchPopup] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  const [searchInput, setSearchInput] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [activeTab, setActiveTab] = useState('sent')

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
    <>
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
            <h2 className="text-lg text-gray-700 font-semibold">Tìm bạn bè</h2>
            <button className="text-red-500" onClick={() => setShowSearchPopup(false)}>✕</button>
          </div>

          <div className="flex mb-4 gap-2">
            <input
              className="flex-1 text-gray-700 border px-3 py-2 rounded"
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
    </>
  )
}

export default FriendsSidebar
