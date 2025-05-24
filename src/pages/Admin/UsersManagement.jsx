import { useState, useEffect } from 'react'
import AdminSidebar from '../../components/admin/AdminSidebar'
import useFriends from '../../hooks/useFriends'
import { IoMale, IoFemale, IoMaleFemale } from "react-icons/io5"
import useLeaderboard from '../../hooks/useLeaderboard'

const UsersManagement = () => {
  const { getAllUsers } = useFriends()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [detailPosition, setDetailPosition] = useState({ x: 0, y: 0 })

  const { leaderboard, fetchLeaderboard } = useLeaderboard()
  const [usernameRankMap, setUsernameRankMap] = useState(new Map())

  const [searchTerm, setSearchTerm] = useState('')

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getAllUsers()
        setUsers(data)
        await fetchLeaderboard(data.length + 1) // +1 vì get all user không trả về user hiện tại
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [fetchLeaderboard])

  useEffect(() => {
    // Tạo map từ leaderboard data
    const allLeaderboardUsers = Object.values(leaderboard).flat()
    const newMap = new Map()
    allLeaderboardUsers.forEach(user => {
      newMap.set(user.username, user.rank)
    })
    setUsernameRankMap(newMap)
    console.log('Updated usernameRankMap:', usernameRankMap)
  }, [leaderboard])

  const handleMoreClick = (user, event) => {
    setSelectedUser(user)
    setDetailPosition({
      x: event.clientX - 200,
      y: event.clientY + 20
    })
  }

  const closeDetail = () => {
    setSelectedUser(null)
  }

  if (loading) return <div className='flex items-center justify-center h-screen'>Loading...</div>
  if (error) return <div className='flex items-center justify-center h-screen'>Error: {error}</div>

  return (
    <div className='flex min-h-screen bg-gray-100'>
      <AdminSidebar />
      
      <div className='flex flex-col items-center h-screen mx-auto p-8 pl-64'>
        <h1 className='text-2xl font-bold mb-6 text-gray-700'>Quản lý người dùng</h1>

        <div className="w-full max-w-4xl mb-4">
          <input
            type="text"
            placeholder="Tìm kiếm theo username hoặc họ tên"
            className="w-full px-4 py-2 text-gray-700 border border-gray-700 rounded-lg focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'></th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Giới tính</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Username</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Họ tên</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Email</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'></th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredUsers.map(user => (
                <tr key={user.user_id} className='hover:bg-gray-50'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <img 
                      src={`http://localhost:8000/storage/avatars/${user.avatar}`}
                      alt='avatar'
                      className='w-10 h-10 rounded-full object-cover'
                    />
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {user.gender === 'male' ? (
                      <IoMale className="text-blue-500 text-lg" />
                    ) : user.gender === 'female' ? (
                      <IoFemale className="text-pink-500 text-lg" />
                    ) : (
                      <IoMaleFemale className="text-purple-500 text-lg" />
                    )}
                  </td>
                  <td className='px-6 py-4 text-gray-700 whitespace-nowrap'>{user.username}</td>
                  <td className='px-6 py-4 text-gray-700 whitespace-nowrap'>{user.full_name}</td>
                  <td className='px-6 py-4 text-gray-700 whitespace-nowrap'>{user.email}</td>
                  <td className='px-6 py-4 text-gray-700 whitespace-nowrap'>
                    <button 
                      onClick={(e) => handleMoreClick(user, e)}
                      className='text-blue-600 hover:text-blue-900'
                    >
                      More
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedUser && (
          <>
            <div 
              className='fixed inset-0 z-50' 
              onClick={closeDetail}
            ></div>
            <div 
              className='absolute z-50 bg-white p-4 rounded-lg shadow-lg border border-gray-200'
              style={{
                left: `${detailPosition.x}px`,
                top: `${detailPosition.y}px`
              }}
            >
              <div className='space-y-2 text-gray-700'>
                <p><strong>Current Streak:</strong> {selectedUser.current_streak}</p>
                <p><strong>Longest Streak:</strong> {selectedUser.longest_streak}</p>
                <p><strong>Coins:</strong> {selectedUser.coins}</p>
                <p><strong>Ngày tham gia:</strong> {new Date(selectedUser.created_at).toLocaleDateString()}</p>
                <p><strong>Rank:</strong> {usernameRankMap.get(selectedUser.username) || 'Loading...'}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default UsersManagement
