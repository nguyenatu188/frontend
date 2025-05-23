import { useState } from 'react'
import { useAuthContext } from '../../../context/AuthContext'

const useAddOptions = () => {
  const { fetchWithAuth } = useAuthContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const addOptions = async (questionId, options) => {
    try {
      if (!questionId) {
        throw new Error('ID câu hỏi không được để trống')
      }
      if (!Array.isArray(options) || options.length === 0) {
        throw new Error('Danh sách lựa chọn không được để trống')
      }
      
      // Validate từng option
      options.forEach((option, index) => {
        if (!option.option_text?.trim()) {
          throw new Error(`Lựa chọn ${index + 1} chưa có nội dung`)
        }
        if (typeof option.is_correct !== 'boolean' && option.is_correct !== 0 && option.is_correct !== 1) {
          throw new Error(`Trạng thái đúng/sai của lựa chọn ${index + 1} không hợp lệ hoặc trống`)
        }
      })

      setIsSubmitting(true)
      setError(null)

      const response = await fetchWithAuth(
        `http://127.0.0.1:8000/api/v1/questions/${questionId}/options`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ options }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Thêm lựa chọn thất bại')
      }

      return data.data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return { addOptions, isSubmitting, error }
}

export default useAddOptions
