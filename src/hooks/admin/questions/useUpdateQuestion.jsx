import { useState } from 'react'
import { useAuthContext } from '../../../context/AuthContext'

const useUpdateQuestion = () => {
  const { fetchWithAuth } = useAuthContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const updateQuestion = async (questionId, questionData) => {
    try {
      // Validate required fields
      if (!questionData.question_text?.trim()) {
        throw new Error('Nội dung câu hỏi không được để trống')
      }

      setIsSubmitting(true)
      setError(null)

      // Gửi request PUT đến API
      const response = await fetchWithAuth(
        `http://127.0.0.1:8000/api/v1/questions/${questionId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question_text: questionData.question_text,
            explanation: questionData.explanation
          })
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Cập nhật câu hỏi thất bại')
      }
      
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return { updateQuestion, isSubmitting, error }
}

export default useUpdateQuestion
