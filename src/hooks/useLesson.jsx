
import { useState, useEffect } from 'react';

const useLesson = (category) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getLessonByCategory = async (category, token) => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/lessons/category?category=${category}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('Token is required');
      setLoading(false);
      return;
    }

    console.log('Fetching data for category:', category);
    setLoading(true);
    getLessonByCategory(category, token);
  }, [category]);

  return { data, loading, error };
};

export default useLesson;