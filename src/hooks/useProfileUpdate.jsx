// Tạo file src/hooks/useProfileUpdate.js
import { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'

const useProfileUpdate = () => {
  const { fetchWithAuth, setAuthUser } = useAuthContext()
  const [isUpdating, setIsUpdating] = useState(false)
  const [error, setError] = useState(null)

  const updateProfile = async (formData) => {
    try {
      if (!formData.username.trim()) {
        throw new Error('Tên đăng nhập không được để trống')
      }
      if (!formData.email.trim()) {
        throw new Error('Email không được để trống')
      }
      
      setIsUpdating(true)
      setError(null)

      const response = await fetchWithAuth('http://127.0.0.1:8000/api/v1/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Cập nhật thất bại')
      }

      setAuthUser(prev => ({ ...prev, ...formData }))
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsUpdating(false)
    }
  }

  return { updateProfile, isUpdating, error }
}

export default useProfileUpdate
