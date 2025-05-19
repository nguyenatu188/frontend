import { useState, useEffect } from 'react'
import useLogout from '../hooks/useLogout'
import Sidebar from '../components/Sidebar'
import { useAuthContext } from '../context/AuthContext'
import { IoMale, IoFemale, IoMaleFemale } from "react-icons/io5"
import useAvatarUpload from '../hooks/useAvatarUpload'
import { FiUploadCloud, FiEdit } from "react-icons/fi"
import { RiLockPasswordFill } from "react-icons/ri"
import FriendsSidebar from '../components/FriendsSidebar'
import useProfileUpdate from '../hooks/useProfileUpdate'
import usePasswordChange from '../hooks/usePasswordChange'

const Profile = () => {
  const { logout, loading: logoutLoading } = useLogout()
  const { authUser } = useAuthContext()
  const { uploadAvatar, isUploading: avatarUploading, error: avatarError } = useAvatarUpload()
  const [showEditModal, setShowEditModal] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    gender: ''
  })
  const { updateProfile, isUpdating, error: updateError } = useProfileUpdate()

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const { changePassword, isChanging, error: passwordError, isSuccess } = usePasswordChange()

  const handleLogout = () => logout()

  useEffect(() => {
    if (authUser) {
      setFormData({
        full_name: authUser.full_name || '',
        username: authUser.username || '',
        email: authUser.email || '',
        gender: authUser.gender || 'other'
      })
    }
  }, [authUser])

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
                  const file = e.target.files?.[0]
                  if (!file) return
                  
                  try {
                    await uploadAvatar(file)
                  } catch (err) {
                    console.error('Upload error:', err)
                    alert(`Upload thất bại: ${err.message}`)
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

            <button 
              onClick={() => setShowEditModal(true)}
              className="flex text-gray-400 hover:text-blue-500 transition-colors gap-1"
            >
              <FiEdit className="text-xl" />
              <p>Chỉnh sửa hồ sơ</p>
            </button>

            <button
              className="flex text-gray-400 hover:text-blue-500 transition-colors gap-1"
              onClick={() => setShowPasswordModal(true)}
            >
              <RiLockPasswordFill className="text-xl" />
              <p>Thay đổi mật khẩu</p>
            </button>

            <div className="divider divider-info"></div>

            <div className="w-full px-8 flex gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm text-gray-500 mb-1">Current Streak</h3>
                <p className="text-2xl font-bold text-blue-600">{authUser.current_streak} 🔥</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm text-gray-500 mb-1">Longest Streak</h3>
                <p className="text-2xl font-bold text-purple-600">{authUser.longest_streak} 🏆</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-sm">Rank</span>
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

      <FriendsSidebar />
      <div className={`modal ${showEditModal ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-2xl text-blue-500 mb-6">Chỉnh sửa hồ sơ</h3>
          <form onSubmit={async (e) => {
            e.preventDefault()
            try {
              await updateProfile(formData)
              setShowEditModal(false)
            } catch (err) {
              console.error('Update error:', err)
              alert(`Cập nhật thất bại: ${err.message}`)
            }
          }}>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Họ và tên</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập họ tên"
                  className="input input-bordered"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Tên đăng nhập</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên đăng nhập"
                  className="input input-bordered"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="Nhập email"
                  className="input input-bordered"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Giới tính</span>
                </label>
                <div className="flex gap-6">
                  {[
                    { value: 'male', label: 'Nam', color: 'text-blue-500' },
                    { value: 'female', label: 'Nữ', color: 'text-pink-500' },
                    { value: 'other', label: 'Khác', color: 'text-purple-500' }
                  ].map((option) => (
                    <label key={option.value} className="label cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        checked={formData.gender === option.value}
                        onChange={() => setFormData({...formData, gender: option.value})}
                        className={`radio ${option.color}`}
                      />
                      <span className="label-text">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {updateError && (
                <div className="alert alert-error mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{updateError}</span>
                </div>
              )}
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setShowEditModal(false)}
                disabled={isUpdating}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Đang lưu...
                  </>
                ) : 'Xác nhận'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className={`modal ${showPasswordModal ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-2xl text-blue-500 mb-6">Đổi mật khẩu</h3>
          <form onSubmit={async (e) => {
            e.preventDefault()
            try {
              await changePassword(currentPass, newPass, confirmPass)
              if (isSuccess) {
                setCurrentPass('')
                setNewPass('')
                setConfirmPass('')
                setShowPasswordModal(false)
              }
            } catch (err) {
              console.error('Password change error:', err)
            }
          }}>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Mật khẩu hiện tại</span>
                </label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu hiện tại"
                  className="input input-bordered"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  disabled={isChanging}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Mật khẩu mới</span>
                </label>
                <input
                  type="password"
                  placeholder="Nhập mật khẩu mới (ít nhất 8 ký tự)"
                  className="input input-bordered"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  disabled={isChanging}
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Xác nhận mật khẩu mới</span>
                </label>
                <input
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  className="input input-bordered"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  disabled={isChanging}
                />
              </div>

              {passwordError && (
                <div className="alert alert-error mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{passwordError}</span>
                </div>
              )}

              {isSuccess && (
                <div className="alert alert-success mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Đổi mật khẩu thành công!</span>
                </div>
              )}
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setShowPasswordModal(false)
                  setCurrentPass('')
                  setNewPass('')
                  setConfirmPass('')
                }}
                disabled={isChanging}
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isChanging}
              >
                {isChanging ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Đang xử lý...
                  </>
                ) : 'Xác nhận'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
