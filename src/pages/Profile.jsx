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
import RightSidebar from '../components/RightSidebar'
import EditProfileModal from '../components/EditProfileModal'
import ChangePasswordModal from '../components/ChangePasswordModal'

import bronzeImg from '../assets/bronze.jpg'
import silverImg from '../assets/silver.jpg'
import goldImg from '../assets/gold.jpg'
import platinumImg from '../assets/platinum.jpg'
import diamondImg from '../assets/diamond.jpg'
import useLeaderboard from '../hooks/useLeaderboard'

import BoughtMascotsModal from '../components/BoughtMascotsModal'
import useBoughtMascots from '../hooks/useBoughtMascots'
import useUpdateMascotActive from '../hooks/useUpdateMascotActive'

const rankTiers = [
  { name: 'Bronze', image: bronzeImg },
  { name: 'Silver', image: silverImg },
  { name: 'Gold', image: goldImg },
  { name: 'Platinum', image: platinumImg },
  { name: 'Diamond', image: diamondImg }, 
];

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

  const { userRank } = useLeaderboard()

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const { changePassword, isChanging, error: passwordError, isSuccess } = usePasswordChange()

  const [showMascotsModal, setShowMascotsModal] = useState(false)

  const { updateMascotActive, loading: updatingActive } = useUpdateMascotActive()

  const handleToggleActive = async (mascotId) => {
    try {
      await updateMascotActive(mascotId);
      if (refetchMascots) {
        refetchMascots();
      }
    } catch (error) {
      console.error('Failed to update mascot active status:', error);
    }
  };

  const {
    boughtMascots,
    mascotImages,
    expandedMascot,
    loading: mascotsLoading,
    error: mascotsError,
    toggleMascot,
    refetch: refetchMascots,
    activeMascotImage
  } = useBoughtMascots()
  
  const handleLogout = () => logout()

  const getRankImage = (rankName) => {
    const tier = rankTiers.find((t) => t.name === rankName);
    return tier ? tier.image : goldImg; 
  };

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
              <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm text-gray-500 mb-1">Current Streak</h3>
                <p className="text-2xl font-bold text-blue-600">{authUser.current_streak} 🔥</p>
              </div>

              <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-sm text-gray-500 mb-1">Longest Streak</h3>
                <p className="text-2xl font-bold text-purple-600">{authUser.longest_streak} 🏆</p>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center justify-center">
                {userRank ? (
                  <div className="flex flex-col items-center justify-center">
                    <p className={`text-sm text-gray-500 mb-1`}>
                      Rank: <span className={`font-bold text-gray-500`}>{userRank.rank}</span>
                    </p>
                    <img
                          src={getRankImage(userRank.rank)}
                          alt={`${userRank.rank} rank icon`}
                          className="inline-block h-20 w-20 object-contain"
                    />
                  </div>
                ) : (
                  <p className={`text-lg text-gray-700 text-center w-full`}>Loading...</p>
                )}
              </div>
            </div>

            <div className="divider divider-info"></div>

            <button
              className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full max-w-md flex items-center justify-center hover:bg-gray-50 transition-colors"
              onClick={() => setShowMascotsModal(true)}
            >
              <span className="text-gray-400 text-md tracking-wide">Linh vật</span>
            </button>
            
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
      <EditProfileModal
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          formData={formData}
          setFormData={setFormData}
          handleSubmit={async (e) => {
            e.preventDefault()
            try {
              await updateProfile(formData)
              setShowEditModal(false)
            } catch (err) {
              console.error('Update error:', err)
              alert(`Cập nhật thất bại: ${err.message}`)
            }
          }}
          isUpdating={isUpdating}
          updateError={updateError}
        />

      <ChangePasswordModal
        showModal={showPasswordModal}
        setShowModal={setShowPasswordModal}
        currentPass={currentPass}
        setCurrentPass={setCurrentPass}
        newPass={newPass}
        setNewPass={setNewPass}
        confirmPass={confirmPass}
        setConfirmPass={setConfirmPass}
        handleSubmit={async (e) => {
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
        }}
        isChanging={isChanging}
        passwordError={passwordError}
        isSuccess={isSuccess}
      />

      <BoughtMascotsModal
        isOpen={showMascotsModal}
        onClose={() => setShowMascotsModal(false)}
        boughtMascots={boughtMascots}
        mascotImages={mascotImages}
        expandedMascot={expandedMascot}
        toggleMascot={toggleMascot}
        loading={mascotsLoading || updatingActive}
        error={mascotsError}
        onToggleActive={handleToggleActive}
      />

      {activeMascotImage && (
        <div className="absolute bottom-5 right-25 flex items-center justify-center w-42 h-42">
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

      <FriendsSidebar />
      <RightSidebar />
    </div>
  )
}

export default Profile
