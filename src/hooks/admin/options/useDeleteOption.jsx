import { useState } from 'react'
import { useAuthContext } from '../../../context/AuthContext'

const useDeleteOption = () => {
  const { fetchWithAuth } = useAuthContext()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(null)

  const deleteOption = async (optionId) => {
    try {
      setIsDeleting(true)
      setError(null)

      const response = await fetchWithAuth(
        `http://localhost:8000/api/v1/options/${optionId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Xóa option thất bại')
      }
      
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  return { deleteOption, isDeleting, error }
}

export default useDeleteOption
