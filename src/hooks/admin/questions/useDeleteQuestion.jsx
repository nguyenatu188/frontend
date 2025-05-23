import { useState } from 'react'
import { useAuthContext } from '../../../context/AuthContext'

const useDeleteQuestion = () => {
  const { fetchWithAuth } = useAuthContext()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(null)

  const deleteQuestion = async (questionId) => {
    try {
      setIsDeleting(true)
      setError(null)

      const response = await fetchWithAuth(
        `http://localhost:8000/api/v1/questions/${questionId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Xóa câu hỏi thất bại')
      }
      
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  return { deleteQuestion, isDeleting, error }
}

export default useDeleteQuestion
