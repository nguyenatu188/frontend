// src/hooks/useUpdateMascotActive.js
import { useState } from 'react';

const useUpdateMascotActive = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const updateMascotActive = async (mascotId) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`http://localhost:8000/api/v1/mascot/active/${mascotId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to update mascot status');
      }

      setData(responseData.data);
      return responseData.data;

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateMascotActive,
    loading,
    error,
    data
  };
};

export default useUpdateMascotActive;