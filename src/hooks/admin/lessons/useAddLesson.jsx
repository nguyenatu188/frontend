import { useState } from 'react'
import { useAuthContext } from '../../../context/AuthContext'

const useAddLesson = () => {
  const { fetchWithAuth } = useAuthContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const createLesson = async (lessonData) => {
    try {
      if (!lessonData.title?.trim()) {
        throw new Error('Tiêu đề bài học không được để trống')
      }
      if (!lessonData.category?.trim()) {
        throw new Error('Danh mục bài học không được để trống')
      }
      if (!lessonData.time_limit && typeof lessonData.time_limit !== 'number') {
        throw new Error('Thời gian làm bài để trống hoặc khong phải là số')
      }

      setIsSubmitting(true)
      setError(null)

      const response = await fetchWithAuth('http://127.0.0.1:8000/api/v1/lessons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lessonData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Tạo bài học thất bại')
      }
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return { createLesson, isSubmitting, error }
}

export default useAddLesson
