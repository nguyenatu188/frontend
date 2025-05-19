// src/hooks/usePasswordChange.js
import { useState } from 'react'
import { useAuthContext } from '../context/AuthContext'

const usePasswordChange = () => {
  const { fetchWithAuth } = useAuthContext()
  const [isChanging, setIsChanging] = useState(false)
  const [error, setError] = useState(null)
  const [isSuccess, setIsSuccess] = useState(false)

  const changePassword = async (currentPassword, newPassword, newPasswordConfirmation) => {
    try {
      // Basic client-side validation
      if (!currentPassword || !newPassword || !newPasswordConfirmation) {
        throw new Error('Vui lòng điền đầy đủ tất cả các trường')
      }

      if (newPassword !== newPasswordConfirmation) {
        throw new Error('Mật khẩu mới không khớp')
      }

      setIsChanging(true)
      setError(null)
      setIsSuccess(false)

      const response = await fetchWithAuth('http://127.0.0.1:8000/api/v1/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: newPasswordConfirmation
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Đổi mật khẩu thất bại')
      }

      setIsSuccess(true)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsChanging(false)
    }
  }

  return { changePassword, isChanging, error, isSuccess }
}

export default usePasswordChange
