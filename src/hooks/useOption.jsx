import { useState, useEffect } from 'react';

const useOption = (questionId) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getOptionsByQuestionId = async (questionId, token) => {
    try {
      const response = await fetch(`/questions/${questionId}/options`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Chưa có tùy chọn nào cho câu hỏi này');
      }

      const result = await response.json();
      setData(result.data);
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

    if (!questionId) {
      setError('Question ID is required');
      setLoading(false);
      return;
    }

    console.log('Fetching options for question ID:', questionId);
    setLoading(true);
    getOptionsByQuestionId(questionId, token);
  }, [questionId]);

  const createOption = async (optionData, token) => {
    try {
      setLoading(true);
      const response = await fetch(`/options`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ question_id: questionId, ...optionData })
      });

      if (!response.ok) {
        throw new Error('Không thể tạo tùy chọn');
      }

      const result = await response.json();
      setData([...data, result.data]);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateOption = async (optionId, optionData, token) => {
    try {
      setLoading(true);
      const response = await fetch(`/options/${optionId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ question_id: questionId, ...optionData })
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật tùy chọn');
      }

      const result = await response.json();
      setData(data.map(opt => opt.id === optionId ? result.data : opt));
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteOption = async (optionId, token) => {
    try {
      setLoading(true);
      const response = await fetch(`/options/${optionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Không thể xóa tùy chọn');
      }

      setData(data.filter(opt => opt.id !== optionId));
      return { status: 'success' };
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createOptionsForQuestion = async (optionsData, token) => {
    try {
      setLoading(true);
      const response = await fetch(`/questions/${questionId}/options`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          options: optionsData.map(opt => ({ ...opt, question_id: questionId }))
        })
      });

      if (!response.ok) {
        throw new Error('Không thể tạo nhiều tùy chọn');
      }

      const result = await response.json();
      setData([...data, ...result.data]);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, createOption, updateOption, deleteOption, createOptionsForQuestion };
};

export default useOption;