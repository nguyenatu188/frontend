import { useState, useEffect } from 'react';

const useCheckIn = () => {
  const [checkedInDates, setCheckedInDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCheckInDateHistory = async (token) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/check-in/datehistory', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Lấy lịch sử điểm danh thất bại');
      }

      const result = await response.json();

      // result là mảng các chuỗi ngày dạng "yyyy-MM-dd"
      setCheckedInDates(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Token không tồn tại');
      setLoading(false);
      return;
    }

    fetchCheckInDateHistory(token);
  }, []);

return { checkedInDates, loading, error, setCheckedInDates };
};

export default useCheckIn;
