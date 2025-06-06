import { useState } from 'react'
import { useAuthContext } from '../../../context/AuthContext'

const useUpdateLesson = () => {
  const { fetchWithAuth } = useAuthContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const updateLesson = async (lessonId, lessonData) => {
    try {
      if (!lessonData.title?.trim()) {
        throw new Error('Tiêu đề bài học không được để trống')
      }
      if (!lessonData.time_limit && typeof lessonData.time_limit !== 'number') {
        throw new Error('Thời gian làm bài trống hoặc không phải là số')
      }

      setIsSubmitting(true)
      setError(null)

      const response = await fetchWithAuth(
        `http://127.0.0.1:8000/api/v1/lessons/${lessonId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(lessonData)
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Cập nhật bài học thất bại')
      }
      
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return { updateLesson, isSubmitting, error }
}

export default useUpdateLesson
