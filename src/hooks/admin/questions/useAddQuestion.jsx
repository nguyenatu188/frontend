import { useState } from 'react'
import { useAuthContext } from '../../../context/AuthContext'

const useAddQuestion = () => {
  const { fetchWithAuth } = useAuthContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const createQuestion = async (questionData) => {
    try {
      // Validate required fields
      if (!questionData.lesson_id) {
        throw new Error('Bài học không được để trống')
      }
      if (!questionData.question_text?.trim()) {
        throw new Error('Nội dung câu hỏi không được để trống')
      }

      setIsSubmitting(true)
      setError(null)

      const response = await fetchWithAuth('http://127.0.0.1:8000/api/v1/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...questionData,
          // Đảm bảo content là null nếu không có giá trị
          content: questionData.content || null
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Thêm câu hỏi thất bại')
      }
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return { createQuestion, isSubmitting, error }
}

export default useAddQuestion
