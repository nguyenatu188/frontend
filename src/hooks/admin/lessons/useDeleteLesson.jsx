import { useState } from 'react'
import { useAuthContext } from '../../../context/AuthContext'

const useDeleteLesson = () => {
  const { fetchWithAuth } = useAuthContext()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(null)

  const deleteLesson = async (lessonId) => {
    try {
      setIsDeleting(true)
      setError(null)

      const response = await fetchWithAuth(
        `http://localhost:8000/api/v1/lessons/${lessonId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Xóa bài học thất bại')
      }
      
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsDeleting(false)
    }
  }

  return { deleteLesson, isDeleting, error }
}

export default useDeleteLesson
