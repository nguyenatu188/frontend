import { IoMale, IoFemale, IoMaleFemale } from "react-icons/io5"

const UserProfileModal = ({ user, onClose, isLoading, error }) => {
  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <button 
          className="btn btn-sm btn-circle absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        
        {isLoading && (
          <div className="text-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
            <p className="mt-2 text-gray-500">Đang tải thông tin...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {user && !isLoading && !error && (
          <div className="flex flex-col items-center gap-5">
            {/* Avatar Section */}
            <div className="relative">
              {user.avatar === 'default-avatar.png' ? (
                <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center text-2xl font-semibold text-white">
                  {user.full_name 
                    ? user.full_name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
                    : user.username[0].toUpperCase()}
                </div>
              ) : (
                <img
                  src={`http://127.0.0.1:8000/storage/avatars/${user.avatar}`}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full object-cover"
                />
              )}
            </div>

            {/* User Info */}
            <div className="text-center">
              <p className="text-3xl font-semibold text-blue-400">{user.full_name || user.username}</p>
              <div className="flex items-center justify-center gap-2 mt-2">
                <p className="text-xl text-gray-500">@{user.username}</p>
                {user.gender === 'male' ? (
                  <IoMale className="text-blue-500 text-lg" />
                ) : user.gender === 'female' ? (
                  <IoFemale className="text-pink-500 text-lg" />
                ) : (
                  <IoMaleFemale className="text-purple-500 text-lg" />
                )}
              </div>
              <p className="text-lg text-gray-500 mt-1">{user.email}</p>
              <p className="text-lg text-gray-500">
                Bắt đầu học từ: {new Date(user.createdAt).toLocaleDateString('vi-VN', {
                  month: '2-digit',
                  year: 'numeric'
                })}
              </p>
            </div>

            {/* Streaks */}
            <div className="w-full px-8 flex gap-4 mt-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1">
                <h3 className="text-sm text-gray-500 mb-1">Current Streak</h3>
                <p className="text-2xl font-bold text-blue-600">{user.currentStreak} 🔥</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-1">
                <h3 className="text-sm text-gray-500 mb-1">Longest Streak</h3>
                <p className="text-2xl font-bold text-purple-600">{user.longestStreak} 🏆</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Rank</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UserProfileModal
