
import { useState, useEffect } from 'react'

const useLesson = (category) => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [trigger, setTrigger] = useState(0)

  const getLessonByCategory = async (category, token) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/lessons/category?category=${category}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Chưa có bài học nào cho danh mục này')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    
    if (!token) {
      setError('Token is required')
      setLoading(false)
      return
    }

    console.log('Fetching data for category:', category)
    setLoading(true)
    getLessonByCategory(category, token)
  }, [category, trigger])

  const refetch = () => setTrigger(prev => prev + 1)

  return { data, loading, error, refetch }
}

export default useLesson
