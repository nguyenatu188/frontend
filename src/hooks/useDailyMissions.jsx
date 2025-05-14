import { useState, useEffect } from 'react';

const useDailyMissions = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getMissions = async (token) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/daily-missions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch missions');
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

    console.log('Fetching missions');
    setLoading(true);
    getMissions(token);
  }, []);

  return { data, loading, error };
};
export default useDailyMissions;