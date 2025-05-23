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
    if (result.success && Array.isArray(result.data)) {
      const dates = result.data.map(item => item.checkin_date);
      setCheckedInDates(dates);
    } else {
      setCheckedInDates([]);
    }
  } catch (err) {
    setError('Không thể tải dữ liệu điểm danh');
    setCheckedInDates([]);
    console.log(err);
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
