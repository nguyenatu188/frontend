import { useState } from 'react'
import { useAuthContext } from '../../../context/AuthContext'

const useUpdateOption = () => {
  const { fetchWithAuth } = useAuthContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  const updateOption = async (optionId, optionData) => {
    try {
      // Validate required fields
      if (!optionData.question_id) {
        throw new Error('Câu hỏi không được để trống')
      }
      if (!optionData.option_text?.trim()) {
        throw new Error('Nội dung lựa chọn không được để trống')
      }
      if (typeof optionData.is_correct !== 'boolean' && optionData.is_correct !== 0 && optionData.is_correct !== 1) {
        throw new Error('Trạng thái đúng/sai không hợp lệ')
      }

      setIsSubmitting(true)
      setError(null)

      const response = await fetchWithAuth(
        `http://127.0.0.1:8000/api/v1/options/${optionId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(optionData)
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Cập nhật lựa chọn thất bại')
      }
      
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setIsSubmitting(false)
    }
  }

  return { updateOption, isSubmitting, error }
}

export default useUpdateOption
