// src/hooks/useUserDetail.js
import { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'

const useUserDetail = () => {
  const { fetchWithAuth } = useAuthContext()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const getUserDetail = async (userId) => {
    try {
      setIsLoading(true)
      const response = await fetchWithAuth(`http://localhost:8000/api/v1/users/${userId}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Lỗi khi lấy thông tin')
      return data.data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return { getUserDetail, isLoading, error }
}

export default useUserDetail
